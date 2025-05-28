const express = require("express");
const rateLimit = require("express-rate-limit");
const { authenticateToken } = require("../middlewares/auth");
const { validateInput, registerSchema, loginSchema } = require("../middlewares/validation");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Applying rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: "Too many authentication attempts, please try again later." },
})

router.post("/register", authLimiter, validateInput(registerSchema), authController.register);
router.post("/login", authLimiter, validateInput(loginSchema), authController.login);
router.get("/me", authenticateToken, authController.getMe);
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;