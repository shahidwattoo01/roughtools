const router = require("express").Router();
const { authenticate, authorize } = require("../middleware/auth");
const { getProfile } = require("../controllers/authController");

// All routes require authentication
router.use(authenticate);

// User profile (any authenticated user)
router.get("/profile", getProfile);

// Admin only route
router.get("/admin", authorize("admin"), (req, res) => {
  res.json({ success: true, message: "Admin access granted" });
});

// Moderator and Admin route
router.get("/moderator", authorize("moderator", "admin"), (req, res) => {
  res.json({ success: true, message: "Moderator access granted" });
});

module.exports = router;
