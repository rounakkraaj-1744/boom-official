const prisma = require("../config/database");

const getComments = async (videoId, { page = 1, limit = 20 }) => {
  const pageNum = Math.max(1, Number.parseInt(page));
  const limitNum = Math.min(50, Math.max(1, Number.parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const comments = await prisma.comment.findMany({
    where: { videoId },
    skip,
    take: limitNum,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { username: true },
      },
    },
  });

  const totalComments = await prisma.comment.count({
    where: { videoId },
  });

  return { success: true, comments,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: totalComments,
      hasMore: skip + limitNum < totalComments,
    },
  }
}

const addComment = async ({ videoId, userId, content }) => {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video)
    throw new Error("Video not found");

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      userId,
      videoId,
    },
    include: {
      user: {
        select: { username: true },
      },
    },
  })

  return { success: true, comment }
}

module.exports = { getComments, addComment }