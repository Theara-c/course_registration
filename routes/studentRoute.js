import express, { Route} from 'express'
import { getUserInfo } from '../controller/enrollmentController.js';
const studentRoute = express.Router();


studentRoute.get("/:id/dashboard", getUserInfo);
export default studentRoute;