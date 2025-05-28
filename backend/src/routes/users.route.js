const express = require("express");
const { authenticateToken } = require("../middlewares/auth");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.get("/profile", authenticateToken, userController.getProfile);
router.get("/videos", authenticateToken, userController.getUserVideos);
router.get("/transactions", authenticateToken, userController.getTransactions);

module.exports = router;