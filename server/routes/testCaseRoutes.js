import express from "express";
import { addTestCases, getTestCasesByAssignment, deleteTestCase } from "../controllers/testCaseController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// add cases to an assignment
router.post("/:assignmentId", protect, requireRole("instructor"), addTestCases);

// list cases for an assignment
router.get("/:assignmentId", protect, getTestCasesByAssignment);

// delete a single testcase
router.delete("/one/:id", protect, requireRole("instructor"), deleteTestCase);

export default router;