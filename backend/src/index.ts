import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import documentsRouter from "./routes/documents.js";

dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env["PORT"] ?? 8080;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello World from City Policy RAG Backend!" });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/documents", documentsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
