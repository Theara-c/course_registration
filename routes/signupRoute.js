// controller/signupRoute.js
// Was empty in your project — this fills it in.
// Creates a new user with a hashed password and a chosen role.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../repo/authRepository.js";

const ALLOWED_ROLES = ["Student", "Lecturer", "Administrator"];

export async function signup(req, res) {
  try {
    const {
      full_name,
      email,
      password,
      phone_number,
      telegram_link,
      gender,
      date_of_birth,
      user_role,
    } = req.body;

    if (!full_name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Full name, email, and password are required" });
    }

    const finalRole = ALLOWED_ROLES.includes(user_role) ? user_role : "Student";

    const existing = await findUserByEmail(email);
    if (existing) {
      return res
        .status(409)
        .json({ error: "This email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser({
      full_name,
      email,
      password: hashedPassword,
      phone_number,
      telegram_link,
      gender,
      date_of_birth,
      user_role: finalRole,
    });

    const token = jwt.sign(
      { user_id: userId, user_role: finalRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: { user_id: userId, full_name, email, user_role: finalRole },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error during signup" });
  }
}
