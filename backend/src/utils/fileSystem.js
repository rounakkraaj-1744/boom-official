const fs = require("fs");
const path = require("path");

const createUploadsDir = () => {
  const uploadsDir = path.join(__dirname, "../../uploads")
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created uploads directory !");
  }
}

module.exports = { createUploadsDir };