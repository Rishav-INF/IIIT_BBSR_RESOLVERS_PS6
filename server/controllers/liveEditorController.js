// controllers/liveEditorController.js
import axios from "axios";
import TestCase from "../models/testCaseModel.js";
import Submission from "../models/submissionModel.js";
// your model file name is submission.js

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";
const LANG_MAP = { python3: "python", "g++": "cpp", node: "javascript", javascript: "javascript", python: "python", cpp: "cpp" };

export const gradeSubmission = async (req, res) => {
  let { assignmentId, code, language, studentName } = req.body;
  if (!assignmentId || !code || !language || !studentName) {
    return res.status(400).json({ message: "Missing fields" });
  }
  language = LANG_MAP[language] || language;

  const cases = await TestCase.find({ assignment: assignmentId }).sort({ createdAt: 1 });
  if (cases.length === 0) return res.status(404).json({ message: "No test cases found" });

  let totalScore = 0;
  const maxScore = cases.reduce((a, c) => a + (c.points || 1), 0);
  const results = [];

  for (const tc of cases) {
    try {
      const { data } = await axios.post(PISTON_URL, {
        language,
        version: "*",
        files: [{ name: "main", content: code }],
        stdin: tc.inputText,
        compile_timeout: 10000,
        run_timeout: 10000,
      });

      const actualOut = `${data.run?.stdout || ""}${data.run?.stderr ? "\n" + data.run.stderr : ""}`.trim();
      const expectedOut = (tc.expectedText || "").trim();

      // normalize whitespace lines
      const norm = (s) => s.replace(/\r\n/g, "\n").trim();
      const passed = norm(actualOut) === norm(expectedOut);
      const pts = passed ? (tc.points || 1) : 0;

      totalScore += pts;
      results.push({
        input: tc.inputText,
        expected: expectedOut,
        output: actualOut,
        passed,
        points: pts,
      });
    } catch (err) {
      results.push({
        input: tc.inputText,
        expected: (tc.expectedText || "").trim(),
        output: "❌ Runtime/Compile error",
        passed: false,
        points: 0,
      });
    }
  }

  // save submission record
  const status = totalScore >= Math.ceil(maxScore * 0.5) ? "Passed" : "Failed";
  await Submission.create({
    assignment: assignmentId,
    studentName,
    code,
    language,
    score: totalScore,
    status,
  });

  return res.json({ totalScore, maxScore, results });
};


export const runCode = async (req, res) => {
  let { code, language, version = "*", stdin = "" } = req.body;
  const map = { python3: "python", "g++": "cpp", node: "javascript" };
  language = map[language] || language;

  try {
    const { data } = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language,
      version,
      files: [{ name: "main", content: code }],
      stdin,
      compile_timeout: 10000,
      run_timeout: 10000,
    });

    const out = [
      data.compile?.stderr,
      data.run?.stdout,
      data.run?.stderr,
    ].filter(Boolean).join("\n").trim();

    res.json({ output: out || "✅ No output." });
  } catch (err) {
    console.error("PISTON ERROR:", err.response?.status, err.response?.data || err.message);
    res.status(500).json({ output: "❌ Error executing code" });
  }
};

// ⬇️ Make sure this exact named export exists
export const submitCode = async (req, res) => {
  const { code, language } = req.body;
  const results = [
    { input: "5,3", expected: "8", output: "8", passed: true, points: 1 },
    { input: "2,2", expected: "4", output: "4", passed: true, points: 1 },
    { input: "10,20", expected: "30", output: "30", passed: true, points: 2 },
  ];
  const totalScore = results.reduce((acc, r) => acc + r.points, 0);
  res.json({ totalScore, results, meta: { language, length: code?.length || 0 } });
};
