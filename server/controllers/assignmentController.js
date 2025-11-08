// controllers/assignmentController.js
import Assignment from "../models/assignmentModel.js";
import TestCase from "../models/testCaseModel.js";
import fs from "fs";
import path from "path";
import { PATHS, UPLOADS_PUBLIC_BASE } from "../utils/multerConfig.js";

// ================================
// ✅ Helper: read file safely
// ================================
const readFileSafe = (filePath) => {
  try {
    return fs.readFileSync(filePath, "utf8").trim();
  } catch (e) {
    return "";
  }
};

// =======================================================================================
// ✅ CREATE ASSIGNMENT (PDF + input.txt + output.txt)
// =======================================================================================
export const createAssignment = async (req, res) => {
  try {
    const { title, description, language, deadline } = req.body;

    // ✅ Uploaded files coming from multer
    const pdfFile   = req.files?.questionPdf?.[0];
    const inputFile = req.files?.inputFile?.[0];
    const outputFile = req.files?.outputFile?.[0];

    if (!pdfFile || !inputFile || !outputFile) {
      return res.status(400).json({ message: "All 3 files required (PDF, input.txt, output.txt)" });
    }

    // ✅ Build public URLs
    const questionPdfUrl = `${UPLOADS_PUBLIC_BASE}/pdf/${pdfFile.filename}`;
    const inputFileUrl = `${UPLOADS_PUBLIC_BASE}/cases/${inputFile.filename}`;
    const outputFileUrl = `${UPLOADS_PUBLIC_BASE}/cases/${outputFile.filename}`;

    // ✅ Read file contents
    const inputText = readFileSafe(inputFile.path);
    const outputText = readFileSafe(outputFile.path);

    // ✅ Parse test cases
    // Each line of input → one test case
    // output lines must match input count
    const inputLines = inputText.split("\n").map((l) => l.trim());
    const outputLines = outputText.split("\n").map((l) => l.trim());

    if (inputLines.length !== outputLines.length) {
      return res.status(400).json({
        message: `Mismatch: input has ${inputLines.length} lines, output has ${outputLines.length}`
      });
    }

    const totalCases = inputLines.length;

    // ✅ Create assignment
    const assignment = await Assignment.create({
      title,
      description,
      language,
      deadline,
      createdBy: req.user?._id,
      questionPdfUrl,
      inputFileUrl,
      outputFileUrl,
      totalCases,
    });

    // ✅ Save each test case in DB
    const testCases = inputLines.map((inp, i) => ({
      assignment: assignment._id,
      inputText: inp,
      expectedText: outputLines[i],
      points: 1,
    }));

    await TestCase.insertMany(testCases);

    return res.status(201).json({
      message: "Assignment created successfully",
      assignment,
      totalCases,
    });
  } catch (error) {
    console.error("Assignment creation error:", error);
    res.status(500).json({ message: "Error creating assignment" });
  }
};

// =======================================================================================
// ✅ GET ALL ASSIGNMENTS
// =======================================================================================
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch {
    res.status(500).json({ message: "Error fetching assignments" });
  }
};

// =======================================================================================
// ✅ GET ASSIGNMENT BY ID
// =======================================================================================
export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    res.json(assignment);
  } catch {
    res.status(500).json({ message: "Error fetching assignment" });
  }
};

// =======================================================================================
// ✅ UPDATE ASSIGNMENT
// =======================================================================================
export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    res.json(assignment);
  } catch {
    res.status(500).json({ message: "Error updating assignment" });
  }
};

// =======================================================================================
// ✅ DELETE ASSIGNMENT
// =======================================================================================
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    // ✅ Remove test cases
    await TestCase.deleteMany({ assignment: assignment._id });

    // ✅ Remove files from storage
    [assignment.questionPdfUrl, assignment.inputFileUrl, assignment.outputFileUrl].forEach(fileUrl => {
      if (!fileUrl) return;
      const actualPath = path.join(PATHS.UPLOAD_ROOT, "..", fileUrl.replace("/uploads/", ""));
      if (fs.existsSync(actualPath)) fs.unlinkSync(actualPath);
    });

    // ✅ Delete assignment
    await assignment.deleteOne();

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting assignment" });
  }
};