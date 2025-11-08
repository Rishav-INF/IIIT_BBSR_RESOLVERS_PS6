import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAssignment } from "../context/AssignmentContext";
import api from "../utils/api";
import EditorPanel from "../components/EditorPanel";
import RunOutput from "../components/RunOutput";
import SubmissionResult from "../components/SubmissionResult";

const LANG_MAP = {
  python3:    { language: "python",     version: "*" },
  "g++":      { language: "cpp",        version: "*" },
  javascript: { language: "javascript", version: "*" },
  python:     { language: "python",     version: "*" },
  cpp:        { language: "cpp",        version: "*" },
};

const fetchText = async (relativeUrl) => {
  if (!relativeUrl) return "";
  const url = relativeUrl.startsWith("http")
    ? relativeUrl
    : `http://localhost:5000${relativeUrl}`;
  const res = await fetch(url);
  return res.ok ? await res.text() : "";
};

export default function LiveEditorPage() {
  const location = useLocation();
  const { user } = useAuth();
  const { currentAssignment, setCurrentAssignment } = useAssignment();

  const assignmentId = useMemo(() => {
    const q = new URLSearchParams(location.search);
    return q.get("assignment") || "";
  }, [location.search]);

  const [language, setLanguage] = useState("python3");
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // If user lands directly, fetch meta + input/output files and prime context
  useEffect(() => {
    (async () => {
      if (!assignmentId) return;
      if (currentAssignment && currentAssignment._id === assignmentId) return;

      try {
        const { data } = await api.get(`/assignments/get/${assignmentId}`);
        const [inputContent, outputContent] = await Promise.all([
          fetchText(data.inputFileUrl),
          fetchText(data.outputFileUrl),
        ]);
        setCurrentAssignment({
          ...data,
          inputContent,
          outputContent,
        });
      } catch (e) {
        console.error("Failed to preload assignment:", e);
      }
    })();
  }, [assignmentId, currentAssignment, setCurrentAssignment]);

  const handleRunCode = async ({ code: src, language: lang, stdin: inText = "" }) => {
    if (!src?.trim()) return setOutput("⚠ Please write some code before running.");
    setLoading(true);
    setOutput("");

    const mapped = LANG_MAP[lang] || { language: lang, version: "*" };
    try {
      const res = await axios.post("http://localhost:5000/api/execute", {
        code: src, language: mapped.language, version: mapped.version, stdin: inText,
      });
      setOutput(res.data.output || "✅ No output.");
    } catch {
      setOutput("❌ Error executing code. Check server logs.");
    } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!code?.trim()) return setOutput("⚠ Please write some code before submitting.");
    if (!assignmentId) return setOutput("⚠ No assignment selected.");
    setLoading(true); setResult(null);
    try {
      const { data } = await api.post("/grade", {
        assignmentId,
        code,
        language,
        studentName: user?.name || "Anonymous",
      });
      setResult({ results: data.results, totalScore: data.totalScore });
      setOutput(`🧪 Graded ${data.results.length} cases.\nScore: ${data.totalScore}/${data.maxScore}`);
    } catch (e) {
      setResult({ error: e?.response?.data?.message || "❌ Submission failed. Check server logs." });
    } finally { setLoading(false); }
  };

  const a = currentAssignment;
  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-semibold mb-2">💻 Live Coding Editor</h1>

      <div className="text-sm text-slate-300 mb-4 flex items-center gap-3 flex-wrap">
        {a ? (
          <>
            <span className="badge">{a.title}</span>
            <span className="badge capitalize">{a.language}</span>
            {a.questionPdfUrl && (
              <a
                href={`http://localhost:5000${a.questionPdfUrl}`}
                target="_blank" rel="noreferrer"
                className="text-indigo-300 hover:underline"
              >
                View Problem PDF
              </a>
            )}
            {a.inputContent && <span className="badge">inputs: loaded</span>}
            {a.outputContent && <span className="badge">outputs: loaded</span>}
          </>
        ) : (
          <span>Tip: open via <code className="badge">/live?assignment=&lt;id&gt;</code></span>
        )}
        <span className="ml-auto">
          {user ? `Logged in as ${user.name} (${user.role})` : "Not logged in (grading requires login)"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select className="input max-w-xs" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python3">Python 3</option>
          <option value="g++">C++ (g++)</option>
          <option value="javascript">JavaScript (Node)</option>
        </select>

        <div className="ml-auto flex gap-2">
          <button onClick={() => handleRunCode({ code, language, stdin })} className="btn" disabled={loading}>
            ▶ Run
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading}
            title={user ? "" : "Login required to submit & grade"}
          >
            🚀 Submit & Grade
          </button>
        </div>
      </div>

      <EditorPanel
        language={language}
        code={code}
        setCode={setCode}
        stdin={stdin}
        setStdin={setStdin}
        onRun={handleRunCode}
        isRunning={loading}
      />

      <RunOutput output={output} error="" execTime={loading ? undefined : 45} />
      {result && !result.error && (
        <SubmissionResult results={result.results} totalScore={result.totalScore} />
      )}
      {result?.error && <div className="text-red-400 font-semibold mt-3">{result.error}</div>}
    </div>
  );
}