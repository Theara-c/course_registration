// pages/LecturerDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LecturerLayout from "../../component/LecturerLayout.jsx";
import CreateCourse from "../../component/CreateCourse.jsx";
import useAuth from "../../hooks/useAuth.js";
import { getLecturerDashboard } from "../../api/lecturerAPI.js";
import { getCategory } from "../../api/courseApi.js";

// Status Badges (Handles both dark and light modes cleanly)
const statusStyle = {
  Active:
    "bg-[#10B981]/10 text-[#10B981] dark:bg-[#10B981]/20 dark:text-[#10B981] border border-[#10B981]/30",
  Pending:
    "bg-[#F59E0B]/10 text-[#D97706] dark:bg-[#F59E0B]/20 dark:text-[#F59E0B] border border-[#F59E0B]/30",
  Inactive:
    "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400 border border-gray-300 dark:border-gray-500/30",
};

export default function LecturerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [category, setCategory] = useState([]);
  const [editCourse, setEditCourse] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // State to manage Night / Day mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  localStorage.setItem("theme", isDarkMode);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await getLecturerDashboard(token);
        setData(res);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const c = await getCategory();
        setCategory(c);
      } catch (err) {
        console.log("Error", err);
      }
    };
    fetchCategory();
  }, [create]);
  const secondToMin = (second) => {
    return (second / 60).toFixed(1);
  };

  return (
    <LecturerLayout activeTab="courses" setCreate={setCreate}>
      {/* Outer container switching between Light (#F8FAFC) and Dark (#080B24) */}
      <div
        className={`min-h-screen transition-colors duration-300 px-8 py-10 space-y-8 ${
          isDarkMode
            ? "bg-[#080B24] text-[#F8FAFC]"
            : "bg-[#F8FAFC] text-gray-900"
        }`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-4xl font-bold tracking-tight ${
                isDarkMode ? "text-[#F8FAFC]" : "text-gray-900"
              }`}
            >
              Welcome, {user?.full_name || "Lecturer"}!
            </p>
            <p className="text-3xl font-bold !my-2 ">
              Total Courses: {data.total}
            </p>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-[#94A3B8]" : "text-gray-500"
              }`}
            >
              Create and manage the courses you teach.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark/Light Mode Toggle Switch */}
            {/* <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all duration-200 ${
                isDarkMode
                  ? "bg-[#171B46] border-[#6C63FF]/30 text-yellow-400 hover:bg-[#1f245c]"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <>
                  <i className="fa-solid fa-sun text-sm"></i> Light Mode
                </>
              ) : (
                <>
                  <i className="fa-solid fa-moon text-sm text-[#6C63FF]"></i>{" "}
                  Night Mode
                </>
              )}
            </button> */}

            {/* New Course Button */}
            <button
              onClick={() => setCreate(true)}
              className="bg-[#142175] hover:bg-[#1a2f9c] text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm shadow-[#6C63FF]/20 transition-all duration-200"
            >
              <i className="fa-solid fa-plus text-xs"></i> New Course
            </button>
          </div>
        </div>
        {create && <CreateCourse setCreate={setCreate} category={category} />}

        {/* Content States */}
        {loading ? (
          <div
            className={`py-12 text-center text-sm ${
              isDarkMode ? "text-[#94A3B8]" : "text-gray-500"
            }`}
          >
            <i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading
            your courses...
          </div>
        ) : data.courses.length === 0 ? (
          /* Empty State Container */
          <div
            className={`rounded-2xl border border-dashed p-12 text-center shadow-sm ${
              isDarkMode
                ? "bg-[#171B46] border-[#6C63FF]/30"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="w-12 h-12 bg-[#6C63FF]/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#6C63FF]">
              <i className="fa-solid fa-book-open text-lg"></i>
            </div>
            <p
              className={`text-sm !mb-4 ${
                isDarkMode ? "text-[#94A3B8]" : "text-gray-500"
              }`}
            >
              You haven't created any courses yet.
            </p>
            <button
              onClick={() => setCreate(true)}
              className="bg-[#142175] hover:bg-[#1a2f9c] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
            >
              Create your first course
            </button>
          </div>
        ) : (
          /* Course Cards Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.courses.map((c) => (
              // Improved Course Card Component with Better Thumbnail Design
              <div
                key={c.course_id}
                className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                  isDarkMode
                    ? "bg-[#171B46] border-[#6C63FF]/20 hover:border-[#6C63FF]/40"
                    : "bg-white border-gray-200 hover:border-[#6C63FF]/50"
                }`}
              >
                <div>
                  {/* ── Thumbnail Cover Header with Overlay ── */}
                  <div className="relative w-full bg-black overflow-hidden aspect-video group">
                    {c.video_id ? (
                      <>
                        <img
                          src={`https://img.youtube.com/vi/${c.video_id}/hqdefault.jpg`}
                          alt={c.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#6C63FF]/20 to-[#7C6FFF]/20 flex items-center justify-center relative">
                        <div className="text-center">
                          <i className="fa-solid fa-book-open text-[#6C63FF]/40 text-4xl block mb-2"></i>
                          <p
                            className={`text-xs font-medium ${isDarkMode ? "text-[#6C63FF]/40" : "text-gray-400"}`}
                          >
                            No Video
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Status Badge (Top Right) */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] ${c.status == "waiting" ? "bg-yellow-500" : c.status === "active" ? "bg-green-500" : "bg-red-500"} text-white font-bold px-2.5 py-1 rounded-full  uppercase  ${
                          statusStyle[c.status] || statusStyle.Inactive
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    {/* Duration Badge (Bottom Left) - if available */}
                    {c.duration && (
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-clock text-[10px]"></i>
                        {secondToMin(c.duration)} min
                      </div>
                    )}

                    {/* Price Badge (Bottom Right) - if premium */}
                    {c.price > 0 && (
                      <div className="absolute bottom-3 right-3 bg-[#F59E0B]/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg font-bold">
                        ${c.price}
                      </div>
                    )}
                  </div>

                  {/* Body Content Container */}
                  <div className="p-5 space-y-3">
                    {/* Category & Status Row */}
                    <div className="flex justify-between items-center gap-2">
                      <span
                        className={`text-[14px] bg-[#142175] text-white font-semibold px-2.5 py-0.5 rounded border tracking-wide max-w-[65%] truncate `}
                      >
                        {c.category_name || "General"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-bold text-base group-hover:text-[#6C63FF] transition-colors line-clamp-2 ${
                        isDarkMode ? "text-[#F8FAFC]" : "text-gray-900"
                      }`}
                    >
                      {c.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-sm line-clamp-2 leading-relaxed ${
                        isDarkMode ? "text-[#94A3B8]" : "text-gray-600"
                      }`}
                    >
                      {c.sub_description || "No description"}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                {c.status == "waiting" ? (
                  <button
                    className={` w-full bg-yellow-500  hover:bg-yellow-300 "}
                     text-white py-3 rounded-lg transition cursor-pointer`}
                  >
                    Waiting...
                  </button>
                ) : c.status == "reject" ? (
                  <button
                    className={` w-full bg-yellow-500  hover:bg-yellow-300 "}
                     text-white py-3 rounded-lg transition cursor-pointer`}
                    onClick={() => {
                      setIsEdit(true);
                      setEditCourse(c.course_id);
                    }}
                  >
                    Edit Course
                  </button>
                ) : (
                  <div
                    className={`px-5 pb-5 pt-3 border-t flex items-center justify-between text-xs font-medium mt-auto ${
                      isDarkMode
                        ? "border-[#6C63FF]/10 text-[#94A3B8]"
                        : "border-gray-100 text-gray-500"
                    }`}
                  >
                    <span>
                      <i className="fa-solid fa-user-group mr-1.5 text-[#6C63FF]/60"></i>
                      {c.totalStudent || 0} students
                    </span>
                    <span
                      className="text-[#6C63FF] group-hover:underline font-semibold flex items-center gap-1"
                      onClick={() =>
                        navigate(`/lecturers/courses/${c.course_id}`)
                      }
                    >
                      View{" "}
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {isEdit && <CreateCourse setCreate={setIsEdit} category={category} course_id = { editCourse} />}

      
    </LecturerLayout>
  );
}

// function extractYouTubeId(url) {
//   if (!url) return "";
//   const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
//   return match ? match[1] : "";
// }
