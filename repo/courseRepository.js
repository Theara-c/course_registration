// repo/courseRepository.js
import { pool } from "../database/db.js";

// 1. All courses created by one lecturer (their own management list)
export const getCoursesByUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT c.*, cat.category_name AS category,
        (SELECT COUNT(*) FROM enrollment e WHERE e.course_id = c.course_id AND e.status != 'Cancelled') AS enrolled_count
     FROM course c
     LEFT JOIN Category cat ON c.category_id = cat.category_id
     WHERE c.user_id = ?
     ORDER BY c.created_at DESC`,
    [userId],
  );
  return rows;
};

// 2. One course, with instructor's name joined in
export const getCourseById = async (courseId) => {
  const [rows] = await pool.query(
    `SELECT c.*, cat.category_name AS category, u.full_name AS instructor_name
     FROM course c
     LEFT JOIN Category cat ON c.category_id = cat.category_id
     JOIN users u ON c.user_id = u.user_id
     WHERE c.course_id = ?`,
    [courseId],
  );
  return rows[0];
};

// 3. Look up a category by name (case-insensitive); create it if it
//    doesn't exist yet, so lecturers can type a free-text category.
export const getOrCreateCategoryId = async (categoryName) => {
  if (!categoryName || !categoryName.trim()) return null;
  const name = categoryName.trim();

  const [rows] = await pool.query(
    `SELECT category_id FROM Category WHERE LOWER(category_name) = LOWER(?)`,
    [name],
  );
  if (rows[0]) return rows[0].category_id;

  const [result] = await pool.query(
    `INSERT INTO Category (category_name, description) VALUES (?, ?)`,
    [name, `Courses related to ${name.toLowerCase()}.`],
  );
  return result.insertId;
};

// 4. Create a new course
export const createCourse = async (
  userId,
  { title, description, sub_description, category, video_id, duration, price },
) => {
  const categoryId = await getOrCreateCategoryId(category);

  const [result] = await pool.query(
    `INSERT INTO course (title, description, sub_description, category_id, video_id, duration, price, status, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
    [
      title,
      description || null,
      sub_description || null,
      categoryId,
      video_id || null,
      duration || 0,
      price !== undefined ? price : 0, //  0 is free
      userId,
    ],
  );
  return result.insertId;
};

// 5. Update any of the editable fields
export const updateCourse = async (courseId, userId, fields) => {
  const allowed = [
    "title",
    "description",
    "sub_description",
    "category_id",
    "video_id",
    "price",
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

// 6. Toggle Active / Inactive
export const updateCourseStatus = async (courseId, userId, status) => {
  await pool.query(
    `UPDATE course SET status = ? WHERE course_id = ? AND user_id = ?`,
    [status, courseId, userId],
  );
};

// 7. Delete course record row
export const deleteCourse = async (courseId, userId) => {
  await pool.query(`DELETE FROM course WHERE course_id = ? AND user_id = ?`, [
    courseId,
    userId,
  ]);
};

// 8. Students enrolled in one of the lecturer's courses
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

// 9. Ratings/feedback left on this lecturer's course
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
// 10. Admin Review Status Update (Allows Admin validation without matching lecturer user_id)
export const adminUpdateCourseStatus = async (courseId, status) => {
  await pool.query(`UPDATE course SET status = ? WHERE course_id = ?`, [
    status,
    courseId,
  ]);
};
