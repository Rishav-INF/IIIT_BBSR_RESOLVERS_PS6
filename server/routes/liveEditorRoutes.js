import express from "express";
import { runCode, submitCode, gradeSubmission } from "../controllers/liveEditorController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/execute", runCode);
router.post("/submit", submitCode);

// 🧪 grade against all DB testcases (students only)
router.post("/grade", protect, requireRole("student"), gradeSubmission);

export default router;