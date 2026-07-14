import * as courseModel from "../models/Course.js";

export async function getAllCourses(req, res) {
  try {
    let { category, page =1, limit = 12, search}   = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    let offset = (page - 1) * limit;
    const {id} = req.params;
    
    const courses = await courseModel.getCourses(limit, offset, category, search, id);
    const totalCourses = await courseModel.getNumberOfCourses(category, search);
    res.json({
        page: page,
        limit: limit,
        totalCourses: totalCourses,
        totalPages: Math.ceil(totalCourses / limit),
        courses: courses
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export async function getCourseById(req, res) {
  let id = null;
  try {
    id = parseInt(req.params.id);
    const course = await courseModel.getCourseById(id);
    
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
export async function getVideoData( req, res) {

  try {
    const { id } = req.params;
    const { user_id } = req.query;
    const course = await courseModel.getCourseByIdAndUserId(id, user_id);
    res.json(course);

  } catch (error) {
    console.error("Error fetching video data:", error);
    res.status(500).json({ message: "Server error" });
  }
}
