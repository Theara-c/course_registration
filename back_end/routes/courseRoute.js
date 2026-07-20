import express from 'express'
import { Router} from 'express'
import authenticateToken  from '../middleware/Authen.js';
import { getAllCourses, getCourseById, getVideoData, getAllCoursesForStudent, getCourseByIdForStudent, 
    getCourseByIdData, updateCourse
 } from '../controller/courseController.js';
import { createEnrollment, updateEnrollmentStatus, updateEnrollmentProgress } from '../controller/enrollmentController.js';
import { authorizeRole } from '../middleware/authRole.js';
const courseRouter = Router();

// courseRouter.get('/', getAllCourses);
courseRouter.get('/', getAllCourses);
courseRouter.get('/user', authenticateToken, getAllCoursesForStudent);
courseRouter.get('/:id/video', getVideoData);
courseRouter.get('/:id', getCourseById);
courseRouter.get('/:id/load', getCourseByIdData);
courseRouter.patch(`/:id/edit`, authenticateToken, authorizeRole('lecturer'), updateCourse)

courseRouter.get('/:id/student', authenticateToken, getCourseByIdForStudent);
courseRouter.post('/:id/enroll', createEnrollment);
courseRouter.patch( "/:id/update", updateEnrollmentStatus)
courseRouter.patch( "/:id/progress", updateEnrollmentProgress);
export default courseRouter;
