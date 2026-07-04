// controller/lecturerController.js
// Matches the pattern in your controller/userRoute.js — plain async
// functions calling the repo, used directly by the routes file.

import {
  getCoursesByUser,
  getCourseById,
  createCourse,
  updateCourse,
  updateCourseStatus,
  deleteCourse,
  getEnrolledStudents,
  getCourseRatings,
} from "../repo/courseRepository.js";
import { pool } from "../database/db.js";
import bcrypt from "bcryptjs";

// GET /api/lecturer/profile
export async function getProfile(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT user_id, full_name, email, phone_number, gender,
              date_of_birth, telegram_link, specialization, user_role
       FROM users WHERE user_id = ?`,
      [req.user.user_id],
    );
    if (!rows[0]) return res.status(404).json({ error: "User not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch profile" });
  }
}

// PUT /api/lecturer/profile
export async function updateProfile(req, res) {
  try {
    const {
      full_name,
      phone_number,
      gender,
      date_of_birth,
      telegram_link,
      specialization,
    } = req.body;

    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ error: "Full name is required" });
    }

    await pool.query(
      `UPDATE users
       SET full_name = ?, phone_number = ?, gender = ?,
           date_of_birth = ?, telegram_link = ?, specialization = ?
       WHERE user_id = ?`,
      [
        full_name,
        phone_number || null,
        gender || null,
        date_of_birth || null,
        telegram_link || null,
        specialization || null,
        req.user.user_id,
      ],
    );

    // Return the updated user so frontend can update localStorage
    const [rows] = await pool.query(
      `SELECT user_id, full_name, email, phone_number, gender,
              date_of_birth, telegram_link, specialization, user_role
       FROM users WHERE user_id = ?`,
      [req.user.user_id],
    );
    return res.json({ message: "Profile updated successfully", user: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to update profile" });
  }
}

// PUT /api/lecturer/settings/password
export async function changePassword(req, res) {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res
        .status(400)
        .json({ error: "Both current and new password are required" });
    }
    if (new_password.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters" });
    }

    // Fetch the current hashed password from DB
    const [rows] = await pool.query(
      "SELECT password FROM users WHERE user_id = ?",
      [req.user.user_id],
    );
    if (!rows[0]) return res.status(404).json({ error: "User not found" });

    // Verify the current password is correct
    const isMatch = await bcrypt.compare(current_password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash and save the new password
    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [
      hashed,
      req.user.user_id,
    ]);

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to change password" });
  }
}

// GET /api/lecturer/courses
// Lists every course this logged-in lecturer has created
export async function listMyCourses(req, res) {
  try {
    const courses = await getCoursesByUser(req.user.user_id);
    return res.json(courses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to fetch your courses" });
  }
}

// GET /api/lecturer/courses/:id
// One course + its enrolled students + ratings, for the management page
export async function getCourseDetail(req, res) {
  try {
    const courseId = parseInt(req.params.id);
    if (isNaN(courseId))
      return res.status(400).json({ error: "Invalid course ID" });

    const course = await getCourseById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // make sure this lecturer actually owns this course
    if (course.user_id !== req.user.user_id) {
      return res.status(403).json({ error: "This is not your course" });
    }

    const students = await getEnrolledStudents(courseId);
    const ratings = await getCourseRatings(courseId);

    return res.json({ course, students, ratings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to fetch course detail" });
  }
}

// POST /api/lecturer/courses
// Step 1 of "create course" action — title, description, category required.
// videoURL/duration can be added/edited afterwards.
export async function createNewCourse(req, res) {
  try {
    const {
      title,
      description,
      sub_description,
      category,
      videoURL,
      duration,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Course title is required" });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ error: "Category is required" });
    }

    const courseId = await createCourse(req.user.user_id, {
      title,
      description,
      sub_description,
      category,
      videoURL,
      duration,
    });

    return res
      .status(201)
      .json({ message: "Course created", course_id: courseId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to create course" });
  }
}

// PUT /api/lecturer/courses/:id
// Step 2 — edit any field (title, description, videoURL, etc.)
export async function editCourse(req, res) {
  try {
    const courseId = parseInt(req.params.id);
    if (isNaN(courseId))
      return res.status(400).json({ error: "Invalid course ID" });

    const course = await getCourseById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.user_id !== req.user.user_id) {
      return res.status(403).json({ error: "This is not your course" });
    }

    await updateCourse(courseId, req.user.user_id, req.body);
    return res.json({ message: "Course updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to update course" });
  }
}

// PUT /api/lecturer/courses/:id/publish
// Step 3 — flips status Inactive -> Active, making it visible to students
export async function publishCourse(req, res) {
  try {
    const courseId = parseInt(req.params.id);
    const course = await getCourseById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.user_id !== req.user.user_id) {
      return res.status(403).json({ error: "This is not your course" });
    }
    if (!course.videoURL) {
      return res
        .status(400)
        .json({ error: "Add a video link before publishing" });
    }

    await updateCourseStatus(courseId, req.user.user_id, "Active");
    return res.json({ message: "Course published — students can now see it" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to publish course" });
  }
}

// PUT /api/lecturer/courses/:id/unpublish
// Pulls it back to Inactive — hides it from students without deleting it
export async function unpublishCourse(req, res) {
  try {
    const courseId = parseInt(req.params.id);
    const course = await getCourseById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.user_id !== req.user.user_id) {
      return res.status(403).json({ error: "This is not your course" });
    }

    await updateCourseStatus(courseId, req.user.user_id, "Inactive");
    return res.json({ message: "Course unpublished" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to unpublish course" });
  }
}

// DELETE /api/lecturer/courses/:id
// Step 4 — separate, deliberate action. Permanently removes the course
// (and its enrollments/ratings, via ON DELETE CASCADE in your schema).
export async function removeCourse(req, res) {
  try {
    const courseId = parseInt(req.params.id);
    const course = await getCourseById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.user_id !== req.user.user_id) {
      return res.status(403).json({ error: "This is not your course" });
    }

    await deleteCourse(courseId, req.user.user_id);
    return res.json({ message: "Course deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to delete course" });
  }
}
