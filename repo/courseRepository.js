// repo/courseRepository.js
import { pool } from "../database/db.js";

// 1. All courses created by one lecturer (their own management list)
export const getCoursesByUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT c.*,
        (SELECT COUNT(*) FROM enrollment e WHERE e.course_id = c.course_id AND e.status != 'Cancelled') AS enrolled_count
     FROM course c
     WHERE c.user_id = ?
     ORDER BY c.created_at DESC`,
    [userId],
  );
  return rows;
};

// 2. One course, with instructor's name joined in
export const getCourseById = async (courseId) => {
  const [rows] = await pool.query(
    `SELECT c.*, u.full_name AS instructor_name
     FROM course c
     JOIN users u ON c.user_id = u.user_id
     WHERE c.course_id = ?`,
    [courseId],
  );
  return rows[0];
};

// 3. Create a new course
export const createCourse = async (
  userId,
  { title, description, sub_description, category, videoURL, duration },
) => {
  const [result] = await pool.query(
    `INSERT INTO course (title, description, sub_description, category, videoURL, duration, status, user_id)
     VALUES (?, ?, ?, ?, ?, ?, 'Inactive', ?)`,
    [
      title,
      description,
      sub_description,
      category,
      videoURL,
      duration || 0,
      userId,
    ],
  );
  return result.insertId;
};

// 4. Update any of the editable fields
export const updateCourse = async (courseId, userId, fields) => {
  const allowed = [
    "title",
    "description",
    "sub_description",
    "category",
    "videoURL",
    "duration",
  ];
  const sets = [];
  const params = [];

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }
  if (sets.length === 0) return;

  params.push(courseId, userId);
  await pool.query(
    `UPDATE course SET ${sets.join(", ")} WHERE course_id = ? AND user_id = ?`,
    params,
  );
};

// 5. Toggle Active / Inactive
export const updateCourseStatus = async (courseId, userId, status) => {
  await pool.query(
    `UPDATE course SET status = ? WHERE course_id = ? AND user_id = ?`,
    [status, courseId, userId],
  );
};

// 6. Delete course record row
export const deleteCourse = async (courseId, userId) => {
  await pool.query(`DELETE FROM course WHERE course_id = ? AND user_id = ?`, [
    courseId,
    userId,
  ]);
};

// 7. Students enrolled in one of the lecturer's courses
export const getEnrolledStudents = async (courseId) => {
  const [rows] = await pool.query(
    `SELECT e.*, u.full_name, u.email, u.phone_number
     FROM enrollment e
     JOIN users u ON e.user_id = u.user_id
     WHERE e.course_id = ?
     ORDER BY e.enrolled_at DESC`,
    [courseId],
  );
  return rows;
};

// 8. Ratings/feedback left on this lecturer's course
export const getCourseRatings = async (courseId) => {
  const [rows] = await pool.query(
    `SELECT r.*, u.full_name
     FROM rating r
     JOIN enrollment e ON r.enrollment_id = e.enrollment_id
     JOIN users u ON e.user_id = u.user_id
     WHERE e.course_id = ?
     ORDER BY r.created_at DESC`,
    [courseId],
  );
  return rows;
};
