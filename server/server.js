import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { initSocket } from "./utils/socketManager.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import liveEditorRoutes from "./routes/liveEditorRoutes.js";
import testCaseRoutes from "./routes/testCaseRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

// ✅ Initialize Express app
const app = express();
app.use(cors({ origin: ["http://localhost:5173","http://localhost:5000"] }));
app.use(express.json()); // Parse JSON bodies

// ✅ Create HTTP server for Socket.io
const server = http.createServer(app);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Setup Socket.io
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // React frontend URL
//     methods: ["GET", "POST"],
//   },
// });

// ✅ Initialize Socket.io logic
// initSocket(io);

// ✅ API Routes (you will add these later)
import userRoutes from "./routes/userRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";

// Live Editor routes
app.use("/api", liveEditorRoutes);

app.use("/api/users", userRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/testcases", testCaseRoutes);
import analyticsRoutes from "./routes/analyticsRoutes.js";
// ...
app.use("/api/analytics", analyticsRoutes);


// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚀 Digital TA Backend is Running...");
});

// ✅ Middleware for 404 & errors
app.use(notFound);
app.use(errorHandler);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);