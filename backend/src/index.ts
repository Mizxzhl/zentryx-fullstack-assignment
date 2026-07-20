import express from "express";
import cors from "cors";

import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

const app = express();

const PORT = 3000;

// Connect to PostgreSQL
connectDB();

// Enable CORS (Allow requests from React frontend)
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running let's go!");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});