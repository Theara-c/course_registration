// app.js — FIXED:
// 1. Removed duplicate app.use('/api/auth') and app.use('/api/lecturer')
// 2. authRouter now imports from routes/auth.js (has /register + /login)
//    instead of middleware/auth.js (only has protect + requireRole)
// 3. Added adminRouter

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./database/db.js";
import authRouter from "./routes/auth.js";
import lecturerRouter from "./routes/lecturer.js";
import adminRouter from "./routes/admin.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ── Auth (register + login — no token needed)
app.use("/api/auth", authRouter);

// ── Lecturer routes (requires Lecturer token)
app.use("/api/lecturer", lecturerRouter);

// ── Admin routes (requires Administrator token)
app.use("/api/admin", adminRouter);

// ── Existing user routes kept as-is ──
app.get("/", (req, res) => res.json({ msg: "Hello world" }));

app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    return res.json(rows);
  } catch {
    return res.status(500).json({ error: "Unable to fetch users" });
  }
});

app.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))
    return res.status(400).json({ error: "Invalid user ID format" });
  try {
    const [rows] = await pool.query(
      "SELECT user_id,full_name,email,phone_number,telegram_link,gender,date_of_birth,user_role FROM users WHERE user_id = ?",
      [id],
    );
    return res.json(rows[0]);
  } catch {
    return res.status(500).json({ error: "Unable to fetch user" });
  }
});

export default app;
