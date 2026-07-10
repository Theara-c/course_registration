// controller/adminController.js
import {
  getAllUsers,
  getUserById,
  deleteUser,
  getPendingLecturers,
  setLecturerStatus,
  logActivity,
  getAllCourses,
  setCourseStatus,
  deleteCourse,
  getStats,
  getRecentActivity,
} from "../repo/adminRepository.js";

// GET /api/admin/stats
export async function getDashboardStats(req, res) {
  try {
    const stats = await getStats();
    return res.json(stats);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch stats" });
  }
}

// GET /api/admin/activity
export async function getActivity(req, res) {
  try {
    const logs = await getRecentActivity();
    return res.json(logs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch activity" });
  }
}

// GET /api/admin/users?role=&search=
export async function listUsers(req, res) {
  try {
    const users = await getAllUsers({
      role: req.query.role,
      search: req.query.search,
    });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch users" });
  }
}

// GET /api/admin/users/:id
export async function getUser(req, res) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch user" });
  }
}

// GET /api/admin/lecturers/pending
export async function listPendingLecturers(req, res) {
  try {
    const lecturers = await getPendingLecturers();
    return res.json(lecturers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch pending lecturers" });
  }
}

// PUT /api/admin/lecturers/:id/approve
export async function approveLecturer(req, res) {
  try {
    const ok = await setLecturerStatus(req.params.id, "Approved");
    if (!ok) {
      return res.status(404).json({ error: "Pending lecturer not found" });
    }
    await logActivity(
      req.user?.user_id,
      "Approved lecturer",
      "User",
      req.params.id,
    );
    return res.json({
      message: "Lecturer account approved. They can now log in.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to approve lecturer" });
  }
}

// PUT /api/admin/lecturers/:id/reject
export async function rejectLecturer(req, res) {
  try {
    const ok = await setLecturerStatus(req.params.id, "Rejected");
    if (!ok) {
      return res.status(404).json({ error: "Pending lecturer not found" });
    }
    await logActivity(
      req.user?.user_id,
      "Rejected lecturer",
      "User",
      req.params.id,
    );
    return res.json({ message: "Lecturer request rejected." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to reject lecturer" });
  }
}

// DELETE /api/admin/users/:id
export async function removeUser(req, res) {
  try {
    await deleteUser(req.params.id);
    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to delete user" });
  }
}

// GET /api/admin/courses?status=&search=
export async function listCourses(req, res) {
  try {
    const courses = await getAllCourses({
      status: req.query.status,
      search: req.query.search,
    });
    return res.json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch courses" });
  }
}

// PUT /api/admin/courses/:id/status  body: { status: 'Active' | 'Inactive' }
export async function updateCourseStatus(req, res) {
  try {
    const { status } = req.body;
    if (!["Active", "Inactive"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Status must be Active or Inactive" });
    }
    await setCourseStatus(req.params.id, status);
    return res.json({ message: `Course set to ${status}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to update course status" });
  }
}

// PUT /api/admin/courses/:id/review  body: { approved: true | false }
// ── Diagram Step: Processes the [Approved = true / false] conditional logic ──
export async function handleCourseReview(req, res) {
  try {
    const courseId = req.params.id;
    const { approved } = req.body; // Expects a boolean: true or false

    if (approved) {
      // ── Diagram Step: [Approved = true] ──
      // Course status transitions to Active, making it visible to students
      await setCourseStatus(courseId, "Active");
      return res.json({
        message: "Course approved! It is now active and visible to students.",
        status: "Active",
      });
    } else {
      // ── Diagram Step: [Approved = false] ──
      // Rejects the course request, flipping status back to Inactive for revisions
      await setCourseStatus(courseId, "Inactive");
      return res.json({
        message: "Course rejected. Sent back to the lecturer for revisions.",
        status: "Inactive",
      });
    }
  } catch (err) {
    console.error("❌ Error during Admin review execution:", err);
    return res.status(500).json({ error: "Unable to process course review" });
  }
}

// DELETE /api/admin/courses/:id
export async function removeCourse(req, res) {
  try {
    await deleteCourse(req.params.id);
    return res.json({ message: "Course deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to delete course" });
  }
}
