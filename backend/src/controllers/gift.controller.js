const giftService = require("../services/gift.service");

const sendGift = async (req, res) => {
  try {
    const result = await giftService.sendGift({
      videoId: req.params.videoId,
      fromUserId: req.user.userId,
      amount: req.body.amount,
    })
    res.json(result);
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = { sendGift };