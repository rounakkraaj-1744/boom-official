const userService = require("../services/user.service");

const getProfile = async (req, res) => {
  try {
    const profile = await userService.getUserProfile(req.user.userId);
    res.json({ success: true, profile });
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const getUserVideos = async (req, res) => {
  try {
    const videos = await userService.getUserVideos(req.user.userId);
    res.json({ success: true, videos });
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const getTransactions = async (req, res) => {
  try {
    const transactions = await userService.getUserTransactions(req.user.userId);
    res.json({ success: true, transactions });
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getProfile, getUserVideos, getTransactions};
