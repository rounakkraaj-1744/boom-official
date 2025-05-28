const prisma = require("../config/database");

const getUserProfile = async (userId) => {
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      walletBalance: true,
      createdAt: true,
      _count: {
        select: {
          videos: true,
          comments: true,
          purchases: true,
          sentGifts: true,
        },
      },
    },
  })

  if (!profile)
    throw new Error("Profile not found");

  return profile;
}

const getUserVideos = async (userId) => {
  const videos = await prisma.video.findMany({
    where: { creatorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          comments: true,
          purchases: true,
          gifts: true,
        },
      },
    },
  })
  return videos;
}

const getUserTransactions = async (userId) => {
  const [purchases, sentGifts, receivedGifts] = await Promise.all([
    prisma.purchase.findMany({
      where: { userId },
      include: { video: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.gift.findMany({
      where: { fromUserId: userId },
      include: {
        video: { select: { title: true } },
        toUser: { select: { username: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.gift.findMany({
      where: { toUserId: userId },
      include: {
        video: { select: { title: true } },
        fromUser: { select: { username: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const transactions = [
    ...purchases.map((p) => ({
      id: p.id,
      type: "PURCHASE",
      amount: p.amount,
      createdAt: p.createdAt,
      video: p.video,
    })),
    ...sentGifts.map((g) => ({
      id: g.id,
      type: "GIFT_SENT",
      amount: g.amount,
      createdAt: g.createdAt,
      video: g.video,
      toUser: g.toUser,
    })),
    ...receivedGifts.map((g) => ({
      id: g.id,
      type: "GIFT_RECEIVED",
      amount: g.amount,
      createdAt: g.createdAt,
      video: g.video,
      fromUser: g.fromUser,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return transactions;
}

module.exports = { getUserProfile, getUserVideos, getUserTransactions }