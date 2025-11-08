// routes/assignmentRoutes.js
import express from "express";
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { uploadAssignmentFiles } from "../utils/multerConfig.js";
import Assignment from "../models/assignmentModel.js";
import Submission from "../models/submissionModel.js";

const router = express.Router();

/**
 * Instructor: create assignment with 3 files (PDF, input.txt, output.txt)
 * Body fields: title, description, language, deadline
 * Files: questionPdf, inputFile, outputFile
 */
router.post(
  "/create",
  protect,
  requireRole("instructor"),
  uploadAssignmentFiles,
  createAssignment
);

// Public (or protect if you prefer): list all assignments
router.get("/get", getAllAssignments);

// Public (or protect if you prefer): get a single assignment
router.get("/get/:id", getAssignmentById);

// Instructor: update assignment metadata (does not replace files here)
router.put(
  "/update/:id",
  protect,
  requireRole("instructor"),
  updateAssignment
);

// Instructor: delete assignment + its testcases + uploaded files
router.delete(
  "/delete/:id",
  protect,
  requireRole("instructor"),
  deleteAssignment
);

/**
 * Student view: list assignments with status
 * status:
 *  - "closed" if deadline passed
 *  - "completed" if student has a submission for it
 *  - "active" otherwise
 */
router.get("/student/list", protect, requireRole("student"), async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ deadline: 1 });

    const subs = await Submission.find({ studentName: req.user.name })
      .select("assignment");

    const submittedSet = new Set(subs.map((s) => s.assignment.toString()));
    const now = Date.now();

    const rows = assignments.map((a) => {
      const isClosed = now > new Date(a.deadline).getTime();
      const isCompleted = submittedSet.has(a._id.toString());

      return {
        _id: a._id,
        title: a.title,
        description: a.description,
        language: a.language,
        deadline: a.deadline,
        questionPdfUrl: a.questionPdfUrl,
        totalCases: a.totalCases,
        status: isClosed ? "closed" : isCompleted ? "completed" : "active",
      };
    });

    res.json(rows);
  } catch (err) {
    console.error("student/list error:", err);
    res.status(500).json({ message: "Error fetching assignments for student" });
  }
});

export default router;