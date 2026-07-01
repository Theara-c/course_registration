// controller/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../repo/userRepository.js";

const ALLOWED_ROLES = ["Student", "Lecturer", "Administrator"];

// POST /api/auth/register
export async function registerUser(req, res) {
  try {
    const {
      full_name,
      fullName, // some forms send fullName, others full_name
      email,
      password,
      confirmPassword,
      phone_number,
      gender,
      date_of_birth,
      telegram_link,
      user_role,
    } = req.body;

    // FIX: was `const full_name = full_name || fullName` which caused
    // "Cannot redeclare block-scoped variable" crash — changed to new var
    const finalName = full_name || fullName;

    if (!finalName || !email || !password) {
      return res
        .status(400)
        .json({ error: "Full name, email, and password are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }

    const finalRole = ALLOWED_ROLES.includes(user_role) ? user_role : "Student";
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser({
      full_name: finalName,
      email,
      password: hashedPassword,
      phone_number: phone_number || null,
      gender: gender || null,
      date_of_birth: date_of_birth || null,
      telegram_link: telegram_link || null,
      user_role: finalRole,
    });

    // Also return a token so the frontend can optionally auto-login after register
    const token = jwt.sign(
      { user_id: userId, user_role: finalRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        user_id: userId,
        full_name: finalName,
        email,
        user_role: finalRole,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error during registration." });
  }
}

// POST /api/auth/login
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Update last login timestamp
    const { pool } = await import("../database/db.js");
    await pool.query("UPDATE users SET last_login = NOW() WHERE user_id = ?", [
      user.user_id,
    ]);

    const token = jwt.sign(
      { user_id: user.user_id, user_role: user.user_role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    delete user.password;

    return res.json({ message: "Login successful.", token, user });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error during login." });
  }
}
