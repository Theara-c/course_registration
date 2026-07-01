// repo/adminRepository.js
import { pool } from "../database/db.js";

// ── Users ──
const getAllUsers = async ({ role = "", search = "" } = {}) => {
  let sql = `SELECT user_id, full_name, email, phone_number, gender, date_of_birth,
                    user_role, last_login, create_at
             FROM users WHERE 1=1`;
  const params = [];
  if (role) {
    sql += " AND user_role = ?";
    params.push(role);
  }
  if (search) {
    sql += " AND (full_name LIKE ? OR email LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  sql += " ORDER BY create_at DESC";
  const [rows] = await pool.query(sql, params);
  return rows;
};

const getUserById = async (userId) => {
  const [rows] = await pool.query(
    "SELECT user_id, full_name, email, phone_number, gender, date_of_birth, user_role, last_login, create_at FROM users WHERE user_id = ?",
    [userId],
  );
  return rows[0];
};

const deleteUser = async (userId) => {
  await pool.query("DELETE FROM users WHERE user_id = ?", [userId]);
};

// ── Courses ──
const getAllCourses = async ({ status = "", search = "" } = {}) => {
  let sql = `SELECT c.*, u.full_name AS instructor_name,
               (SELECT COUNT(*) FROM enrollment e WHERE e.course_id = c.course_id) AS enrolled_count
             FROM course c
             JOIN users u ON c.user_id = u.user_id
             WHERE 1=1`;
  const params = [];
  if (status) {
    sql += " AND c.status = ?";
    params.push(status);
  }
  if (search) {
    sql += " AND c.title LIKE ?";
    params.push(`%${search}%`);
  }
  sql += " ORDER BY c.created_at DESC";
  const [rows] = await pool.query(sql, params);
  return rows;
};

const setCourseStatus = async (courseId, status) => {
  await pool.query("UPDATE course SET status = ? WHERE course_id = ?", [
    status,
    courseId,
  ]);
};

const deleteCourse = async (courseId) => {
  await pool.query("DELETE FROM course WHERE course_id = ?", [courseId]);
};

// ── Dashboard stats ──
const getStats = async () => {
  const [[{ total_users }]] = await pool.query(
    "SELECT COUNT(*) AS total_users FROM users",
  );
  const [[{ total_students }]] = await pool.query(
    "SELECT COUNT(*) AS total_students FROM users WHERE user_role = 'Student'",
  );
  const [[{ total_lecturers }]] = await pool.query(
    "SELECT COUNT(*) AS total_lecturers FROM users WHERE user_role = 'Lecturer'",
  );
  const [[{ total_courses }]] = await pool.query(
    "SELECT COUNT(*) AS total_courses FROM course",
  );
  const [[{ active_courses }]] = await pool.query(
    "SELECT COUNT(*) AS active_courses FROM course WHERE status = 'Active'",
  );
  const [[{ total_enrollments }]] = await pool.query(
    "SELECT COUNT(*) AS total_enrollments FROM enrollment",
  );
  const [[{ completed_enrollments }]] = await pool.query(
    "SELECT COUNT(*) AS completed_enrollments FROM enrollment WHERE status = 'Completed'",
  );
  return {
    total_users,
    total_students,
    total_lecturers,
    total_courses,
    active_courses,
    total_enrollments,
    completed_enrollments,
  };
};

// ── Recent activity ──
const getRecentActivity = async () => {
  const [rows] = await pool.query(
    `SELECT a.*, u.full_name FROM activity_log a
     LEFT JOIN users u ON a.user_id = u.user_id
     ORDER BY a.created_at DESC LIMIT 20`,
  );
  return rows;
};

export {
  getAllUsers,
  getUserById,
  deleteUser,
  getAllCourses,
  setCourseStatus,
  deleteCourse,
  getStats,
  getRecentActivity,
};
