// scripts/createAdmin.js
//
// Creates (or promotes) an Administrator account, hashing the password
// the exact same way the app does at signup. This exists because
// self-service Admin signup was intentionally removed from the public
// Signup form for security — every project needs one supported way to
// bootstrap the first admin, so this is it.
//
// Usage:
//   node scripts/createAdmin.js "Full Name" admin@example.com yourPassword123
//
// Or via the npm shortcut:
//   npm run create-admin -- "Full Name" admin@example.com yourPassword123

import bcrypt from "bcryptjs";
import { pool } from "../database/db.js";

async function main() {
  const [fullName, email, password] = process.argv.slice(2);

  if (!fullName || !email || !password) {
    console.error(
      "Usage: node scripts/createAdmin.js \"Full Name\" email@example.com password",
    );
    process.exit(1);
  }
  if (password.length < 6) {
    console.error("Password must be at least 6 characters.");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [existing] = await pool.query(
      "SELECT user_id, user_role FROM users WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      // Account already exists (e.g. you signed up as a Student) —
      // promote it to Administrator and set the new password.
      await pool.query(
        `UPDATE users
         SET full_name = ?, password = ?, user_role = 'Administrator', account_status = 'Approved'
         WHERE email = ?`,
        [fullName, hashedPassword, email],
      );
      console.log(`✅ Existing account "${email}" promoted to Administrator.`);
    } else {
      // No account yet — create a brand-new Administrator.
      await pool.query(
        `INSERT INTO users (full_name, email, password, user_role, account_status)
         VALUES (?, ?, ?, 'Administrator', 'Approved')`,
        [fullName, email, hashedPassword],
      );
      console.log(`✅ New Administrator account created for "${email}".`);
    }

    console.log("You can now log in at /login with that email and password.");
  } catch (err) {
    console.error("❌ Failed to create admin:", err.message);
  } finally {
    await pool.end();
  }
}

main();
