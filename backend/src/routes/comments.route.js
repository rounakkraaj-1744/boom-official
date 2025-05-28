const express = require("express");
const { authenticateToken } = require("../middlewares/auth");
const { validateInput, commentSchema } = require("../middlewares/validation");
const commentController = require("../controllers/comment.controller");

const router = express.Router();

router.get("/:videoId", authenticateToken, commentController.getComments);
router.post("/:videoId", authenticateToken, validateInput(commentSchema), commentController.addComment);

module.exports = router;