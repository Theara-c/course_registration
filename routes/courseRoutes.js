import express from "express";
import * as courseRepo from "../repo/courseRepository.js";

// Note: Import your own token verification and authorization middlewares here
// import { verifyToken, isLecturer, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── 1. LECTURER ROUTE: Create Course Request ──
// Matches the "Course Creation" sequence form submission
router.post("/lecturer/courses", async (req, res) => {
  try {
    const userId = req.body.user_id || req.user?.user_id; // Use your auth middleware strategy here
    const {
      title,
      description,
      sub_description,
      category,
      videoURL,
      duration,
    } = req.body;

    // ── Diagram Step: Validate form ──
    if (!title || !description || !category) {
      return res
        .status(400)
        .json({
          error:
            "Validation failed: Title, Description, and Category are required.",
        });
    }

    // ── Diagram Step: [form valid] -> Notify Admin & Insert into DB ──
    // Since we updated your repository, this automatically defaults the status to 'Pending'
    const courseId = await courseRepo.createCourse(userId, {
      title,
      description,
      sub_description,
      category,
      videoURL,
      duration,
    });

    return res.status(201).json({
      message:
        "Course submitted successfully! Admin has been notified for verification.",
      course_id: courseId,
      status: "Pending",
    });
  } catch (error) {
    console.error("❌ Error during course creation workflow:", error);
    return res
      .status(500)
      .json({ error: "Internal server error handling submission." });
  }
});

// ── 2. LECTURER ROUTE: Get Single Course Details ──
// Supplies data to your LecturerCourseDetailPage.jsx page component
router.get("/lecturer/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const course = await courseRepo.getCourseById(id);
    if (!course) {
      return res.status(404).json({ error: "Course parameters not found." });
    }

    const students = await courseRepo.getEnrolledStudents(id);
    const ratings = await courseRepo.getCourseRatings(id);

    return res.status(200).json({ course, students, ratings });
  } catch (error) {
    console.error("❌ Error reading data logs:", error);
    return res
      .status(500)
      .json({ error: "Failed to read database information records." });
  }
});

// ── 3. ADMIN ROUTE: Confirm / Decline Course ──
// Matches the final [Approved = true / false] split block from your diagram
router.put("/admin/courses/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body; // Expects true or false from the admin control deck

    const course = await courseRepo.getCourseById(id);
    if (!course) {
      return res
        .status(404)
        .json({ error: "Target course metadata not found." });
    }

    if (approved) {
      // ── Diagram Step: [Approved = true] -> Publish course ──
      await courseRepo.adminUpdateCourseStatus(id, "Active");
      return res.status(200).json({
        message: "Course approved! It is now live for students.",
        status: "Active",
      });
    } else {
      // ── Diagram Step: [Approved = false] -> Show feedback message ──
      await courseRepo.adminUpdateCourseStatus(id, "Inactive");
      return res.status(200).json({
        message:
          "Course rejected. Revisions feedback redirected to lecturer profile.",
        status: "Inactive",
      });
    }
  } catch (error) {
    console.error("❌ Admin verification error context:", error);
    return res
      .status(500)
      .json({ error: "Internal processing error during review update." });
  }
});

export default router;
