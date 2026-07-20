import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { generateAccessToken } from './userController.js'
import dotenv from "dotenv"
import * as User from '../service/userService.js'
import * as Course from "../service/courseService.js"
import * as Action from '../service/activityService.js'
dotenv.config();
export async function createLecturerAccount(req, res) {
  try {
    const { 
      email, 
      password, 
      full_name,
      specialization,
      telegram_link
    } = req.body;

    const user = await User.checkExistingUser(email);
    if (user) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUserId = await User.createLecturer(
      full_name,
      email, 
      passwordHash, 
      specialization, 
      telegram_link
    );

    const payload = {
      user_id: newUserId,
      role: "lecturer",
      email: email
    };

    const token = generateAccessToken(payload);

    return res.status(201).json({ 
      create: "success",
      accessToken: token,
      user: {
        user_id: newUserId,
        role: "lecturer",
        email: email
      }
    });

  } catch (error) {
    console.error("Error creating lecturer account:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function getAdminDashboard(req, res) {
    try {

        const { category } = req.query;

        const total = await User.getDashboardStatistics();

        const courses = await User.getPendingCourses(category);
        res.json({
            total,
            courses
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}
export async function updateCourseStatus (req, res) {
  try {
    const { status, course_id} = req.body;
    const { user_id} = req.user.user_id;
    const result = await Course.updateStatus( course_id, status);
      Action.userAction(user_id,`Update Status ${status}`, "Course", course_id )

    res.json( {
      msg: "Update Successfully"
    })
  } catch (error) {
    console.error(error);
        res.status(500).json({
            message: "Server Error"
        });
  }
}
export async function getUserManagement(req, res) {

    try {

        let { role = "All", page = 1 } = req.query;

        page = parseInt(page) || 1;

        const limit = 40;

        const users = await User.getUsers(
            role,
            page,
            limit
        );

        const totalUsers = await User.getTotalUsers(role);

        const statistics = await User.getUserStatistics();

        res.json({

            statistics,

            users,

            page,

            limit,

            totalUsers,

            totalPages: Math.ceil(totalUsers / limit),

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });

    }

}
export async function getUserActivity (req,res) {

  try {
    const result = await Action.getUserActivityLog();
    res.json(result)


  } catch (error) {
      console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
  }
}
