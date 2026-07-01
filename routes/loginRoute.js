// controller/loginRoute.js
// Was empty in your project — this fills it in.
// Verifies email + password, returns a JWT containing user_id + user_role.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, updateLastLogin } from "../repo/authRepository.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    await updateLastLogin(user.user_id);

    const token = jwt.sign(
      { user_id: user.user_id, user_role: user.user_role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // never send the password hash back to the client
    delete user.password;

    return res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error during login" });
  }
}
