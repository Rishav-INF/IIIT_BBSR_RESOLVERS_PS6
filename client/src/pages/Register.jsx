import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"student" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users/register", form);
      nav("/login");
    } catch (e) {
      alert(e?.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="container-app py-10">
      <div className="max-w-md mx-auto card p-6">
        <h1 className="text-xl font-semibold">Create account</h1>
        <p className="text-slate-300 text-sm mt-1">Join Digital TA in seconds.</p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <input className="input" placeholder="Name"
                 value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input className="input" placeholder="Email"
                 value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          <input type="password" className="input" placeholder="Password"
                 value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
          <select className="input"
                  value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? "Creating…" : "Sign up"}
          </button>
        </form>

        <p className="text-slate-400 text-sm mt-3">
          Already have an account? <Link to="/login" className="text-indigo-300">Log in</Link>
        </p>
      </div>
    </div>
  );
}
