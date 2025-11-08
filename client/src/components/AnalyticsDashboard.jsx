// client/src/components/AnalyticsDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { fetchAnalytics } from "../utils/api";

const emptyTop = [
  { name: "No data", score: 0 },
];

export default function AnalyticsDashboard({ assignmentId }) {
  const [data, setData] = useState([]);
  const [top5, setTop5] = useState(emptyTop);
  const [avg, setAvg] = useState(0);
  const [passed, setPassed] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!assignmentId) {
      setData([]);
      setTop5(emptyTop);
      setAvg(0);
      setPassed(0);
      setTotal(0);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const resp = await fetchAnalytics(assignmentId);
        const { top5 = [], avgScore = 0, passed = 0, total = 0 } = resp;
        setTop5(top5.length ? top5.map(t => ({ name: t.name, score: t.score })) : emptyTop);
        setAvg(avgScore || 0);
        setPassed(passed || 0);
        setTotal(total || 0);
        setData(top5.length ? top5.map(t => ({ name: t.name, score: t.score })) : emptyTop);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setData(emptyTop);
        setTop5(emptyTop);
        setAvg(0);
        setPassed(0);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [assignmentId]);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">📊 Analytics</h2>
        <span className="badge">Avg: {avg}</span>
      </div>

      <div className="mt-3">
        <div className="text-sm text-slate-300">
          {loading ? "Loading analytics…" : `${passed} passed / ${total} total`}
        </div>

        <div className="mt-3 h-64 bg-slate-900/40 rounded-xl p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Bar dataKey="score" fill="#6366f1" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold">Top 5 Scorers</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {top5.length === 0 ? (
              <li className="text-slate-400">No data</li>
            ) : (
              top5.map((t, i) => (
                <li key={t.name + i}>
                  {i + 1}. <strong>{t.name}</strong> — {t.score}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
