// client/src/utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// === Instructor APIs ===
export const createAssignment = async (assignmentData) => {
  const res = await API.post("/assignments/create", assignmentData);
  return res.data;
};

export const fetchAssignments = async () => {
  const res = await API.get("/assignments/get");
  return res.data;
};

export const uploadTestCases = async (formData) => {
  const res = await API.post("/assignments/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Analytics & Leaderboard
export const fetchLeaderboard = async (assignmentId) => {
  const res = await API.get(`/analytics/leaderboard/${assignmentId}`);
  return res.data;
};

export const fetchAnalytics = async (assignmentId) => {
  const res = await API.get(`/analytics/analytics/${assignmentId}`);
  return res.data;
};

// === Student APIs ===
export const getAllAssignments = async () => {
  const res = await API.get("/assignments/get");
  return res.data;
};

export const executeCode = async (code, language) => {
  const res = await API.post("/execute", { code, language });
  return res.data;
};

export const submitAssignment = async (code, language, assignmentId) => {
  const res = await API.post("/submit", { code, language, assignmentId });
  return res.data;
};

export const fetchSubmissions = async (studentId) => {
  const res = await API.get(`/submissions/${studentId}`);
  return res.data;
};

export default API;