// client/src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Tiny status chip (self-contained)
function StatusBadge({ status }) {
  const map = {
    active: "bg-emerald-500/20 text-emerald-300",
    completed: "bg-indigo-500/20 text-indigo-300",
    closed: "bg-rose-500/20 text-rose-300",
  };
  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${map[status] || "bg-slate-500/20 text-slate-300"}`}>
      {status}
    </span>
  );
}

export default function StudentDashboard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");

  // Axios with auth header
  const api = axios.create({ baseURL: "http://localhost:5000" });
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        // Server route you set up in assignmentRoutes:
        // GET /api/assignments/student/list  (protected + student role)
        const { data } = await api.get("/api/assignments/student/list");
        setAssignments(data || []);
      } catch (e) {
        setError(
          e?.response?.data?.message ||
            "Failed to load assignments. Please try again."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openEditor = (a) => {
    // (Optional) stash current assignment meta for LiveEditor to read
    localStorage.setItem(
      "currentAssignment",
      JSON.stringify({
        id: a._id,
        title: a.title,
        language: a.language,
        inputFileUrl: a.inputFileUrl,   // if you populated these on server
        outputFileUrl: a.outputFileUrl, // "
        questionPdfUrl: a.questionPdfUrl,
      })
    );
    nav(`/live?assignment=${a._id}`);
  };

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-semibold mb-4">🎓 Student Dashboard</h1>

      {/* Active Assignments */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Assignments</h2>
          <span className="badge">{assignments.length} total</span>
        </div>

        {loading ? (
          <p className="text-slate-300">Loading…</p>
        ) : error ? (
          <p className="text-rose-300">{error}</p>
        ) : assignments.length === 0 ? (
          <p className="text-slate-300">No assignments found.</p>
        ) : (
          <table className="table-base">
            <thead>
              <tr>
                <th>Title</th>
                <th>Language</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Question</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a._id}>
                  <td>{a.title}</td>
                  <td className="capitalize">{a.language}</td>
                  <td>{new Date(a.deadline).toLocaleString()}</td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td>
                    {a.questionPdfUrl ? (
                      <a
                        href={`http://localhost:5000${a.questionPdfUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-300 hover:underline"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => openEditor(a)}
                      disabled={a.status !== "active"}
                      className={`btn ${
                        a.status === "active"
                          ? "btn-primary"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      title={
                        a.status === "active"
                          ? "Open in Live Editor"
                          : a.status === "completed"
                          ? "Already submitted"
                          : "Deadline passed"
                      }
                    >
                      Open Editor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* (Optional) Legend */}
      <div className="mt-4 text-sm text-slate-400">
        <p>
          <strong>Status legend:</strong>{" "}
          <span className="ml-2"><StatusBadge status="active" /> can submit</span>{" "}
          <span className="ml-2"><StatusBadge status="completed" /> already submitted</span>{" "}
          <span className="ml-2"><StatusBadge status="closed" /> deadline passed</span>
        </p>
      </div>
    </div>
  );
};