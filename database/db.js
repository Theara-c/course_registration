import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// create database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "elearning",
  // port: process.env.DB_PORT,
  // ssl: { rejectUnauthorized: false }
});

pool
  .getConnection()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB connection failed:", err.message));

export { pool };
