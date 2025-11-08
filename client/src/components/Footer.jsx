import React from "react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10">
      <div className="container-app py-6 text-sm text-slate-300 text-center">
        © {new Date().getFullYear()} <span className="text-indigo-300 font-semibold">Digital TA</span> — Empowering Smart Learning 💡
      </div>
    </footer>
  );
}
