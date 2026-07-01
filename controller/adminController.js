// controller/adminController.js
import {
  getAllUsers,
  getUserById,
  deleteUser,
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
