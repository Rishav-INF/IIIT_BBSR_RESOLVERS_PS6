import TestCase from "../models/testCaseModel.js";

export const addTestCases = async (req, res) => {
  const { assignmentId } = req.params;
  const { cases = [] } = req.body; // [{inputText, expectedText, points?}, ...]

  if (!Array.isArray(cases) || cases.length === 0) {
    return res.status(400).json({ message: "No test cases provided" });
  }
  const docs = cases.map(c => ({ assignment: assignmentId, inputText: c.inputText, expectedText: c.expectedText, points: c.points ?? 1 }));
  const created = await TestCase.insertMany(docs);
  res.status(201).json(created);
};

export const getTestCasesByAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const list = await TestCase.find({ assignment: assignmentId }).sort({ createdAt: 1 });
  res.json(list);
};

export const deleteTestCase = async (req, res) => {
  const { id } = req.params;
  const tc = await TestCase.findByIdAndDelete(id);
  if (!tc) return res.status(404).json({ message: "Test case not found" });
  res.json({ message: "Deleted" });
};