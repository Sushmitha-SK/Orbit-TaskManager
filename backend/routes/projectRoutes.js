const express = require('express');
const router = express.Router();
const {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
    assignTasksToProject,
    assignUsersToProject,
    getProjectsByUser,
    getProjectsByUserWithAnalytics,
    getProjectsByAdminAnalytics,
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Project Routes
router.post('/', protect, adminOnly, createProject);
router.get('/', protect, adminOnly, getProjects);
router.put('/:id', protect, adminOnly, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);
router.put('/:id/assign-tasks', protect, adminOnly, assignTasksToProject);
router.put('/:projectId/assign-users', protect, adminOnly, assignUsersToProject);
router.get('/user/:userId', protect, getProjectsByUser);
router.get('/user/:userId/analytics', getProjectsByUserWithAnalytics);
router.get('/admin/projectanalytics', protect, adminOnly, getProjectsByAdminAnalytics);

module.exports = router;
