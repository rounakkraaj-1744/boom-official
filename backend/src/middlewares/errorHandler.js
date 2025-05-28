const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.code === "P2002") {
    return res.status(400).json({
      success: false,
      message: "A record with this information already exists",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size too large",
    });
  }

  if (err.message && err.message.includes("Only")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
}

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
}

module.exports = { errorHandler, notFoundHandler };