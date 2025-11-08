// client/src/pages/InstructorDashboard.jsx
import React, { useEffect, useState } from "react";
import AssignmentForm from "../components/AssignmentForm";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import Leaderboard from "../components/LeaderBoard";
import { fetchAssignments } from "../utils/api";

export default function InstructorDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAssignments();
        setAssignments(data || []);
      } catch (err) {
        console.error("Error loading assignments:", err);
      }
    })();
  }, []);

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-semibold mb-6">🧑‍🏫 Instructor Dashboard</h1>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="text-lg font-semibold mb-3">Create New Assignment</h2>
          <AssignmentForm />
        </div>

        <div className="card p-5">
          <h2 className="text-lg font-semibold mb-3">Select Assignment</h2>
          <select
            className="input"
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
          >
            <option value="">-- Select Assignment --</option>
            {assignments.map((a) => (
              <option key={a._id} value={a._id}>
                {a.title}
              </option>
            ))}
          </select>
          <p className="text-slate-400 text-sm mt-2">
            Choose an assignment to see analytics and leaderboard.
          </p>
        </div>
      </div>

      {selectedAssignment && (
        <div className="grid md:grid-cols-2 gap-5 mt-6">
          <AnalyticsDashboard assignmentId={selectedAssignment} />
          <Leaderboard assignmentId={selectedAssignment} />
        </div>
      )}
    </div>
  );
}
