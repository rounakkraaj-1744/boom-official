const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");

// importing the routes
const authRoutes = require("./src/routes/auth.route");
const videoRoutes = require("./src/routes/videos.route");
const userRoutes = require("./src/routes/users.route");
const commentRoutes = require("./src/routes/comments.route");
const giftRoutes = require("./src/routes/gifts.route");

// importing the middlewares
const { errorHandler, notFoundHandler } = require("./src/middlewares/errorHandler");
const { requestLogger } = require("./src/middlewares/logger");

const app = express();

// apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
});

// using the middlewares
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(requestLogger);

// using the static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// using the routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/gifts", giftRoutes);

// health checking ...
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Boom API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })
});

// using the error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;