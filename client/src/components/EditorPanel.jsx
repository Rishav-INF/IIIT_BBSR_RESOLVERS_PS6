import React from "react";
import Editor from "@monaco-editor/react";

export default function EditorPanel({
  language = "python3",
  code,
  setCode,
  stdin,
  setStdin,
  onRun,
  isRunning,
}) {
  const handleRun = async () => {
    if (!code?.trim()) return;
    await onRun({ code, language, stdin });
  };

  return (
    <div className="card text-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-semibold">Code Editor</h2>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className={`btn ${isRunning ? "" : "btn-primary"}`}
        >
          {isRunning ? "Running…" : "Run Code"}
        </button>
      </div>

      <div className="px-2">
        <Editor
          height="60vh"
          defaultLanguage={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="p-3 border-t border-white/10 bg-black/30 rounded-b-2xl">
        <label className="block text-xs mb-1 text-slate-300">Standard Input</label>
        <textarea
          className="input h-24 bg-[#0e1420]"
          placeholder="e.g.&#10;5&#10;3"
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
        />
      </div>
    </div>
  );
}
