const { verifyToken } = require("../config/jwt");
const prisma = require("../config/database");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({ success: false, message: "Access token required" });

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true },
    });

    if (!user)
      return res.status(403).json({ success: false, message: "User not found" });

    req.user = { ...decoded, ...user };
    next();
  }
  catch (error) {
    if (error.name === "JsonWebTokenError")
      return res.status(403).json({ success: false, message: "Invalid token" });
    if (error.name === "TokenExpiredError")
      return res.status(403).json({ success: false, message: "Token expired" });
    return res.status(500).json({ success: false, message: "Authentication error" });
  }
}

module.exports = { authenticateToken };
