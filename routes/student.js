// routes/student.js
import express from "express";
import { protect, requireRole } from "../middleware/auth.js";
import {
  browseCourses,
  getCourse,
  getDashboard,
  enroll,
  rateEnrollment,
  markWatched,
  markComplete,
} from "../controller/studentController.js";

const router = express.Router();

// Public — browsing courses doesn't need login
router.get("/courses", browseCourses);

// Optionally authenticated — course detail shows enrollment status if logged in
router.get(
  "/courses/:id",
  (req, res, next) => {
    // Try to read token if present, but don't block if missing
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        import("jsonwebtoken")
          .then(({ default: jwt }) => {
            req.user = jwt.verify(
              authHeader.split(" ")[1],
              process.env.JWT_SECRET,
            );
            next();
          })
          .catch(() => next());
      } catch {
        next();
      }
    } else {
      next();
    }
  },
  getCourse,
);

// Protected — requires login + Student role
router.use(protect, requireRole("Student"));
router.get("/dashboard", getDashboard);
router.post("/courses/:id/enroll", enroll);
router.post("/enrollments/:enrollmentId/rating", rateEnrollment);
router.put("/enrollments/:enrollmentId/watch", markWatched);
router.put("/enrollments/:enrollmentId/complete", markComplete);

export default router;
