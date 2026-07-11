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

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-[#171B46] rounded-2xl border border-[#6C63FF]/20 p-5 flex items-center justify-between hover:shadow-lg hover:border-[#6C63FF]/40 transition-all duration-300 group">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
          {label}
        </p>
        <p className="text-3xl font-bold text-[#F8FAFC] tracking-tight">
          {value ?? "—"}
        </p>
      </div>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg shadow-sm bg-gradient-to-br ${color} transform group-hover:scale-110 transition-transform duration-300`}
      >
        <i className={`fa-solid ${icon}`}></i>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Dashboard");

  // Dashboard states
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingLecturers, setPendingLecturers] = useState([]);
  const [previewCourse, setPreviewCourse] = useState(null);

  // Users filter states
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRole, setUserRole] = useState("");

  // Courses filter states
  const [courses, setCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [courseStatus, setCourseStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const adminUser = JSON.parse(localStorage.getItem("user") || "{}");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

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

  useEffect(() => {
    loadDashboardOverview();
  }, [loadDashboardOverview]);

  useEffect(() => {
    if (tab !== "Users") return;
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

  useEffect(() => {
    if (tab !== "Courses") return;
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
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u.user_id !== userId));
    } catch {
      toast.error("Failed to delete user");
    }
  }

  async function handleApproveLecturer(userId, name) {
    try {
      await axios.put(`${API}/lecturers/${userId}/approve`, {}, authHeaders());
      toast.success(`${name} approved successfully!`);
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
      toast.info(`${name}'s request rejected.`);
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
      toast.success(`Course updated to ${status}`);
      setCourses((prev) =>
        prev.map((c) => (c.course_id === courseId ? { ...c, status } : c)),
      );
      setPendingCourses((prev) => prev.filter((c) => c.course_id !== courseId));
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
      toast.success("Course permanently deleted");
      setCourses((prev) => prev.filter((c) => c.course_id !== courseId));
      setPendingCourses((prev) => prev.filter((c) => c.course_id !== courseId));
      loadDashboardOverview();
      if (previewCourse?.course_id === courseId) setPreviewCourse(null);
    } catch {
      toast.error("Failed to delete course");
    }
  }

  const roleBadge = {
    Student: "bg-blue-950/60 text-blue-400 border border-blue-900/40",
    Lecturer: "bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/30",
    Administrator: "bg-rose-950/60 text-rose-400 border border-rose-900/40",
  };

  const youtubeId = previewCourse
    ? previewCourse.video_id ||
      getYouTubeId(previewCourse.video_url || previewCourse.video)
    : null;

  const NAV_ITEMS = [
    { tab: "Dashboard", icon: "fa-gauge-high" },
    { tab: "Users", icon: "fa-users", badge: pendingLecturers.length || null },
    {
      tab: "Courses",
      icon: "fa-book-open",
      badge: pendingCourses.length || null,
    },
    { tab: "Activity", icon: "fa-clock-rotate-left" },
  ];

  return (
    <div className="h-screen bg-[#080B24] flex overflow-hidden font-sans antialiased text-slate-300">
      {/* Sidebar Navigation */}
      <aside className="w-64 shrink-0 bg-[#0D1030] text-white flex flex-col z-10 border-r border-[#6C63FF]/20">
        <div className="h-20 px-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6C63FF] rounded-xl flex items-center justify-center shadow-lg shadow-[#6C63FF]/20">
            <i className="fa-solid fa-graduation-cap text-white text-lg"></i>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            EduFlow <span className="text-[#6C63FF] font-semibold">Admin</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.tab}
              onClick={() => setTab(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === item.tab
                  ? "bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/20"
                  : "text-[#94A3B8] hover:bg-[#6C63FF]/10 hover:text-slate-200"
              }`}
            >
              <i
                className={`fa-solid ${item.icon} w-5 text-center text-base`}
              ></i>
              <span className="flex-1 text-left">{item.tab}</span>
              {!!item.badge && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F59E0B] text-black min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 bg-[#080B24]/40">
          <div className="flex items-center gap-3 px-2 py-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C6FFF] to-[#6C63FF] flex items-center justify-center font-bold text-white shadow-md shrink-0">
              {(adminUser.full_name || "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {adminUser.full_name || "Ly Meng"}
              </p>
              <p className="text-xs text-[#94A3B8] font-medium">
                Platform Manager
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-[#6C63FF]/20 text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30 transition-all duration-200"
          >
            <i className="fa-solid fa-right-from-bracket text-xs"></i> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar header workspace */}
        <header className="h-20 bg-[#0D1030] border-b border-[#6C63FF]/20 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </span>
            <span className="text-[#6C63FF]/40">/</span>
            <span className="text-sm font-medium text-slate-200">{tab}</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        {/* Dynamic Inner Tab Component Space */}
        <main className="flex-1 overflow-y-auto p-8 focus:outline-none">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* ── OVERVIEW / DASHBOARD TAB AREA ── */}
            {tab === "Dashboard" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
                    System Performance
                  </h1>
                  <p className="text-sm text-[#94A3B8] mt-1">
                    Real-time status updates and metrics summary.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <StatCard
                    label="Total Platform Users"
                    value={stats?.total_users}
                    icon="fa-users"
                    color="from-[#6C63FF] to-[#7C6FFF]"
                  />
                  <StatCard
                    label="Active Students"
                    value={stats?.total_students}
                    icon="fa-user-graduate"
                    color="from-emerald-500 to-teal-600"
                  />
                  <StatCard
                    label="Verified Instructors"
                    value={stats?.total_lecturers}
                    icon="fa-chalkboard-teacher"
                    color="from-[#6C63FF] to-[#7C6FFF]"
                  />
                  <StatCard
                    label="Total Courses Available"
                    value={stats?.total_courses}
                    icon="fa-book-open"
                    color="from-orange-500 to-amber-600"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  {/* Left Column Stack for Approvals */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Course Pending Queue Card container */}
                    <div className="bg-[#171B46] rounded-2xl border border-[#6C63FF]/20 shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-[#6C63FF]/20 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-[#F59E0B]/20 text-[#F59E0B] rounded-lg border border-[#F59E0B]/30">
                            <i className="fa-solid fa-bell-exclamation"></i>
                          </div>
                          <h2 className="font-bold text-white">
                            Pending Course Approvals
                          </h2>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                          {pendingCourses.length} Review Requests
                        </span>
                      </div>

                      <div className="p-6">
                        {pendingCourses.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 text-sm">
                            <i className="fa-solid fa-circle-check text-3xl text-[#6C63FF]/40 block mb-2"></i>
                            Everything caught up! No courses require review.
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                            {pendingCourses.map((c) => (
                              <div
                                key={c.course_id}
                                className="p-4 rounded-xl border border-[#6C63FF]/20 bg-[#080B24]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#6C63FF]/40 transition-colors"
                              >
                                <div className="min-w-0">
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded border border-[#F59E0B]/30">
                                    {c.category || "General"}
                                  </span>
                                  <h3 className="text-sm font-semibold text-white mt-2 truncate">
                                    {c.title}
                                  </h3>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    Submitted by:{" "}
                                    <span className="font-medium text-slate-200">
                                      {c.instructor_name}
                                    </span>
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                  <button
                                    onClick={() => setPreviewCourse(c)}
                                    className="px-3 py-2 bg-[#6C63FF]/20 border border-[#6C63FF]/30 rounded-lg text-xs font-medium text-slate-200 hover:bg-[#6C63FF]/30 transition"
                                  >
                                    <i className="fa-solid fa-video mr-1.5 text-slate-400"></i>
                                    Review Video
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleCourseStatus(c.course_id, "Active")
                                    }
                                    className="px-3 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-medium rounded-lg shadow-sm transition"
                                  >
                                    Approve Publication
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lecturer verification approvals list container */}
                    <div className="bg-[#171B46] rounded-2xl border border-[#6C63FF]/20 shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-[#6C63FF]/20 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-[#6C63FF]/20 text-[#6C63FF] rounded-lg border border-[#6C63FF]/30">
                            <i className="fa-solid fa-chalkboard-teacher"></i>
                          </div>
                          <h2 className="font-bold text-white">
                            Lecturer Applications
                          </h2>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/30">
                          {pendingLecturers.length} Pending Actions
                        </span>
                      </div>

                      <div className="p-6">
                        {pendingLecturers.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 text-sm">
                            <i className="fa-solid fa-user-check text-3xl text-[#6C63FF]/40 block mb-2"></i>
                            No application workflows waiting verification.
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                            {pendingLecturers.map((l) => (
                              <div
                                key={l.user_id}
                                className="p-4 rounded-xl border border-[#6C63FF]/20 bg-[#080B24]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#6C63FF]/40 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/20 text-[#6C63FF] flex items-center justify-center font-bold text-sm shrink-0 border border-[#6C63FF]/30 shadow-sm">
                                    {l.full_name?.charAt(0)?.toUpperCase() ||
                                      "?"}
                                  </div>
                                  <div className="min-w-0">
                                    <h3 className="text-sm font-semibold text-white truncate">
                                      {l.full_name}
                                    </h3>
                                    <p className="text-xs text-slate-400 truncate">
                                      {l.email}{" "}
                                      {l.specialization
                                        ? ` · Specialty: ${l.specialization}`
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                  <button
                                    onClick={() =>
                                      handleRejectLecturer(
                                        l.user_id,
                                        l.full_name,
                                      )
                                    }
                                    className="px-3 py-2 bg-transparent border border-rose-900/40 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/20 transition"
                                  >
                                    Decline Request
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleApproveLecturer(
                                        l.user_id,
                                        l.full_name,
                                      )
                                    }
                                    className="px-3 py-2 bg-[#6C63FF] hover:bg-[#5a52d9] text-white text-xs font-medium rounded-lg shadow-sm transition"
                                  >
                                    Grant Access
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* System Activities Feed Frame right column stack */}
                  <div className="bg-[#171B46] rounded-2xl border border-[#6C63FF]/20 shadow-sm overflow-hidden h-fit">
                    <div className="px-6 py-5 border-b border-[#6C63FF]/20 flex items-center gap-2.5">
                      <div className="p-2 bg-[#6C63FF]/20 text-[#6C63FF] rounded-lg border border-[#6C63FF]/30">
                        <i className="fa-solid fa-bolt text-sm"></i>
                      </div>
                      <h2 className="font-bold text-white">Operations Log</h2>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4 max-h-[820px] overflow-y-auto pr-1">
                        {activity.length === 0 ? (
                          <p className="text-center py-6 text-slate-400 text-xs italic">
                            No operational logs recorded.
                          </p>
                        ) : (
                          activity.slice(0, 15).map((log) => (
                            <div
                              key={log.log_id}
                              className="text-xs pb-3 border-b border-[#6C63FF]/10 last:border-0 last:pb-0 space-y-1"
                            >
                              <p className="text-slate-300 leading-relaxed">
                                <span className="font-semibold text-white">
                                  {log.full_name || "System Automated"}
                                </span>{" "}
                                {log.action}
                                {log.target_type && (
                                  <span className="text-[#6C63FF] font-mono text-[10px] ml-1 bg-[#6C63FF]/20 px-1.5 py-0.5 rounded border border-[#6C63FF]/30">
                                    ({log.target_type} #{log.target_id})
                                  </span>
                                )}
                              </p>
                              <span className="text-[10px] text-slate-500 block font-medium">
                                {new Date(log.created_at).toLocaleString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── MANAGED USERS INTERACTIVE DATATABLE WORKSPACE ── */}
            {tab === "Users" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
                      System Accounts
                    </h1>
                    <p className="text-sm text-[#94A3B8] mt-0.5">
                      Audit roles, security properties, and platform membership
                      permissions.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                      <input
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Search name or credentials..."
                        className="border border-[#6C63FF]/20 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-[#6C63FF] bg-[#0D1030] text-white placeholder-slate-500 shadow-sm w-64 transition"
                      />
                    </div>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="border border-[#6C63FF]/20 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#6C63FF] bg-[#0D1030] text-slate-200 shadow-sm transition cursor-pointer"
                    >
                      <option value="" className="bg-[#0D1030]">
                        All Roles
                      </option>
                      <option value="Student" className="bg-[#0D1030]">
                        Student
                      </option>
                      <option value="Lecturer" className="bg-[#0D1030]">
                        Lecturer
                      </option>
                      <option value="Administrator" className="bg-[#0D1030]">
                        Administrator
                      </option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-sm text-slate-400">
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                    Loading accounts register...
                  </div>
                ) : (
                  <div className="bg-[#171B46]/60 rounded-2xl shadow-sm border border-[#6C63FF]/20 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-[#0D1030] text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-[#6C63FF]/20">
                          <tr>
                            <th className="px-6 py-4">Account Holder</th>
                            <th className="px-6 py-4">Email Address</th>
                            <th className="px-6 py-4">System Role</th>
                            <th className="px-6 py-4">Gender</th>
                            <th className="px-6 py-4">Last Activity</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#6C63FF]/10 text-slate-300">
                          {users.map((u) => (
                            <tr
                              key={u.user_id}
                              className="hover:bg-[#0D1030]/40 transition-colors"
                            >
                              <td className="px-6 py-4 font-medium text-white">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 bg-gradient-to-br ${
                                      u.user_role === "Administrator"
                                        ? "from-rose-400 to-red-600"
                                        : u.user_role === "Lecturer"
                                          ? "from-[#7C6FFF] to-[#6C63FF]"
                                          : "from-sky-400 to-blue-600"
                                    }`}
                                  >
                                    {u.full_name?.charAt(0)?.toUpperCase() ||
                                      "?"}
                                  </div>
                                  <span className="truncate max-w-[180px]">
                                    {u.full_name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                                {u.email}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge[u.user_role] || "bg-[#6C63FF]/20 text-slate-400"}`}
                                >
                                  {u.user_role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-400 capitalize">
                                {u.gender || "—"}
                              </td>
                              <td className="px-6 py-4 text-slate-400 text-xs">
                                {u.last_login
                                  ? new Date(u.last_login).toLocaleDateString(
                                      undefined,
                                      { dateStyle: "medium" },
                                    )
                                  : "No access logs"}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() =>
                                    handleDeleteUser(u.user_id, u.full_name)
                                  }
                                  className="text-rose-400 hover:text-rose-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-rose-950/20 transition"
                                >
                                  <i className="fa-solid fa-trash mr-1.5"></i>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {users.length === 0 && (
                      <div className="text-center py-12 text-slate-500 text-sm">
                        No users register found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── MANAGED COURSES INTERACTIVE DATATABLE WORKSPACE ── */}
            {tab === "Courses" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
                      Course Directory
                    </h1>
                    <p className="text-sm text-[#94A3B8] mt-0.5">
                      Monitor content visibility, publication states, and
                      content management.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                      <input
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        placeholder="Search course titles..."
                        className="border border-[#6C63FF]/20 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-[#6C63FF] bg-[#0D1030] text-white placeholder-slate-500 shadow-sm w-64 transition"
                      />
                    </div>
                    <select
                      value={courseStatus}
                      onChange={(e) => setCourseStatus(e.target.value)}
                      className="border border-[#6C63FF]/20 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#6C63FF] bg-[#0D1030] text-slate-200 shadow-sm transition cursor-pointer"
                    >
                      <option value="" className="bg-[#0D1030]">
                        All Statuses
                      </option>
                      <option value="Pending" className="bg-[#0D1030]">
                        Pending
                      </option>
                      <option value="Active" className="bg-[#0D1030]">
                        Active
                      </option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-sm text-slate-400">
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                    Loading courses register...
                  </div>
                ) : (
                  <div className="bg-[#171B46]/60 rounded-2xl shadow-sm border border-[#6C63FF]/20 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-[#0D1030] text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-[#6C63FF]/20">
                          <tr>
                            <th className="px-6 py-4">Course Details</th>
                            <th className="px-6 py-4">Instructor</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#6C63FF]/10 text-slate-300">
                          {courses.map((c) => (
                            <tr
                              key={c.course_id}
                              className="hover:bg-[#0D1030]/40 transition-colors"
                            >
                              <td className="px-6 py-4 font-medium text-white max-w-xs">
                                <p className="truncate font-semibold">
                                  {c.title}
                                </p>
                              </td>
                              <td className="px-6 py-4 text-slate-400">
                                {c.instructor_name}
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs bg-[#6C63FF]/20 text-slate-300 px-2.5 py-0.5 rounded-full border border-[#6C63FF]/30">
                                  {c.category || "General"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    c.status === "Active"
                                      ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                                      : "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30"
                                  }`}
                                >
                                  {c.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <button
                                  onClick={() => setPreviewCourse(c)}
                                  className="text-[#6C63FF] hover:text-[#7C6FFF] text-xs font-semibold px-2 py-1 rounded-lg hover:bg-[#6C63FF]/20 transition"
                                >
                                  Preview
                                </button>
                                {c.status === "Pending" && (
                                  <button
                                    onClick={() =>
                                      handleCourseStatus(c.course_id, "Active")
                                    }
                                    className="text-[#10B981] hover:text-[#059669] text-xs font-semibold px-2 py-1 rounded-lg hover:bg-[#10B981]/20 transition"
                                  >
                                    Approve
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    handleDeleteCourse(c.course_id, c.title)
                                  }
                                  className="text-rose-400 hover:text-rose-300 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-rose-950/20 transition"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {courses.length === 0 && (
                      <div className="text-center py-12 text-slate-500 text-sm">
                        No courses found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── SYSTEM AUDIT ACTIVITY LOG FULL TAB ── */}
            {tab === "Activity" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
                    System Audit Log
                  </h1>
                  <p className="text-sm text-[#94A3B8] mt-0.5">
                    Comprehensive chronological record of security actions and
                    pipeline operations.
                  </p>
                </div>

                <div className="bg-[#171B46]/60 rounded-2xl border border-[#6C63FF]/20 shadow-sm p-6">
                  <div className="space-y-4">
                    {activity.length === 0 ? (
                      <p className="text-center py-12 text-slate-500 text-sm italic">
                        No activity metrics logged.
                      </p>
                    ) : (
                      activity.map((log) => (
                        <div
                          key={log.log_id}
                          className="text-sm pb-4 border-b border-[#6C63FF]/10 last:border-0 last:pb-0 flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <p className="text-slate-300">
                              <span className="font-semibold text-white">
                                {log.full_name || "System Automated"}
                              </span>{" "}
                              {log.action}
                              {log.target_type && (
                                <span className="text-[#6C63FF] font-mono text-xs ml-1 bg-[#6C63FF]/20 px-1.5 py-0.5 rounded border border-[#6C63FF]/30">
                                  ({log.target_type} #{log.target_id})
                                </span>
                              )}
                            </p>
                            <span className="text-xs text-slate-500 block">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Video Preview Modal Layer */}
      {previewCourse && youtubeId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0D1030] border border-[#6C63FF]/20 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4 p-6 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white truncate max-w-[90%]">
                Reviewing: {previewCourse.title}
              </h3>
              <button
                onClick={() => setPreviewCourse(null)}
                className="text-slate-400 hover:text-white transition text-sm"
              >
                <i className="fa-solid fa-xmark text-base"></i>
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#6C63FF]/20">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Course Presentation Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewCourse(null)}
                className="px-4 py-2 bg-[#6C63FF]/20 border border-[#6C63FF]/30 text-slate-300 rounded-xl text-xs font-semibold hover:bg-[#6C63FF]/30 transition"
              >
                Close Video
              </button>
              {previewCourse.status === "Pending" && (
                <button
                  onClick={() =>
                    handleCourseStatus(previewCourse.course_id, "Active")
                  }
                  className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-semibold shadow-md transition"
                >
                  Approve Course
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
