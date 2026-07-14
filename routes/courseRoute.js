import express from 'express'
import { Router} from 'express'
import { getAllCourses, getCourseById, getVideoData } from '../controller/courseController.js';
import { createEnrollment, updateEnrollmentStatus, updateEnrollmentProgress } from '../controller/enrollmentController.js';
const courseRouter = Router();

courseRouter.get('/', getAllCourses);
courseRouter.get('/:id/private', getAllCourses);
courseRouter.get('/:id/video', getVideoData);
courseRouter.get('/:id', getCourseById);
courseRouter.post('/:id/enroll', createEnrollment);
courseRouter.patch( "/:id/update", updateEnrollmentStatus)
courseRouter.patch( "/:id/progress", updateEnrollmentProgress);
export default courseRouter;
