// pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API = "http://localhost:8000/api/admin";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

// ── Small stat card ──
function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg ${color}`}
      >
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── Tabs ──
const TABS = ["Dashboard", "Users", "Courses", "Activity"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Dashboard");

  // Dashboard stats
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);

  // Users
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRole, setUserRole] = useState("");

  // Courses
  const [courses, setCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [courseStatus, setCourseStatus] = useState("");

  const [loading, setLoading] = useState(false);

  // ── Get logged-in admin name from localStorage ──
  const adminUser = JSON.parse(localStorage.getItem("user") || "{}");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  // ── Load stats on mount ──
  useEffect(() => {
    axios
      .get(`${API}/stats`, authHeaders())
      .then((r) => setStats(r.data))
      .catch(console.error);
    axios
      .get(`${API}/activity`, authHeaders())
      .then((r) => setActivity(r.data))
      .catch(console.error);
  }, []);

  // ── Load users when Users tab active or filters change ──
  useEffect(() => {
    if (tab !== "Users") return;

    // Fixed warning: Extracted state operations cleanly into an internal executor block
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/users`, {
          ...authHeaders(),
          params: { role: userRole, search: userSearch },
        });
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [tab, userRole, userSearch]);

  // ── Load courses when Courses tab active or filters change ──
  useEffect(() => {
    if (tab !== "Courses") return;

    // Fixed warning: Extracted state operations cleanly into an internal executor block
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/courses`, {
          ...authHeaders(),
          params: { status: courseStatus, search: courseSearch },
        });
        setCourses(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [tab, courseStatus, courseSearch]);

  async function handleDeleteUser(userId, name) {
    if (!confirm(`Delete user "${name}" permanently?`)) return;
    try {
      await axios.delete(`${API}/users/${userId}`, authHeaders());
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u.user_id !== userId));
    } catch {
      toast.error("Failed to delete user");
    }
  }

  async function handleCourseStatus(courseId, status) {
    try {
      await axios.put(
        `${API}/courses/${courseId}/status`,
        { status },
        authHeaders(),
      );
      toast.success(`Course set to ${status}`);
      setCourses((prev) =>
        prev.map((c) => (c.course_id === courseId ? { ...c, status } : c)),
      );
    } catch {
      toast.error("Failed to update course");
    }
  }

  async function handleDeleteCourse(courseId, title) {
    if (!confirm(`Delete course "${title}" permanently?`)) return;
    try {
      await axios.delete(`${API}/courses/${courseId}`, authHeaders());
      toast.success("Course deleted");
      setCourses((prev) => prev.filter((c) => c.course_id !== courseId));
    } catch {
      toast.error("Failed to delete course");
    }
  }

  const roleBadge = {
    Student: "bg-blue-100 text-blue-700",
    Lecturer: "bg-purple-100 text-purple-700",
    Administrator: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top nav ── */}
      <div className="bg-[#142175] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-graduation-cap text-white"></i>
          </div>
          <span className="text-white font-bold text-lg">EduFlow Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/80 text-sm">
            {adminUser.full_name || "Administrator"}
          </span>
          <button
            onClick={logout}
            className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg transition"
          >
            <i className="fa-solid fa-right-from-bracket mr-1"></i> Logout
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="bg-white border-b px-8">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-4 text-sm font-medium border-b-2 transition ${tab === t ? "border-[#142175] text-[#142175]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* ── DASHBOARD TAB ── */}
        {tab === "Dashboard" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Overview</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Users"
                value={stats?.total_users}
                icon="fa-users"
                color="bg-[#142175]"
              />
              <StatCard
                label="Students"
                value={stats?.total_students}
                icon="fa-user-graduate"
                color="bg-teal-500"
              />
              <StatCard
                label="Lecturers"
                value={stats?.total_lecturers}
                icon="fa-chalkboard-teacher"
                color="bg-purple-500"
              />
              <StatCard
                label="Total Courses"
                value={stats?.total_courses}
                icon="fa-book-open"
                color="bg-orange-500"
              />
              <StatCard
                label="Active Courses"
                value={stats?.active_courses}
                icon="fa-circle-check"
                color="bg-green-500"
              />
              <StatCard
                label="Total Enrollments"
                value={stats?.total_enrollments}
                icon="fa-user-plus"
                color="bg-blue-500"
              />
              <StatCard
                label="Completed"
                value={stats?.completed_enrollments}
                icon="fa-trophy"
                color="bg-yellow-500"
              />
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Recent Activity
            </h2>
            <div className="bg-white rounded-xl shadow-sm border divide-y">
              {activity.length === 0 ? (
                <p className="p-6 text-gray-500 text-sm">No recent activity.</p>
              ) : (
                activity.map((log) => (
                  <div
                    key={log.log_id}
                    className="flex items-center gap-4 px-5 py-3 text-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#142175]/10 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-bolt text-[#142175] text-xs"></i>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">
                        {log.full_name || "Unknown"}
                      </span>
                      <span className="text-gray-500"> — {log.action}</span>
                      {log.target_type && (
                        <span className="text-gray-400">
                          {" "}
                          ({log.target_type} #{log.target_id})
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === "Users" && (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex-1">
                Manage Users
              </h1>
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search name or email..."
                className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#142175] w-64"
              />
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#142175]"
              >
                <option value="">All Roles</option>
                <option value="Student">Student</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="px-5 py-3 text-left">Name</th>
                      <th className="px-5 py-3 text-left">Email</th>
                      <th className="px-5 py-3 text-left">Role</th>
                      <th className="px-5 py-3 text-left">Gender</th>
                      <th className="px-5 py-3 text-left">Last Login</th>
                      <th className="px-5 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((u) => (
                      <tr key={u.user_id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-800">
                          {u.full_name}
                        </td>
                        <td className="px-5 py-3 text-gray-500">{u.email}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadge[u.user_role] || "bg-gray-100 text-gray-600"}`}
                          >
                            {u.user_role}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 capitalize">
                          {u.gender || "—"}
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">
                          {u.last_login
                            ? new Date(u.last_login).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() =>
                              handleDeleteUser(u.user_id, u.full_name)
                            }
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            <i className="fa-solid fa-trash mr-1"></i>Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <p className="p-6 text-center text-gray-500">
                    No users found.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── COURSES TAB ── */}
        {tab === "Courses" && (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex-1">
                Manage Courses
              </h1>
              <input
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Search course title..."
                className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#142175] w-64"
              />
              <select
                value={courseStatus}
                onChange={(e) => setCourseStatus(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#142175]"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="px-5 py-3 text-left">Title</th>
                      <th className="px-5 py-3 text-left">Category</th>
                      <th className="px-5 py-3 text-left">Instructor</th>
                      <th className="px-5 py-3 text-left">Enrolled</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {courses.map((c) => (
                      <tr key={c.course_id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-800 max-w-[200px] truncate">
                          {c.title}
                        </td>
                        <td className="px-5 py-3 text-gray-500">
                          {c.category}
                        </td>
                        <td className="px-5 py-3 text-gray-500">
                          {c.instructor_name}
                        </td>
                        <td className="px-5 py-3 text-gray-500">
                          {c.enrolled_count}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 flex items-center gap-3">
                          {c.status === "Active" ? (
                            <button
                              onClick={() =>
                                handleCourseStatus(c.course_id, "Inactive")
                              }
                              className="text-yellow-600 hover:text-yellow-800 text-xs font-medium"
                            >
                              <i className="fa-solid fa-eye-slash mr-1"></i>
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleCourseStatus(c.course_id, "Active")
                              }
                              className="text-green-600 hover:text-green-800 text-xs font-medium"
                            >
                              <i className="fa-solid fa-eye mr-1"></i>Activate
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleDeleteCourse(c.course_id, c.title)
                            }
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            <i className="fa-solid fa-trash mr-1"></i>Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {courses.length === 0 && (
                  <p className="p-6 text-center text-gray-500">
                    No courses found.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ACTIVITY TAB ── */}
        {tab === "Activity" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Activity Log
            </h1>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 text-left">User</th>
                    <th className="px-5 py-3 text-left">Action</th>
                    <th className="px-5 py-3 text-left">Target</th>
                    <th className="px-5 py-3 text-left">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {activity.map((log) => (
                    <tr key={log.log_id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">
                        {log.full_name || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-mono">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {log.target_type} #{log.target_id}
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {activity.length === 0 && (
                <p className="p-6 text-center text-gray-500">
                  No activity yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
