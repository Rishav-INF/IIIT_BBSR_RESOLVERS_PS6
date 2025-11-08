import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// 👤 Authenticated profile (for the logged-in user)
router.get("/me", protect, getProfile);

export default router;