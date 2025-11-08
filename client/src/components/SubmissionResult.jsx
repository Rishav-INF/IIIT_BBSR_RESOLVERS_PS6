import React from "react";
import { motion } from "framer-motion";

export default function SubmissionResult({ results, totalScore }) {
  return (
    <div className="card mt-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-semibold">Submission Results</h2>
        <span className="badge">Total: {totalScore}</span>
      </div>

      <div className="p-4">
        {(!results || results.length === 0) ? (
          <p className="text-slate-300 text-sm">No submissions yet.</p>
        ) : (
          <table className="table-base">
            <thead>
              <tr>
                <th>#</th><th>Input</th><th>Expected</th><th>Your Output</th><th>Result</th><th className="text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {results.map((t, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <td>{i + 1}</td>
                  <td className="text-slate-300">{t.input}</td>
                  <td className="text-slate-300">{t.expected}</td>
                  <td className="text-slate-300">{t.output}</td>
                  <td>
                    {t.passed ? (
                      <span className="text-green-400 font-semibold">✅ Pass</span>
                    ) : (
                      <span className="text-red-400 font-semibold">❌ Fail</span>
                    )}
                  </td>
                  <td className="text-right">{t.points}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
