// routes/auth.js
// This was the missing piece — app.js imported authRouter expecting
// /register and /login endpoints, but the old auth.js only had protect().

import express from "express";
import { registerUser, loginUser } from "../controller/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
