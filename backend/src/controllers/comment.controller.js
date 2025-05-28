const commentService = require("../services/comments.service")

const getComments = async (req, res) => {
  try {
    const { page, limit } = req.query
    const result = await commentService.getComments(req.params.videoId, { page, limit })
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const addComment = async (req, res) => {
  try {
    const result = await commentService.addComment({
      videoId: req.params.videoId,
      userId: req.user.userId,
      content: req.body.content,
    })
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

module.exports = {
  getComments,
  addComment,
}
