import React from "react";

export default function RunOutput({ output, error, execTime }) {
  return (
    <div className="card mt-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-semibold">Execution Output</h2>
        {execTime && <span className="text-sm text-slate-300">⏱ {execTime}s</span>}
      </div>

      <div className="p-4 font-mono text-sm overflow-y-auto max-h-60">
        {error && error.length > 0 ? (
          <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
        ) : output && output.length > 0 ? (
          <pre className="text-emerald-300 whitespace-pre-wrap">{output}</pre>
        ) : (
          <p className="text-slate-300">No output yet. Run your code to see results.</p>
        )}
      </div>
    </div>
  );
}
