const express = require("express");
const { register, login } = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Example of a protected route (any logged-in user)
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "User profile data",
    user: req.user, // user info from token
  });
});

// Example of a role-restricted route (only admins)
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Admin dashboard - restricted access",
  });
});

module.exports = router;
