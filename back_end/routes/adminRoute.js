import express, { Router } from "express";
import authen from "../middleware/Authen.js"
import { authorizeRole } from "../middleware/authRole.js";
import { createLecturerAccount, getAdminDashboard, getUserManagement, updateCourseStatus, getUserActivity } from '../controller/adminController.js';
const adminRouter = Router();

adminRouter.get("/",  async ( req, res) => {
 res.json({ msg: "Admin route is working" }); })
adminRouter.post("/create",authen, authorizeRole("admin"), createLecturerAccount);
adminRouter.get("/dashboard",authen, authorizeRole('admin'), getAdminDashboard)
adminRouter.patch('/dashboard/update', authen, authorizeRole('admin'), updateCourseStatus);
adminRouter.get('/dashboard/users', authen, authorizeRole('admin'), getUserManagement);
adminRouter.get('/dashboard/activity', authen, authorizeRole('admin'), getUserActivity);



export default adminRouter;