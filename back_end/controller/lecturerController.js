import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "./userController.js";
import dotenv from "dotenv";
import * as User from "../service/userService.js";
import * as Course from "../service/courseService.js";
import * as Enrollment from "../service/enrollmentService.js";
import e from "express";
dotenv.config();

export async function createCourse(req, res) {
  try {
    const {
      title,
      description,
      sub_description,
      video_id,
      duration,
      price,
      category_id,
    } = req.body;
    const user_id = req.user.user_id;

    const newCourseId = await Course.createCourseRecord(
      title,
      description,
      sub_description,
      video_id,
      duration,
      price,
      category_id,
      user_id,
    );

    return res
      .status(201)
      .json({ message: "Course created successfully", course_id: newCourseId });
  } catch (error) {
    console.error("Error creating course:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
export async function getLecturerDashboard(req, res) {
  // res.json({ msg: "Lecturer dashboard route is working" });

  try {
    const user_id = req.user.user_id;
    // const user_id = parseInt(req.params.id);
    const courses = await Course.getCoursesByLecturer(user_id);
    const totalCourses = courses.length;
    return res.status(200).json({
      total: totalCourses,
      courses: courses,
    });
  } catch (error) {
    console.error("Error fetching lecturer dashboard:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

export async function getEnrollmentPage(req, res) {
  try {
    const { id } = req.params;
    let { status = "All", page = 1 } = req.query;
    page = parseInt(page);
    const limit = 20;
    const students = await Enrollment.getCourseEnrollment(
      id,
      status,
      page,
      limit,
    );
    const totalStudents = await Enrollment.getTotalStudents(id, status);
    const averageProgress = await Enrollment.getAverageProgress(id);
    res.json({
      totalStudents,
      averageProgress: averageProgress.averageProgress,
      price: averageProgress.price,
      students,
      page,
      limit,
      totalPages: Math.ceil(totalStudents / limit),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
}
export async function updateEnrollment(req, res) {
  try {
    const id = req.user.user_id;
    const { status, course_id, user_id } = req.body;
    const courses = await Enrollment.updateStatus(user_id, course_id, status);
    const totalCourses = courses.length;
    return res.status(200).json({
      msg: "Update enrollment status successfully",
    });
  } catch (error) {
    console.error("Error fetching lecturer dashboard:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
// export async function updateCourse(req, res) {
//   try {
//     const {id} = req.params;
//     const { title, sub_description, description, duration, 
//         price, category_id
//     } = req.body;





//   } catch (error) {
//     console.error("Error fetching lecturer dashboard:", error);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// }
