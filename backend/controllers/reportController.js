const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");

//@desc Export all tasks as an Excel file
//@route GET /api/reports/export/tasks
//@access Private (Admin)
const exportTasksReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");

        // Set Column Styles
        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 },
        ];

        // Apply Styles to Header Row
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4F81BD' }
        };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        tasks.forEach((task) => {
            const assignedTo = task.assignedTo.map((user) => `${user.name} (${user.email})`).join(", ");
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split("T")[0],
                assignedTo: assignedTo || "Unassigned",
            });
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) {
                row.font = { color: { argb: '000000' } };
                row.alignment = { vertical: 'middle', horizontal: 'center' };
            }
        });

        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", 'attachment; filename="tasks_report.xlsx"');
        return workbook.xlsx.write(res).then(() => {
            res.end();
        });
    } catch (error) {
        res.status(500).json({ message: "Error exporting tasks", error: error.message });
    }
};

//@desc Export user-task report as an Excel file
//@route GET /api/reports/export/users
//@access Private (Admin)
const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id").lean();
        const userTasks = await Task.find().populate("assignedTo", "name email _id");
        const userTaskMap = {};

        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        userTasks.forEach((task) => {
            if (task.assignedTo) {
                task.assignedTo.forEach((assignedUser) => {
                    if (userTaskMap[assignedUser._id]) {
                        userTaskMap[assignedUser._id].taskCount += 1;
                        if (task.status === "Pending") {
                            userTaskMap[assignedUser._id].pendingTasks += 1;
                        } else if (task.status === "In Progress") {
                            userTaskMap[assignedUser._id].inProgressTasks += 1;
                        } else if (task.status === "Completed") {
                            userTaskMap[assignedUser._id].completedTasks += 1;
                        }
                    }
                });
            }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User Task Report");

        worksheet.columns = [
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
            { header: "Pending Tasks", key: "pendingTasks", width: 20 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            { header: "Completed Tasks", key: "completedTasks", width: 20 },
        ];

        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4F81BD' }
        };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) { 
                row.font = { color: { argb: '000000' } }; 
                row.alignment = { vertical: 'middle', horizontal: 'center' };
            }
        });

        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", 'attachment; filename="users_report.xlsx"');
        return workbook.xlsx.write(res).then(() => {
            res.end();
        });
    } catch (error) {
        res.status(500).json({ message: "Error exporting user-task report", error: error.message });
    }
};


const exportProjectsReport = async (req, res) => {
    try {
        const projects = await Project.find().populate("tasks", "title status");
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Projects Report");

        worksheet.columns = [
            { header: "Project ID", key: "_id", width: 25 },
            { header: "Name", key: "name", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Start Date", key: "startDate", width: 20 },
            { header: "End Date", key: "endDate", width: 20 },
            { header: "Status", key: "status", width: 20 },
            { header: "Tasks Assigned", key: "tasksAssigned", width: 30 },
        ];

        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        projects.forEach((project) => {
            worksheet.addRow({
                _id: project._id,
                name: project.name,
                description: project.description,
                startDate: project.startDate.toISOString().split("T")[0],
                endDate: project.endDate.toISOString().split("T")[0],
                status: project.status,
                tasksAssigned: project.tasks.length,
            });
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) {
                row.font = { color: { argb: '000000' } };
                row.alignment = { vertical: 'middle', horizontal: 'center' };
            }
        });

        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", 'attachment; filename="projects_report.xlsx"');
        return workbook.xlsx.write(res).then(() => {
            res.end();
        });
    } catch (error) {
        res.status(500).json({ message: "Error exporting projects", error: error.message });
    }
};

module.exports = {
    exportTasksReport, exportUsersReport, exportProjectsReport
};
