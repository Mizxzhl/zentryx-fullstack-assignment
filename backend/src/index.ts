import express from "express";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

const app = express();

const PORT = 3000;

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);