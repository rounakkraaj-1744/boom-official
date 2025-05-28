const express = require("express")
const { authenticateToken } = require("../middlewares/auth");
const { validateInput, videoUploadSchema } = require("../middlewares/validation");
const { upload } = require("../middlewares/upload");
const videoController = require("../controllers/video.controller");

const router = express.Router();

router.get("/", authenticateToken, videoController.getVideos);
router.post("/upload", authenticateToken, upload.single("videoFile"), videoController.uploadVideo);
router.get("/search", authenticateToken, videoController.searchVideos);
router.get("/:id", authenticateToken, videoController.getVideoById);
router.post("/purchase", authenticateToken, videoController.purchaseVideo);

module.exports = router;