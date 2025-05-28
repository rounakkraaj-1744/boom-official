const videoService = require("../services/video.service");

const uploadVideo = async (req, res) => {
  try {
    const videoData = { ...req.body, file: req.file, userId: req.user.userId };
    const result = await videoService.createVideo(videoData);
    res.status(201).json(result);
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

const getVideos = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await videoService.getVideos({ page, limit, userId: req.user.userId });
    res.json(result);
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const searchVideos = async (req, res) => {
  try {
    const result = await videoService.searchVideos({ ...req.query, userId: req.user.userId });
    res.json(result);
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const getVideoById = async (req, res) => {
  try {
    const result = await videoService.getVideoById(req.params.id, req.user.userId);
    res.json(result);
  }
  catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}

const purchaseVideo = async (req, res) => {
  try {
    const result = await videoService.purchaseVideo(req.body.videoId, req.user.userId);
    res.json(result);
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = { uploadVideo, getVideos, searchVideos, getVideoById, purchaseVideo };