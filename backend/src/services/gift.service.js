const prisma = require("../config/database");

const sendGift = async ({ videoId, fromUserId, amount }) => {
  const giftAmount = Number.parseInt(amount);

  if (giftAmount > 10000)
    throw new Error("Gift amount cannot exceed ₹10,000");

  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: { creator: true },
  });

  if (!video)
    throw new Error("Video not found");

  if (video.creatorId === fromUserId)
    throw new Error("Cannot gift to yourself");

  const user = await prisma.user.findUnique({
    where: { id: fromUserId },
  })

  if (user.walletBalance < giftAmount)
    throw new Error(`Insufficient balance. You need ₹${giftAmount - user.walletBalance} more.`);

  await prisma.$transaction([
    prisma.gift.create({
      data: {
        amount: giftAmount,
        fromUserId,
        toUserId: video.creatorId,
        videoId,
      },
    }),
    prisma.user.update({
      where: { id: fromUserId },
      data: { walletBalance: { decrement: giftAmount } },
    }),
  ])

  return {
    success: true,
    message: `Successfully gifted ₹${giftAmount} to @${video.creator.username}!`,
    newBalance: user.walletBalance - giftAmount,
  }
}

module.exports = { sendGift }