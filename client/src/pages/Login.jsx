import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const r = await login(email, password);
    if (r.ok) nav("/");
    else alert(r.error || "Login failed");
  };

  return (
    <div className="container-app py-10">
      <div className="max-w-md mx-auto card p-6">
        <h1 className="text-xl font-semibold">Log in</h1>
        <p className="text-slate-300 text-sm mt-1">
          Welcome back! Enter your credentials.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>

        <p className="text-slate-400 text-sm mt-3">
          New here? <Link to="/register" className="text-indigo-300">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
