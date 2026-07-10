// pages/AdminDashboard.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API = "http://localhost:8000/api/admin";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

// ── Extraction helper utility for robust video handling ──
function getYouTubeId(url) {
  if (!url) return null;
  // Match standard watch links, embed links, and shortened share links
  //  CORRECT (unescaped query characters)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
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
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingLecturers, setPendingLecturers] = useState([]);
  // Video Preview Modal State
  const [previewCourse, setPreviewCourse] = useState(null);

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

  // ── Unified operational data fetch block ──
  const loadDashboardOverview = useCallback(() => {
    axios
      .get(`${API}/stats`, authHeaders())
      .then((r) => setStats(r.data))
      .catch(console.error);
    axios
      .get(`${API}/activity`, authHeaders())
      .then((r) => setActivity(r.data))
      .catch(console.error);
    axios
      .get(`${API}/courses`, {
        ...authHeaders(),
        params: { status: "Pending" },
      })
      .then((r) => setPendingCourses(r.data))
      .catch(console.error);
    axios
      .get(`${API}/lecturers/pending`, authHeaders())
      .then((r) => setPendingLecturers(r.data))
      .catch(console.error);
  }, []);
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

    // Fetch courses with "Pending" status for the main alert desk queue
    axios
      .get(`${API}/courses`, {
        ...authHeaders(),
        params: { status: "Pending" },
      })
      .then((r) => setPendingCourses(r.data))
      .catch(console.error);
  }, []);
  // ── Load stats once on mount or when dashboard actions prompt refresh ──
  useEffect(() => {
    loadDashboardOverview();
  }, [loadDashboardOverview]);

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

  async function handleApproveLecturer(userId, name) {
    try {
      await axios.put(`${API}/lecturers/${userId}/approve`, {}, authHeaders());
      toast.success(`${name} is now an approved Lecturer 🎉`);
      setPendingLecturers((prev) => prev.filter((l) => l.user_id !== userId));
      loadDashboardOverview();
    } catch {
      toast.error("Failed to approve lecturer");
    }
  }

  async function handleRejectLecturer(userId, name) {
    if (!confirm(`Reject the lecturer request from "${name}"?`)) return;
    try {
      await axios.put(`${API}/lecturers/${userId}/reject`, {}, authHeaders());
      toast.info(`${name}'s lecturer request was rejected.`);
      setPendingLecturers((prev) => prev.filter((l) => l.user_id !== userId));
    } catch {
      toast.error("Failed to reject lecturer");
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
      setPendingCourses((prev) => prev.filter((c) => c.course_id !== courseId));

      // Refresh overall counter stats safely
      loadDashboardOverview();

      if (previewCourse?.course_id === courseId) setPreviewCourse(null);
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

      setPendingCourses((prev) => prev.filter((c) => c.course_id !== courseId));

      loadDashboardOverview();

      if (previewCourse?.course_id === courseId) setPreviewCourse(null);
    } catch {
      toast.error("Failed to delete course");
    }
  }

  const roleBadge = {
    Student: "bg-blue-100 text-blue-700",
    Lecturer: "bg-purple-100 text-purple-700",
    Administrator: "bg-red-100 text-red-700",
  };

  // Safe runtime execution assignment for active target checks
  const youtubeId = previewCourse
    ? previewCourse.video_id ||
      getYouTubeId(previewCourse.video_url || previewCourse.video)
    : null;

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

            {/* Split Arena Grid Structure layout section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT SIDE: Active Action Notification Requests items */}
              <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-bell-exclamation text-amber-500"></i>
                    <h2 className="text-base font-bold text-gray-800">
                      Pending Approvals & Verification
                    </h2>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {pendingCourses.length} pending
                  </span>
                </div>

                {pendingCourses.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm italic">
                    <i className="fa-solid fa-circle-check text-2xl text-gray-200 block mb-2"></i>
                    All caught up! No course review requests waiting.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingCourses.map((c) => (
                      <div
                        key={c.course_id}
                        className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                            {c.category || "General"}
                          </span>
                          <h3 className="text-sm font-semibold text-gray-800 mt-1 line-clamp-1">
                            {c.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            By Lecturer:{" "}
                            <span className="font-medium text-gray-700">
                              {c.instructor_name}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => setPreviewCourse(c)}
                            className="px-3 py-1.5 bg-white border rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-1.5 transition"
                          >
                            <i className="fa-solid fa-video text-gray-400"></i>{" "}
                            Review Video
                          </button>
                          <button
                            onClick={() =>
                              handleCourseStatus(c.course_id, "Active")
                            }
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-sm transition"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LEFT SIDE (cont.): Lecturer Account Approval Queue */}
              <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-chalkboard-teacher text-purple-500"></i>
                    <h2 className="text-base font-bold text-gray-800">
                      Lecturer Signup Requests
                    </h2>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {pendingLecturers.length} pending
                  </span>
                </div>

                {pendingLecturers.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm italic">
                    <i className="fa-solid fa-circle-check text-2xl text-gray-200 block mb-2"></i>
                    No lecturer accounts waiting for confirmation.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingLecturers.map((l) => (
                      <div
                        key={l.user_id}
                        className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            {l.full_name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800">
                              {l.full_name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {l.email}
                              {l.specialization ? ` · ${l.specialization}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() =>
                              handleRejectLecturer(l.user_id, l.full_name)
                            }
                            className="px-3 py-1.5 bg-white border rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 shadow-sm transition"
                          >
                            <i className="fa-solid fa-xmark mr-1"></i>
                            Reject
                          </button>
                          <button
                            onClick={() =>
                              handleApproveLecturer(l.user_id, l.full_name)
                            }
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg shadow-sm transition"
                          >
                            <i className="fa-solid fa-check mr-1"></i>
                            Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* RIGHT SIDE: System Action Event Logs stream stream */}
              <div className="bg-white rounded-xl border shadow-sm p-6 h-fit">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                  <i className="fa-solid fa-bolt text-indigo-500"></i>
                  <h2 className="text-lg font-bold text-gray-800">
                    Recent Activity
                  </h2>
                </div>
                <div className="bg-white rounded-xl shadow-sm border divide-y">
                  {activity.length === 0 ? (
                    <p className="p-6 text-gray-500 text-sm">No items found.</p>
                  ) : (
                    activity.slice(0, 10).map((log) => (
                      <div
                        key={log.log_id}
                        className="py-3 text-xs first:pt-0 last:pb-0"
                      >
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {log.full_name || "System"}
                          </strong>{" "}
                          — {log.action}
                          {log.target_type && (
                            <span className="text-gray-400">
                              {" "}
                              ({log.target_type} #{log.target_id})
                            </span>
                          )}
                        </p>
                        <span className="text-[10px] text-gray-400 block mt-1">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
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
                <option value="Pending">Pending</option>
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
                      <th className="px-5 py-3 text-left">Lecturer</th>
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
                            className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === "Active" ? "bg-green-100 text-green-700" : c.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}
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
      {/* ── INTERACTIVE VIDEO INSPECTION MODAL WINDOW SYSTEM ── */}
      {previewCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header section */}
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <div>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded tracking-wide uppercase">
                  {previewCourse.category || "Verification Required"}
                </span>
                <h3 className="text-base font-bold text-gray-800 mt-0.5">
                  {previewCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewCourse(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Video Box Area */}
            <div className="p-6 space-y-4">
              {youtubeId ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner border">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="Course Submission Material"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl bg-slate-100 border border-dashed flex flex-col items-center justify-center text-gray-400 text-sm text-center px-6">
                  <i className="fa-solid fa-video-slash text-3xl mb-2 text-gray-300"></i>
                  No introduction video attached to this submission packet.
                  <span className="text-xs text-gray-400 mt-1">
                    This course can't be approved until the lecturer adds one.
                  </span>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  About Course content
                </h4>
                <p className="text-sm text-gray-600 bg-slate-50 border p-3 rounded-lg leading-relaxed max-h-32 overflow-y-auto">
                  {previewCourse.description ||
                    "No specific detailed description content supplied for this record item entry."}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Submitted by Lecturer:{" "}
                  <strong className="text-gray-600">
                    {previewCourse.instructor_name}
                  </strong>
                </p>
              </div>
            </div>

            {/* Footer actions block */}
            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end gap-2">
              <button
                onClick={() => setPreviewCourse(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleDeleteCourse(
                    previewCourse.course_id,
                    previewCourse.title,
                  )
                }
                className="px-4 py-2 text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Reject / Delete
              </button>
              <button
                onClick={() =>
                  handleCourseStatus(previewCourse.course_id, "Active")
                }
                className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm transition"
              >
                Approve & Publish Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
