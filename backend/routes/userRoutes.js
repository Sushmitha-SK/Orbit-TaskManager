const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getUserById, getUsers, deleteUser, getAllUsers } = require("../controllers/userController");

const router = express.Router();

//User Management Routes
router.get("/", protect, getUsers);
router.get("/all", protect, getAllUsers)
router.get("/:id", protect, getUserById);


module.exports = router;