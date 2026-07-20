import express, {Router} from 'express';
import { createCourse, getLecturerDashboard, getEnrollmentPage, updateEnrollment} from '../controller/lecturerController.js';
import authen from "../middleware/Authen.js"
import { authorizeRole } from "../middleware/authRole.js";
const lecturerRouter = Router();

lecturerRouter.get("/", async (req, res) => {
  res.json({ msg: "Lecturer route is working" });
});
lecturerRouter.post("/create", authen, authorizeRole('lecturer'), createCourse);
lecturerRouter.get("/dashboard", authen, authorizeRole('lecturer'), getLecturerDashboard );
lecturerRouter.get("/courses/:id", authen, authorizeRole('lecturer'), getEnrollmentPage);
lecturerRouter.patch('/courses/update', authen, authorizeRole('lecturer'), updateEnrollment)
// lecturerRouter.patch('/course/:id/update', authen, authorizeRole('lecturer', updateCourse))

export default lecturerRouter;