import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

function StudentDashboard() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [mode, setMode] = useState("All");
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = ["All", "Enrolled", "Completed"];

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/student/dashboard", authHeaders())
      .then((res) => {
        setStudent(res.data.student);
        setEnrollments(res.data.enrollments);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  }

  const filteredEnrollments = enrollments.filter((e) => {
    if (mode === "All") return true;
    if (mode === "Enrolled") return e.status === "Enrolled";
    if (mode === "Completed") return e.status === "Completed";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm px-8 py-4 flex justify-between items-center relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#142175] rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-graduation-cap text-white text-sm"></i>
          </div>
          <span className="font-bold text-[#142175]">EduFlow</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 rounded-full bg-[#142175] text-white font-bold"
          >
            {student?.full_name?.charAt(0) || "S"}
          </button>

          {showMenu && (
            <div className="absolute top-12 right-0 w-52 bg-white rounded-lg shadow-lg border z-50">
              <ul className="py-2 text-sm">
                <li className="px-4 py-2 text-gray-500 border-b text-xs">
                  {student?.email}
                </li>
                <li
                  onClick={() => navigate("/courses")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <i className="fa-solid fa-compass mr-2 text-[#142175]"></i>{" "}
                  Browse Courses
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-red-50 cursor-pointer text-red-500"
                >
                  <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 px-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-[#142175] flex items-center justify-center text-5xl font-bold text-white">
                {student?.full_name?.charAt(0) || "S"}
              </div>
              <p className="mt-4 font-semibold text-gray-700">
                {student?.user_role}
              </p>
            </div>

            {/* Info */}
            <div>
              <p className="text-3xl font-bold">
                Welcome back, {student?.full_name?.split(" ")[0]}!
              </p>
              <h2 className="mt-6 text-xl font-medium">Personal Information</h2>
              <div className="mt-4 space-y-2 text-gray-700 text-sm">
                <p>
                  <strong>Name:</strong> {student?.full_name}
                </p>
                <p>
                  <strong>Email:</strong> {student?.email}
                </p>
                <p>
                  <strong>Phone:</strong> {student?.phone_number || "—"}
                </p>
                <p>
                  <strong>Gender:</strong> {student?.gender || "—"}
                </p>
                <p>
                  <strong>DOB:</strong>{" "}
                  {student?.date_of_birth
                    ? new Date(student.date_of_birth).toLocaleDateString()
                    : "—"}
                </p>
                <p>
                  <strong>Role:</strong> {student?.user_role}
                </p>
                {student?.telegram_link && (
                  <p>
                    <strong>Telegram:</strong>{" "}
                    <a
                      href={student.telegram_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {student.telegram_link}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="ml-auto flex flex-col gap-3">
              <div className="bg-blue-50 rounded-xl p-4 text-center min-w-[100px]">
                <p className="text-2xl font-bold text-[#142175]">
                  {enrollments.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Enrolled</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {enrollments.filter((e) => e.status === "Completed").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 justify-center mt-8 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setMode(filter)}
              className={`px-6 py-2 rounded-full border cursor-pointer transition ${
                mode === filter
                  ? "bg-[#142175] text-white border-[#142175]"
                  : "bg-white text-black hover:bg-[#142175] hover:text-white hover:border-[#142175]"
              }`}
            >
              {filter === "All"
                ? "All Courses"
                : filter === "Enrolled"
                  ? "In Progress"
                  : "Completed"}
            </button>
          ))}
        </div>

        {/* Enrolled Courses */}
        <div className="mt-10 mb-16">
          <h2 className="text-2xl font-bold mb-6">
            {mode === "All"
              ? "My Courses"
              : mode === "Enrolled"
                ? "In Progress"
                : "Completed"}
          </h2>

          {filteredEnrollments.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <i className="fa-solid fa-book-open text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">
                {enrollments.length === 0
                  ? "You haven't enrolled in any courses yet."
                  : "No courses in this filter."}
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="mt-4 bg-[#142175] text-white px-6 py-2.5 rounded-lg text-sm font-medium"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrollments.map((enrollment) => (
                <div
                  key={enrollment.enrollment_id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  {/* Thumbnail */}
                  <img
                    src={
                      enrollment.videoURL &&
                      enrollment.videoURL.includes("youtube")
                        ? `https://img.youtube.com/vi/${extractYouTubeId(enrollment.videoURL)}/hqdefault.jpg`
                        : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400"
                    }
                    alt={enrollment.title}
                    className="h-44 w-full object-cover"
                  />

                  <div className="p-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        enrollment.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {enrollment.status}
                    </span>

                    <h3 className="font-bold text-lg mt-3">
                      {enrollment.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      <i className="fa-solid fa-chalkboard-teacher mr-1"></i>
                      {enrollment.instructor_name}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Enrolled{" "}
                      {new Date(enrollment.enrolled_at).toLocaleDateString()}
                    </p>

                    {/* Resume / View buttons */}
                    <button
                      onClick={() =>
                        navigate(`/courses/${enrollment.course_id}/watch`)
                      }
                      className="mt-5 w-full bg-[#142175] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#0d185a] transition"
                    >
                      {enrollment.status === "Completed"
                        ? "Watch Again"
                        : "Resume Lesson →"}
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/courses/${enrollment.course_id}/course_detail`,
                        )
                      }
                      className="mt-2 w-full border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                    >
                      Course Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function extractYouTubeId(url) {
  if (!url) return "";
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : url;
}

export default StudentDashboard;
