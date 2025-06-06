const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ['Pending', "In Progress", "Completed"], default: "Pending" },
    dueDate: { type: Date },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
        name: { type: String },
    },
    todoChecklist: { type: Array },
    progress: { type: Number, default: 0 },
    attachments: { type: Array },
});

module.exports = mongoose.model("Task", taskSchema);
