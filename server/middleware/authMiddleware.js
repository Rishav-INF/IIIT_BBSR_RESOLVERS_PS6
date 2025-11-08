import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// 🔐 Middleware to verify JWT tokens
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// 🔐 Require specific roles (e.g., "student", "instructor")
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: insufficient role" });
  }
  next();
};
