// routes/admin.js
import express from "express";
import { protect, requireRole } from "../middleware/auth.js";
import {
  getDashboardStats,
  getActivity,
  listUsers,
  getUser,
  removeUser,
  listPendingLecturers,
  approveLecturer,
  rejectLecturer,
  listCourses,
  updateCourseStatus,
  handleCourseReview,
  removeCourse,
} from "../controller/adminController.js";

const router = express.Router();
router.use(protect, requireRole("Administrator"));

router.get("/stats", getDashboardStats);
router.get("/activity", getActivity);
router.get("/users", listUsers);
router.get("/users/:id", getUser);
router.delete("/users/:id", removeUser);

// Lecturer signup approval queue
router.get("/lecturers/pending", listPendingLecturers);
router.put("/lecturers/:id/approve", approveLecturer);
router.put("/lecturers/:id/reject", rejectLecturer);
router.get("/courses", listCourses);
router.put("/courses/:id/status", updateCourseStatus);
router.put("/courses/:id/review", handleCourseReview);
router.delete("/courses/:id", removeCourse);

export default router;
