const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport, exportProjectsReport } = require("../controllers/reportController");

const router = express.Router();

//Report routes
router.get("/export/tasks", protect, adminOnly, exportTasksReport);
router.get("/export/users", protect, adminOnly, exportUsersReport);
router.get("/export/projects", protect, adminOnly, exportProjectsReport);

module.exports = router;
