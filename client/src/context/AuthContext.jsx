import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // { _id, name, email, role }
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUser(res.data))
      .catch(() => { setUser(null); setToken(null); localStorage.removeItem("token"); });
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e?.response?.data?.message || "Login failed" };
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}