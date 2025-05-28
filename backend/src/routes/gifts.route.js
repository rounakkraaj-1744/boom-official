const express = require("express");
const { authenticateToken } = require("../middlewares/auth");
const { validateInput, giftSchema } = require("../middlewares/validation");
const giftController = require("../controllers/gift.controller");

const router = express.Router();

router.post("/:videoId", authenticateToken, validateInput(giftSchema), giftController.sendGift);

module.exports = router;