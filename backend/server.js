const express = require("express")
const app = express()
const { PrismaClient } = require("@prisma/client")
const { createUploadsDir } = require("./src/utils/fileSystem")
const cors = require("cors");
const path = require("path");

// importing the routes
const authRoutes = require("./src/routes/auth.route")
const videoRoutes = require("./src/routes/videos.route")
const userRoutes = require("./src/routes/users.route")
const commentRoutes = require("./src/routes/comments.route")
const giftRoutes = require("./src/routes/gifts.route")

// using the middlewares
app.use(cors())
app.use(express.json())

// using the static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// using the routes
app.use("/api/auth", authRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/users", userRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/gifts", giftRoutes)

// health checking ...
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

const prisma = new PrismaClient()

// creating uploads directory
createUploadsDir()

// prisma graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully`)
  await prisma.$disconnect()
  process.exit(0)
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
process.on("SIGINT", () => gracefulShutdown("SIGINT"))

// starting the server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Boom API Server running on port http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})
