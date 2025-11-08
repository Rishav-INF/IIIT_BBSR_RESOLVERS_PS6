// server/routes/analyticsRoutes.js
import express from "express";
import { getLeaderboard, getAnalytics } from "../controllers/analyticsController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes for instructors
router.get("/leaderboard/:assignmentId", protect, requireRole("instructor"), getLeaderboard);
router.get("/analytics/:assignmentId", protect, requireRole("instructor"), getAnalytics);

export default router;