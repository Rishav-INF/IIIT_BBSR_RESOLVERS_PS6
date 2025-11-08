// client/src/components/LeaderBoard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchLeaderboard } from "../utils/api";

export default function Leaderboard({ assignmentId }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!assignmentId) {
      setLeaders([]);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const data = await fetchLeaderboard(assignmentId);
        setLeaders(data || []);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setLeaders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [assignmentId]);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-semibold">🏆 Leaderboard</h2>
        <span className="text-sm text-slate-300">{leaders.length} ranked</span>
      </div>

      <div className="p-4">
        {loading ? (
          <p className="text-slate-300 text-sm">Loading…</p>
        ) : leaders.length === 0 ? (
          <p className="text-slate-300 text-sm">No submissions yet.</p>
        ) : (
          <table className="table-base">
            <thead>
              <tr>
                <th>Rank</th><th>Name</th><th>Score</th><th>Status</th><th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((s, i) => (
                <motion.tr
                  key={s._id || `${s.studentName}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={i === 0 ? "bg-yellow-900/30" : ""}
                >
                  <td className="font-semibold">{i + 1}</td>
                  <td>{s.studentName}</td>
                  <td className="text-green-400 font-semibold">{s.score}</td>
                  <td className={s.status === "Passed" ? "text-emerald-400" : "text-rose-400"}>{s.status}</td>
                  <td className="text-slate-300">{new Date(s.createdAt).toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
