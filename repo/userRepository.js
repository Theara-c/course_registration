import { pool } from "../database/db.js";
const getAllUser = async () => {
  const [rows] = await pool.query(`SELECT * FROM users`);
  return rows;
};
// 2. New function: Find a user by email (used to prevent duplicate signups)
const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0] || null; // Returns the user object if found, or null if safe to register
};

// 3. New function: Insert the new account using fields from your frontend form
const createUser = async ({
  full_name,
  email,
  password,
  phone_number,
  gender,
  date_of_birth,
  user_role,
}) => {
  const [result] = await pool.query(
    `INSERT INTO users (full_name, email, password, phone_number, gender, date_of_birth, user_role)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      full_name,
      email,
      password,
      phone_number || null,
      gender || null,
      date_of_birth || null,
      user_role || "Student",
    ],
  );
  return result.insertId; // Returns the newly generated user_id
};

export { getAllUser, findUserByEmail, createUser };
