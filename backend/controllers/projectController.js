const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User')

// @desc Create a new project
// @route POST /api/projects
// @access Private (Admin)
const createProject = async (req, res) => {
    try {
        const { name, description, startDate, endDate, status } = req.body;
        const newProject = new Project({
            name,
            description,
            startDate,
            endDate,
            status,
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: "Error creating project", error: error.message });
    }
};

// @desc Get all projects
// @route GET /api/projects
// @access Private (Admin)

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isDeleted: false }).populate('tasks', 'title status');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error: error.message });
    }
};

// @desc Update a project
// @route PUT /api/projects/:id
// @access Private (Admin)
const updateProject = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: "Error updating project", error: error.message });
    }
};

// @desc soft Delete a project
// @route DELETE /api/projects/:id
// @access Private (Admin)

const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Mark the project as deleted
        project.isDeleted = true;
        await project.save();

        res.status(200).json({ message: 'Project soft-deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error soft-deleting project", error: error.message });
    }
};

// @desc Assign tasks to a project
// @route PUT /api/projects/:id/assign-tasks
// @access Private (Admin)
const assignTasksToProject = async (req, res) => {
    const { id } = req.params;
    const { taskIds } = req.body;

    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Find tasks and update them to be linked to the project
        const tasks = await Task.updateMany(
            { _id: { $in: taskIds } },
            { $set: { project: id } }
        );

        project.tasks.push(...taskIds);
        await project.save();

        res.status(200).json({ message: "Tasks assigned to project successfully", project });
    } catch (error) {
        res.status(500).json({ message: "Error assigning tasks to project", error: error.message });
    }
};


//@desc Assign users to a project
//@route PUT /api/projects/:projectId/assign-users
//@access Private (Admin)

const assignUsersToProject = async (req, res) => {
    try {
        const { userIds } = req.body;

        const users = await User.find({ '_id': { $in: userIds } });
        if (users.length !== userIds.length) {
            return res.status(400).json({ message: "One or more users are invalid" });
        }

        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const newUserIds = userIds.filter(id => !project.assignedUsers.includes(id));

        project.assignedUsers = [...new Set([...project.assignedUsers, ...newUserIds])];
        await project.save();

        res.status(200).json({ message: "Users assigned to project successfully", project });
    } catch (error) {
        res.status(500).json({ message: "Error assigning users to project", error: error.message });
    }
};



// @desc Get projects assigned to a particular user
// @route GET /api/projects/user/:userId
// @access Private (Admin or Member)
const getProjectsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const projects = await Project.find({ assignedUsers: userId }).populate('tasks', 'title status');
        const projectCount = projects.length;

        res.status(200).json({
            count: projectCount,
            projects,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user's projects", error: error.message });
    }
}

// @desc Get projects assigned to a particular user with analytics
// @route GET /api/projects/user/:userId
// @access Private (Admin or Member)
const getProjectsByUserWithAnalytics = async (req, res) => {
    const { userId } = req.params;
    try {
        const projects = await Project.find({ assignedUsers: userId }).populate('tasks');

        const projectAnalytics = projects.map(project => {
            const totalTasks = project.tasks.length;

            const statusCounts = project.tasks.reduce(
                (acc, task) => {
                    acc[task.status] = (acc[task.status] || 0) + 1;
                    return acc;
                },
                { Pending: 0, "In Progress": 0, Completed: 0 }
            );

            return {
                projectId: project._id,
                projectName: project.name,
                totalTasks,
                statusCounts,
                startDate: project.startDate,
                endDate: project.endDate,
                projectStatus: project.status,
            };
        });

        res.status(200).json({
            userId,
            projectCount: projects.length,
            projects: projectAnalytics,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user's projects", error: error.message });
    }
};


// @desc Get overall analytics for admin
// @route GET /api/projects/admin/analytics
// @access Private (Admin)
const getProjectsByAdminAnalytics = async (req, res) => {
    try {
        const projects = await Project.find({ isDeleted: false }).populate('tasks').populate('assignedUsers');

        const totalProjects = projects.length;

        const analytics = projects.reduce(
            (acc, project) => {
                acc.totalTasks += project.tasks.length;

                project.tasks.forEach(task => {
                    acc.taskStatusCounts[task.status] = (acc.taskStatusCounts[task.status] || 0) + 1;
                });

                project.assignedUsers.forEach(user => {
                    acc.userProjectCounts[user._id] = (acc.userProjectCounts[user._id] || 0) + 1;
                });

                acc.projectStatusCounts[project.status] = (acc.projectStatusCounts[project.status] || 0) + 1;

                return acc;
            },
            {
                totalTasks: 0,
                taskStatusCounts: {},
                userProjectCounts: {},
                projectStatusCounts: {},
            }
        );

        const users = await User.find({ _id: { $in: Object.keys(analytics.userProjectCounts) } });

        const userAnalytics = users.map(user => ({
            userId: user._id,
            name: user.name,
            email: user.email,
            projectsCount: analytics.userProjectCounts[user._id] || 0,
        }));

        res.status(200).json({
            totalProjects,
            totalTasks: analytics.totalTasks,
            taskStatusCounts: analytics.taskStatusCounts,
            projectStatusCounts: analytics.projectStatusCounts,
            userAnalytics,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching admin analytics", error: error.message });
    }
};


module.exports = {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
    assignTasksToProject,
    assignUsersToProject,
    getProjectsByUser,
    getProjectsByUserWithAnalytics,
    getProjectsByAdminAnalytics
};
