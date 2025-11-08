import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import LiveEditorPage from "./pages/LiveEditorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Home() {
  return (
    <main>
      <section className="container-app pt-10 pb-8">
        <div className="card p-8">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Welcome to <span className="text-indigo-400">Digital TA</span>
          </h1>
          <p className="text-slate-300 mt-2 max-w-2xl">
            Practice, compete and learn with a focused live editor, instant
            feedback, analytics and leaderboards — all in one place.
          </p>

          <div className="mt-5 flex gap-3">
            <a href="/register" className="btn btn-primary">Get started</a>
            <a href="/live" className="btn">Try Live Editor</a>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="card p-5">
            <h3 className="text-lg font-semibold">Live Editor</h3>
            <p className="text-slate-300 text-sm mt-1">
              Fast run, clean output, sample tests and stdin panel.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="text-lg font-semibold">Leaderboards</h3>
            <p className="text-slate-300 text-sm mt-1">
              Weekly challenges, ranks and streaks to keep you motivated.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="text-lg font-semibold">Analytics</h3>
            <p className="text-slate-300 text-sm mt-1">
              Track accuracy, speed and topic mastery over time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function NotFound() {
  return (
    <div className="container-app min-h-[50vh] grid place-items-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-1">404 — Page not found</h2>
        <p className="text-slate-300">Check the URL or use the navbar.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-protected */}
        <Route
          path="/student"
          element={
            <PrivateRoute allow={["student"]}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor"
          element={
            <PrivateRoute allow={["instructor"]}>
              <InstructorDashboard />
            </PrivateRoute>
          }
        />

        {/* Live editor (viewable by anyone) */}
        <Route path="/live" element={<LiveEditorPage />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
