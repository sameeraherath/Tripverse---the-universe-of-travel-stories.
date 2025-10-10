const express = require("express");
const router = express.Router();
const { adminAuth, superAdminAuth } = require("../middleware/adminAuth");
const {
  getDashboardStats,
  getUsers,
  updateUserRole
} = require("../controllers/adminController");

// Dashboard routes
router.get("/dashboard/stats", adminAuth, getDashboardStats);

// User management routes (admin only)
router.get("/users", adminAuth, getUsers);
router.put("/users/:id/role", superAdminAuth, updateUserRole);

module.exports = router;
