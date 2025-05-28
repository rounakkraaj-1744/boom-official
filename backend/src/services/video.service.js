const prisma = require("../config/database");

const createVideo = async ({ title, description, type, videoUrl, price, file, userId }) => {
  const videoData = {
    title: title.trim(),
    description: description.trim(),
    type,
    creatorId: userId,
    price: type === "LONG_FORM" ? Math.max(0, Number.parseInt(price) || 0) : 0,
  };

  if (type === "SHORT_FORM") {
    if (!file) 
      throw new Error("Video file is required for short-form videos");
    videoData.videoFile = "/uploads/" + file.filename;
  }
  else if (type === "LONG_FORM") {
    if (!videoUrl)
      throw new Error("Video URL is required for long-form videos");
    try {
      new URL(videoUrl);
      videoData.videoUrl = videoUrl;
    }
    catch {
      throw new Error("Invalid video URL");
    }
  }

  const video = await prisma.video.create({
    data: videoData,
    include: {
      creator: {
        select: { username: true },
      },
    },
  });

  return { success: true, video };
}

const getVideos = async ({ page = 1, limit = 10, userId }) => {
  const pageNum = Math.max(1, Number.parseInt(page));
  const limitNum = Math.min(50, Math.max(1, Number.parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const videos = await prisma.video.findMany({
    skip,
    take: limitNum,
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: { username: true },
      },
      purchases: {
        where: { userId },
        select: { id: true },
      },
      _count: {
        select: {
          comments: true,
          purchases: true,
          gifts: true,
        },
      },
    },
  });

  const videosWithInfo = videos.map((video) => ({
    ...video,
    purchased: video.purchases.length > 0,
    purchases: undefined,
    analytics: {
      comments: video._count.comments,
      purchases: video._count.purchases,
      totalGifts: video._count.gifts,
    },
  }));

  const totalVideos = await prisma.video.count();
  const hasMore = skip + limitNum < totalVideos;

  return { success: true, videos: videosWithInfo,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: totalVideos,
      hasMore,
      totalPages: Math.ceil(totalVideos / limitNum),
    },
  }
}

const searchVideos = async ({ q, type, price, page = 1, limit = 10, userId }) => {
  if (!q || q.trim().length < 2)
    throw new Error("Search query must be at least 2 characters long");

  const searchQuery = q.trim();
  const pageNum = Math.max(1, Number.parseInt(page));
  const limitNum = Math.min(50, Math.max(1, Number.parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const whereConditions = {
    OR: [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
      { creator: { username: { contains: searchQuery, mode: "insensitive" } } },
    ],
  };

  if (type && type !== "ALL")
    whereConditions.type = type;

  if (price && price !== "ALL") {
    if (price === "FREE") 
      whereConditions.price = 0;
    else if (price === "PAID") 
      whereConditions.price = { gt: 0 };
  }

  const videos = await prisma.video.findMany({
    where: whereConditions,
    skip,
    take: limitNum,
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: { username: true },
      },
      purchases: {
        where: { userId },
        select: { id: true },
      },
    },
  })

  const videosWithPurchaseInfo = videos.map((video) => ({
    ...video,
    purchased: video.purchases.length > 0,
    purchases: undefined,
  }));

  const totalResults = await prisma.video.count({ where: whereConditions });

  return { success: true, videos: videosWithPurchaseInfo,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: totalResults,
      hasMore: skip + limitNum < totalResults,
    }, searchQuery,
  }
}

const getVideoById = async (videoId, userId) => {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: {
      creator: {
        select: { username: true },
      },
      purchases: {
        where: { userId },
        select: { id: true },
      },
      _count: {
        select: {
          comments: true,
          purchases: true,
          gifts: true,
        },
      },
    },
  })

  if (!video) 
    throw new Error("Video not found");

  const hasPurchased = video.purchases.length > 0;
  const isOwner = video.creatorId === userId;

  if (video.type === "LONG_FORM" && video.price > 0 && !hasPurchased && !isOwner)
    video.videoUrl = null;

  return { success: true,
    video: {
      ...video,
      purchased: hasPurchased,
      isOwner,
      purchases: undefined,
      analytics: {
        comments: video._count.comments,
        purchases: video._count.purchases,
        totalGifts: video._count.gifts,
      },
    },
  }
}

const purchaseVideo = async (videoId, userId) => {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  })

  if (!video)
    throw new Error("Video not found");

  if (video.creatorId === userId)
    throw new Error("Cannot purchase your own video");

  if (video.price === 0)
    throw new Error("This video is free");

  const existingPurchase = await prisma.purchase.findFirst({
    where: { userId, videoId },
  })

  if (existingPurchase) 
    throw new Error("Video already purchased");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (user.walletBalance < video.price)
    throw new Error(`Insufficient balance. You need ₹${video.price - user.walletBalance} more.`);

  await prisma.$transaction([
    prisma.purchase.create({
      data: { userId, videoId, amount: video.price },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { walletBalance: { decrement: video.price } },
    }),
  ])

  return {
    success: true,
    message: "Video purchased successfully",
    newBalance: user.walletBalance - video.price,
  }
}

module.exports = { createVideo, getVideos, searchVideos, getVideoById, purchaseVideo };