// routes/admin.js
import express from "express";
import { protect, requireRole } from "../middleware/auth.js";
import {
  getDashboardStats,
  getActivity,
  listUsers,
  getUser,
  removeUser,
  listCourses,
  updateCourseStatus,
  removeCourse,
} from "../controller/adminController.js";

const router = express.Router();
router.use(protect, requireRole("Administrator"));

router.get("/stats", getDashboardStats);
router.get("/activity", getActivity);
router.get("/users", listUsers);
router.get("/users/:id", getUser);
router.delete("/users/:id", removeUser);
router.get("/courses", listCourses);
router.put("/courses/:id/status", updateCourseStatus);
router.delete("/courses/:id", removeCourse);

export default router;
