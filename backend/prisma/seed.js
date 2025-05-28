const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Creating mock users
  const hashedPassword = await bcrypt.hash("password123", 12);

  const user1 = await prisma.user.upsert({
    where: { email: "creator@boom.com" },
    update: {},
    create: {
      username: "creator_boom",
      email: "creator@boom.com",
      password: hashedPassword,
      walletBalance: 1000,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: "viewer@boom.com" },
    update: {},
    create: {
      username: "viewer_boom",
      email: "viewer@boom.com",
      password: hashedPassword,
      walletBalance: 750,
    },
  })

  const video1 = await prisma.video.create({
    data: {
      title: "Welcome to Boom Platform",
      description:
        "An introduction to the next-generation social streaming platform that revolutionizes content discovery.",
      type: "LONG_FORM",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      price: 0,
      creatorId: user1.id,
    },
  })

  const video2 = await prisma.video.create({
    data: {
      title: "Premium Content: Advanced Streaming Techniques",
      description: "Learn professional streaming techniques and content creation strategies for maximum engagement.",
      type: "LONG_FORM",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      price: 99,
      creatorId: user1.id,
    },
  })

  const video3 = await prisma.video.create({
    data: {
      title: "Quick Tips for Content Creators",
      description: "Short and sweet tips to improve your content creation workflow and audience engagement.",
      type: "SHORT_FORM",
      price: 0,
      creatorId: user2.id,
    },
  })

  // Create demo comments
  await prisma.comment.createMany({
    data: [
      {
        content: "Amazing content! Really helpful for beginners.",
        userId: user2.id,
        videoId: video1.id,
      },
      {
        content: "Love the production quality. Keep it up!",
        userId: user1.id,
        videoId: video3.id,
      },
      {
        content: "This is exactly what I was looking for. Thank you!",
        userId: user2.id,
        videoId: video1.id,
      },
    ],
  })

  // Create demo purchase
  await prisma.purchase.create({
    data: {
      userId: user2.id,
      videoId: video2.id,
      amount: 99,
    },
  })

  // Update user2's balance after purchase
  await prisma.user.update({
    where: { id: user2.id },
    data: { walletBalance: 651 }, // 750 - 99
  })

  // Create demo gift
  await prisma.gift.create({
    data: {
      amount: 50,
      fromUserId: user2.id,
      toUserId: user1.id,
      videoId: video1.id,
    },
  })

  // Update user2's balance after gift
  await prisma.user.update({
    where: { id: user2.id },
    data: { walletBalance: 601 }, // 651 - 50
  })

  console.log("Database seeded successfully!");
  console.log("Demo accounts created:");
  console.log("creator@boom.com / password123 (Creator with ₹1000)");
  console.log("viewer@boom.com / password123 (Viewer with ₹601)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })