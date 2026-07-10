import * as courseRepo from "../repo/courseRepository.js";

// ── LECTURER WORKFLOW ──

// Handle course creation submission
export const handleCreateCourse = async (req, res) => {
  try {
    const userId = req.user.user_id; // Extracted by your auth middleware
    const {
      title,
      description,
      sub_description,
      category,
      videoURL,
      duration,
    } = req.body;

    // 1. Diagram Step: Validate form
    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ error: "Missing required fields. Form validation failed." });
    }

    // 2. Diagram Step: [form valid] -> Insert into DB as 'Pending'
    const courseId = await courseRepo.createCourse(userId, {
      title,
      description,
      sub_description,
      category,
      videoURL,
      duration,
    });

    // 3. Diagram Step: Notify Admin
    // If you have a notification system/table, execute it here.

    return res.status(201).json({
      message: "Form validated successfully. Awaiting Admin confirmation.",
      course_id: courseId,
      status: "Pending",
    });
  } catch (error) {
    console.error("❌ Error during course creation sequence:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Fetch individual course details for the dashboard
export const handleGetCourseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseRepo.getCourseById(id);

    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    const students = await courseRepo.getEnrolledStudents(id);
    const ratings = await courseRepo.getCourseRatings(id);

    return res.status(200).json({ course, students, ratings });
  } catch (error) {
    console.error("❌ Error fetching course details:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve course metrics." });
  }
};

// ── ADMIN WORKFLOW ──

// Handle the approval/rejection loop
export const handleAdminReview = async (req, res) => {
  try {
    const { id } = req.params; // course_id
    const { approved } = req.body; // Expects a boolean: true or false

    const course = await courseRepo.getCourseById(id);
    if (!course) {
      return res.status(404).json({ error: "Target course record not found." });
    }

    if (approved) {
      // Diagram Step: [Approved = true] -> Change status to Active (Publishes it)
      await courseRepo.adminUpdateCourseStatus(id, "Active");
      return res.status(200).json({
        message: "Course approved! It is now published and live for students.",
        status: "Active",
      });
    } else {
      // Diagram Step: [Approved = false] -> Send feedback / set to Inactive
      await courseRepo.adminUpdateCourseStatus(id, "Inactive");
      return res.status(200).json({
        message: "Course rejected. Feedback message returned to Lecturer.",
        status: "Inactive",
      });
    }
  } catch (error) {
    console.error("❌ Error during Admin evaluation logic:", error);
    return res
      .status(500)
      .json({ error: "Internal server error processing review." });
  }
};
