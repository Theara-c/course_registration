import express, { Route} from 'express'
import { getUserInfo } from '../controller/enrollmentController.js';
import authen from '../middleware/Authen.js';
import { authorizeRole } from "../middleware/authRole.js";
const studentRoute = express.Router();


studentRoute.get("/dashboard",authen, authorizeRole('student'), getUserInfo);
export default studentRoute;