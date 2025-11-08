import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const linkCls = ({ isActive }) =>
    `px-3 py-2 rounded-lg transition ${
      isActive ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-black/60 border-b border-white/10">
      <div className="container-app flex items-center justify-between py-3">
        <NavLink to="/" className="font-semibold tracking-wide text-white">
          🧠 Digital TA
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/student" className={linkCls}>Student</NavLink>
          <NavLink to="/instructor" className={linkCls}>Instructor</NavLink>
          <NavLink to="/live" className={linkCls}>Live Editor</NavLink>

          <div className="w-px h-6 bg-white/10 mx-2" />

          {!user ? (
            <>
              <NavLink to="/login" className="btn">Log in</NavLink>
              <NavLink to="/register" className="btn btn-primary">Sign up</NavLink>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-slate-300">
                {user.name} <span className="badge ml-1 uppercase">{user.role}</span>
              </span>
              <button
                onClick={() => { logout(); nav("/login"); }}
                className="btn !bg-red-600/80 hover:!bg-red-600 text-white border-transparent"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden btn"
          aria-label="Toggle navigation"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/10">
          <div className="container-app py-3 flex flex-col gap-2">
            <NavLink onClick={()=>setOpen(false)} to="/student" className={linkCls}>Student</NavLink>
            <NavLink onClick={()=>setOpen(false)} to="/instructor" className={linkCls}>Instructor</NavLink>
            <NavLink onClick={()=>setOpen(false)} to="/live" className={linkCls}>Live Editor</NavLink>
            {!user ? (
              <>
                <NavLink onClick={()=>setOpen(false)} to="/login" className="btn">Log in</NavLink>
                <NavLink onClick={()=>setOpen(false)} to="/register" className="btn btn-primary">Sign up</NavLink>
              </>
            ) : (
              <button
                onClick={() => { setOpen(false); logout(); nav("/login"); }}
                className="btn !bg-red-600/80 hover:!bg-red-600 text-white border-transparent"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
