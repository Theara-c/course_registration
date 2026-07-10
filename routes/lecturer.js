// routes/lecturer.js
// Mirrors your routes/student.js naming. Every route here requires
// login AND user_role = 'Lecturer'.

import express from "express";

import { protect, requireRole } from "../middleware/auth.js";
import {
  listMyCourses,
  getCourseDetail,
  createNewCourse,
  editCourse,
  publishCourse,
  unpublishCourse,
  removeCourse,
  getProfile,
  updateProfile,
  changePassword,
} from "../controller/lecturerController.js";

const router = express.Router();

router.use(protect, requireRole("Lecturer"));

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Password change (inside settings page)
router.put("/settings/password", changePassword);

// VIEW ALL — separate action, just reads the lecturer's own course list
router.get("/courses", listMyCourses);

// VIEW ONE — separate action, full detail + enrolled students + ratings
router.get("/courses/:id", getCourseDetail);

// CREATE — separate action, makes a new draft course (status = Inactive)
router.post("/courses", createNewCourse);

// UPDATE — separate action, edits an existing course's fields
router.put("/courses/:id", editCourse);

// PUBLISH / UNPUBLISH — separate actions from update, since this is a

router.put("/courses/:id/publish", publishCourse);
router.put("/courses/:id/publish-request", publishCourse);
// UNPUBLISH — Changes status state from Active back into an Inactive/Hidden tier
router.put("/courses/:id/unpublish", unpublishCourse);

// DELETE — separate, deliberate, irreversible action
router.delete("/courses/:id", removeCourse);

export default router;
