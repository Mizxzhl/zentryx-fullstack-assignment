import express from "express";
import { connectDB } from "./config/db";

const app = express();

const PORT = 3000;

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});