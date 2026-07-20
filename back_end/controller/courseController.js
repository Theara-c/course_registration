// import * as courseModel from "../models/Course.js";
import User from "../models/User.js";
import { Course, Category, Enrollment, Rating } from "../models/relationship.js";
import { sequelize } from "../database/db.js";
import { Op, fn, col } from "sequelize";

import { QueryTypes } from 'sequelize';
import * as courseService from "../service/courseService.js";
import * as Action from '../service/activityService.js'


export async function getAllCourses(req, res) {
  try {
    let { category, page = 1, limit = 12, search } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    let offset = (page - 1) * limit;
    let total = await courseService.getNumberOfCourses( category, search, null);
    // total = Math.ceil(total / limit);
    const courses = await courseService.getAllCourse(category, page, limit, search, offset);
    res.json({
      page: page,
      limit: 12,
      totalCourse: total,
      totalPages: Math.ceil(total/limit),
      course: courses
    });
  } catch (error) {
    console.error("Error fetching courses with raw SQL:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export async function getAllCoursesForStudent( req, res) {
   try {
    let { category, page =1, limit = 12, search}   = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    let offset = (page - 1) * limit;
    const id = req.user.user_id;
    let total = await courseService.getNumberOfCourses(category, search, id);
    const courses = await courseService.getCourseForStudent(id, category, page, limit, search, offset);
  res.json({
    totalCourse: total,
    totalPages: Math.ceil(total/limit),
    course: courses
  });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
}


export async function getCourseById(req, res) {
  let id = null;
  try {
    //courses/:id
    id = parseInt(req.params.id);
    const course = await courseService.getCourseById(id, 'active');
    res.json({
      course: course
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      message: "Cannot fetch course",
      courseId: id,
      error: error.message,
    });
  }
}
export async function getCourseByIdData(req, res) {
  let id = null;
  try {
    //courses/:id
    id = parseInt(req.params.id);
    const course = await courseService.getCourseById(id, 'reject');
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      message: "Cannot fetch course",
      courseId: id,
      error: error.message,
    });
  }
}

export async function getCourseByIdForStudent(req, res) {
  let id = null;
  try {
    const { user_id} = req.user;
    id = parseInt(req.params.id);

    const check = await courseService.checkExistingEnrollment(user_id, id)
    
    const course = await courseService.getCourseById(id, 'active');
    res.json({
      isEnroll: check,
      course: course
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      message: "Cannot fetch course",
      courseId: id,
      error: error.message,
    });
  }
}

export async function getVideoData( req, res) {

  try {
    const { id } = req.params;
    const { user_id } = req.query;
    const course = await courseService.getCourseByIdAndUserId(id, user_id);
    res.json(course);

  } catch (error) {
    console.error("Error fetching video data:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export async function updateCourse( req, res ) {

  try {
    const { id} = req.params;
    const user = req.user;
    const { title, duration, description, 
      sub_description, category_id, price, video_id} = req.body;
    
    const update = await courseService.updateCourseData({ title, duration, description, 
      sub_description, category_id, price, video_id}, id );
      Action.userAction(user.user_id, 'Update', 'Course', id);
      res.json({
        msg: "Update Successfully"
      })

  } catch (error) {
    console.error('Error update course field', error)
    res.status(500).json({msg: "Server error"})
  }
} 
