import express from 'express'
import { Router} from 'express'
import authenticateToken  from '../middleware/Authen.js';
import { getAllCourses, getCourseById, getVideoData, getAllCoursesForStudent } from '../controller/courseController.js';
import { createEnrollment, updateEnrollmentStatus, updateEnrollmentProgress } from '../controller/enrollmentController.js';
const courseRouter = Router();

// courseRouter.get('/', getAllCourses);
courseRouter.get('/', getAllCourses);
courseRouter.get('/user', authenticateToken, getAllCoursesForStudent);
courseRouter.get('/:id/video', getVideoData);
courseRouter.get('/:id', getCourseById);
courseRouter.post('/:id/enroll', createEnrollment);
courseRouter.patch( "/:id/update", updateEnrollmentStatus)
courseRouter.patch( "/:id/progress", updateEnrollmentProgress);
export default courseRouter;
