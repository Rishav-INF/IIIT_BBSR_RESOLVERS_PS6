// server/controllers/analyticsController.js
import Submission from "../models/submissionModel.js";

/**
 * GET /api/leaderboard/:assignmentId
 * Returns all submissions for assignment sorted by score (desc).
 * Protected: instructor
 */
export const getLeaderboard = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const subs = await Submission.find({ assignment: assignmentId })
      .select("studentName score status createdAt")
      .sort({ score: -1, createdAt: 1 })
      .lean();

    res.json(subs);
  } catch (err) {
    console.error("getLeaderboard error:", err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

/**
 * GET /api/analytics/:assignmentId
 * Returns analytics summary: avg, passed count, total, top5 (by score)
 * Protected: instructor
 */
export const getAnalytics = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const subs = await Submission.find({ assignment: assignmentId })
      .select("studentName score status createdAt")
      .sort({ score: -1, createdAt: 1 })
      .lean();

    const total = subs.length;
    const passed = subs.filter((s) => s.status === "Passed").length;
    const avgScore = total ? +(subs.reduce((a, b) => a + (b.score || 0), 0) / total).toFixed(1) : 0;
    const top5 = subs.slice(0, 5).map((s) => ({ name: s.studentName, score: s.score }));

    // Optionally compute distribution buckets (0-20,21-40,...)
    const buckets = [0,0,0,0,0];
    subs.forEach(s => {
      const sc = Number(s.score) || 0;
      if (sc <= 20) buckets[0]++;
      else if (sc <= 40) buckets[1]++;
      else if (sc <= 60) buckets[2]++;
      else if (sc <= 80) buckets[3]++;
      else buckets[4]++;
    });

    res.json({
      total,
      passed,
      avgScore,
      top5,
      buckets, // optional for charts
      raw: subs,
    });
  } catch (err) {
    console.error("getAnalytics error:", err);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};
