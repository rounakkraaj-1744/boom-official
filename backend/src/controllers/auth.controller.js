const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

const getMe = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.userId);
    res.json({ success: true, user });
  }
  catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}

const logout = async (req, res) => {
  try {
    // Since we're using JWT tokens, we don't need to do anything on the server side
    // The client will remove the token on it's own
    res.json({ success: true, message: "Logged out successfully" });
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { register, login, getMe, logout };