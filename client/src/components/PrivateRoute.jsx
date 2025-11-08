import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, allow = [] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allow.length && !allow.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
