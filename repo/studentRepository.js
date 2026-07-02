// repo/studentRepository.js
import { pool } from "../database/db.js";

// All active courses students can browse (status = Active only)
const getAllActiveCourses = async (search = "") => {
  let sql = `SELECT c.*, u.full_name AS instructor_name,
               (SELECT COUNT(*) FROM enrollment e WHERE e.course_id = c.course_id) AS enrolled_count
             FROM course c
             JOIN users u ON c.user_id = u.user_id
             WHERE c.status = 'Active'`;
  const params = [];
  if (search) {
    sql += " AND (c.title LIKE ? OR c.category LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  sql += " ORDER BY c.created_at DESC";
  const [rows] = await pool.query(sql, params);
  return rows;
};

// Single course detail for course detail page
const getCourseDetail = async (courseId) => {
  const [rows] = await pool.query(
    `SELECT c.*, u.full_name AS instructor_name, u.specialization
     FROM course c
     JOIN users u ON c.user_id = u.user_id
     WHERE c.course_id = ?`,
    [courseId],
  );
  return rows[0];
};

// All courses a student is enrolled in (for dashboard)
const getStudentEnrollments = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT e.*, c.title, c.description, c.category, c.videoURL,
            c.duration, u.full_name AS instructor_name
     FROM enrollment e
     JOIN course c ON e.course_id = c.course_id
     JOIN users u ON c.user_id = u.user_id
     WHERE e.user_id = ?
     ORDER BY e.enrolled_at DESC`,
    [studentId],
  );
  return rows;
};

// Check if student is already enrolled
const checkEnrollment = async (studentId, courseId) => {
  const [rows] = await pool.query(
    "SELECT * FROM enrollment WHERE user_id = ? AND course_id = ?",
    [studentId, courseId],
  );
  return rows[0];
};

// Enroll student in a course
const enrollStudent = async (studentId, courseId) => {
  const [result] = await pool.query(
    `INSERT INTO enrollment (user_id, course_id, status) VALUES (?, ?, 'Enrolled')`,
    [studentId, courseId],
  );
  return result.insertId;
};

// Get student profile
const getStudentById = async (userId) => {
  const [rows] = await pool.query(
    `SELECT user_id, full_name, email, phone_number, gender, date_of_birth,
            telegram_link, specialization, user_role
     FROM users WHERE user_id = ?`,
    [userId],
  );
  return rows[0];
};

// Submit rating for a course
const submitRating = async (enrollmentId, rating, feedback) => {
  await pool.query(
    `INSERT INTO rating (enrollment_id, rating, feedback)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = ?, feedback = ?`,
    [enrollmentId, rating, feedback, rating, feedback],
  );
};

// Update last_watched on enrollment
const updateLastWatched = async (enrollmentId) => {
  await pool.query(
    "UPDATE enrollment SET last_watched = NOW() WHERE enrollment_id = ?",
    [enrollmentId],
  );
};

// Mark enrollment as completed
const completeEnrollment = async (enrollmentId) => {
  await pool.query(
    `UPDATE enrollment SET status = 'Completed', completed_at = NOW()
     WHERE enrollment_id = ?`,
    [enrollmentId],
  );
};

export {
  getAllActiveCourses,
  getCourseDetail,
  getStudentEnrollments,
  checkEnrollment,
  enrollStudent,
  getStudentById,
  submitRating,
  updateLastWatched,
  completeEnrollment,
};
