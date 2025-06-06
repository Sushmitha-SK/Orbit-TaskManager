const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const { format } = require("date-fns");
const nodemailer = require("nodemailer");

//@desc Get all tasks  (Admin: al, User: only assigned tasks)
//@route GET /api/tasks/
//@access Private
const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};
        if (status) {
            filter.status = status;
        }
        let tasks;
        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }

        //Add completed todoChecklist count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter((item) => item.completed).length;
                return { ...task._doc, completedTodoCount: completedCount };
            })
        );

        //Status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        res.json({
            tasks, statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//@desc Get task by ID
//@route GET /api/tasks/:id
//@access Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//@desc Create a new task (Admin only)
//@route POST /api/tasks/
//@access Private (Admin)
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist, projectId } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
        }

        // Fetch project details
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments,
            project: { id: project._id, name: project.name },
        });



        const assignedUsers = await User.find({ _id: { $in: assignedTo } }).select("name email");

        assignedUsers.forEach(async (user) => {

            const formattedDueDate = dueDate
                ? format(new Date(dueDate), "MMMM do, yyyy 'at' h:mm a")
                : "No due date specified";

            const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="font-family: 'Poppins', sans-serif; font-size: 1.5rem; font-weight: 800; display: flex; flex-wrap: wrap; margin-bottom: 20px;">
                <span style="color: #333;">Orbit</span>
                <span style="color: #1368EC;">.</span>
            </h1>
            <h2 style="color: #1368EC;">New Task Assigned</h2>
            <p>Dear ${user.name || "User"},</p>
            <p>You have been assigned a new task. Here are the details:</p>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Description:</strong> ${description || "No description provided"}</p>
            <p><strong>Priority:</strong> ${priority || "Not specified"}</p>
            <p><strong>Due Date:</strong> ${formattedDueDate}</p>
            <p><strong>Project:</strong> ${project.name}</p>
            <p>Please log in to Orbit to view more details and start working on your task.</p>
            <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;" />
            <p style="font-size: 14px; color: #888;">Best regards,</p>
            <p style="font-size: 14px; color: #888;">The Orbit Team</p>
        </div>
    `;

            const mailOptions = {
                from: `"Orbit Team" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: `New Task Assigned: ${title}`,
                html: htmlContent,
            };

            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            try {
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${user.email}`);
            } catch (emailError) {
                console.error(`Error sending email to ${user.email}:`, emailError.message);
            }
        });

        res.status(201).json({ message: "Task created successfully and emails sent", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//@desc Update task details
//@route PUT /api/tasks/:id
//@access Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Update fields
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        // Update assigned users if provided
        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
            }
            task.assignedTo = req.body.assignedTo;
        }

        // Update project if provided
        if (req.body.projectId) {
            const project = await Project.findById(req.body.projectId);
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }

            task.project = {
                id: project._id,
                name: project.name,
            };
        }

        const updatedTask = await task.save();

        res.json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//@desc Delete a task (Admin only)
//@route DELETE /api/tasks/:id
//@access Private (Admin)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//@desc Update task status
//@route PUT /api/tasks/:id/status
//@access Private
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ messgae: "Task not found" });

        const isAssigned = task.assignedTo.some((userId) => userId.toString() === req.user._id.toString());
        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }
        task.status = req.body.status || task.status;
        if (task.status === "Completed") {
            task.todoChecklist.forEach((item) => item.completed = true);
            task.progress = 100;
        }
        await task.save();
        res.json({ message: "Task status updated", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//@desc Update task checklist
//@route PUT /api/tasks/:id/todo
//@access Private
const updateTaskChecklist = async (req, res) => {
    try {
        const { todoChecklist } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        if (!task.assignedTo.includes(req.user.id) && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to update checklist" });
        }

        task.todoChecklist = todoChecklist;

        const completedCount = task.todoChecklist.filter((item) => item.completed).length;
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        if (task.progress === 100) {
            task.status = "Completed";
        } else if (task.progress > 0) {
            task.status = "In Progress";
        } else {
            task.status = "Pending";
        }
        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );
        res.json({ message: "Task checklist updated", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//@desc Dashboard Data (Admin only)
//@route GET /api/tasks/dashboard-data
//@access Private
const getDashboardData = async (req, res) => {
    try {
        //Fetch statistics
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overDueTasks = await Task.countDocuments({
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });

        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find()
            .sort({ createdAt: -1 }).limit(10).select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overDueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//@desc Dashboard Data (User-specific)
//@route GET /api/tasks/user-dashboard-data
//@access Private
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
        const overDueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });

        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find({ assignedTo: userId }).sort({ createdAt: -1 }).limit(10).select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overDueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


//@desc Get tasks assigned to a specific user
//@route GET /api/tasks/user/:userId
//@access Private
const getTasksByUser = async (req, res) => {
    try {
        const userId = await User.findById(req.user.id);
        const { status, priority } = req.query;

        if (req.user._id.toString() !== userId._id.toString()) {
            console.log("Access Denied:", {
                loggedInUserId: req.user._id,
                requestedUserId: userId,
                role: req.user.role,
            });
            return res.status(403).json({ message: "Not authorized to view these tasks" });
        }

        let filter = { assignedTo: userId };
        if (status) {
            filter.status = status;
        }
        if (priority) {
            filter.priority = priority;
        }

        const tasks = await Task.find(filter).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData,
    getTasksByUser
}