// controller/studentController.js
import {
  getAllActiveCourses,
  getCourseDetail,
  getStudentEnrollments,
  checkEnrollment,
  enrollStudent,
  getStudentById,
  submitRating,
  updateLastWatched,
  completeEnrollment,
} from "../repo/studentRepository.js";
import { pool } from "../database/db.js";

// GET /api/student/courses?search=
export async function browseCourses(req, res) {
  try {
    const courses = await getAllActiveCourses(req.query.search || "");
    return res.json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch courses" });
  }
}

// GET /api/student/courses/:id
export async function getCourse(req, res) {
  try {
    const course = await getCourseDetail(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // If student is logged in, check enrollment status too
    let enrollment = null;
    if (req.user) {
      enrollment = await checkEnrollment(req.user.user_id, req.params.id);
    }
    return res.json({ course, enrollment: enrollment || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch course" });
  }
}

// GET /api/student/dashboard (student's own profile + enrollments)
export async function getDashboard(req, res) {
  try {
    const [student, enrollments] = await Promise.all([
      getStudentById(req.user.user_id),
      getStudentEnrollments(req.user.user_id),
    ]);
    return res.json({ student, enrollments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch dashboard" });
  }
}

// POST /api/student/courses/:id/enroll
export async function enroll(req, res) {
  try {
    const courseId = req.params.id;
    const studentId = req.user.user_id;

    const existing = await checkEnrollment(studentId, courseId);
    if (existing) {
      return res
        .status(409)
        .json({ error: "You are already enrolled in this course" });
    }

    const course = await getCourseDetail(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.status !== "Active") {
      return res
        .status(403)
        .json({ error: "This course is not available for enrollment" });
    }

    const enrollmentId = await enrollStudent(studentId, courseId);

    // Log this action
    await pool.query(
      `INSERT INTO activity_log (user_id, action, target_type, target_id) VALUES (?, 'ENROLL', 'Course', ?)`,
      [studentId, courseId],
    );

    return res
      .status(201)
      .json({ message: "Enrolled successfully", enrollment_id: enrollmentId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to enroll" });
  }
}

// POST /api/student/enrollments/:enrollmentId/rating
export async function rateEnrollment(req, res) {
  try {
    const { rating, feedback } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    await submitRating(req.params.enrollmentId, rating, feedback || "");
    return res.json({ message: "Rating submitted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to submit rating" });
  }
}

// PUT /api/student/enrollments/:enrollmentId/watch
export async function markWatched(req, res) {
  try {
    await updateLastWatched(req.params.enrollmentId);
    return res.json({ message: "Progress updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to update progress" });
  }
}

// PUT /api/student/enrollments/:enrollmentId/complete
export async function markComplete(req, res) {
  try {
    await completeEnrollment(req.params.enrollmentId);
    return res.json({ message: "Course marked as completed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to complete enrollment" });
  }
}
