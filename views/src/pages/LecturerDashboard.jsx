// pages/LecturerDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LecturerLayout from "../component/LecturerLayout.jsx";

const API_URL = "http://localhost:8000/api/lecturer";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

// Modern status badges matching the Admin Dashboard style
const statusStyle = {
  Active: "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30",
  Pending: "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30",
  Inactive: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
};

export default function LecturerDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/courses`, authHeaders())
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <LecturerLayout activeTab="courses">
      {/* Main container with dark background and text colors */}
      <div className="min-h-screen bg-[#080B24] text-[#F8FAFC] px-8 py-10 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
              My Courses
            </h1>
            <p className="text-[#94A3B8] text-sm mt-1">
              Create and manage the courses you teach.
            </p>
          </div>

          <button
            onClick={() => navigate("/lecturer/courses/new")}
            className="bg-[#6C63FF] hover:bg-[#5a52d9] text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm shadow-[#6C63FF]/20 transition-all duration-200"
          >
            <i className="fa-solid fa-plus text-xs"></i> New Course
          </button>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="py-12 text-center text-sm text-[#94A3B8]">
            <i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading
            your courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-[#171B46] rounded-2xl border border-dashed border-[#6C63FF]/30 p-12 text-center shadow-sm">
            <div className="w-12 h-12 bg-[#6C63FF]/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#6C63FF]">
              <i className="fa-solid fa-book-open text-lg"></i>
            </div>
            <p className="text-[#94A3B8] text-sm mb-4">
              You haven't created any courses yet.
            </p>
            <button
              onClick={() => navigate("/lecturer/courses/new")}
              className="bg-[#6C63FF] hover:bg-[#5a52d9] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
            >
              Create your first course
            </button>
          </div>
        ) : (
          /* Course Cards Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div
                key={c.course_id}
                onClick={() => navigate(`/lecturer/courses/${c.course_id}`)}
                className="bg-[#171B46] rounded-2xl border border-[#6C63FF]/20 overflow-hidden shadow-sm hover:shadow-lg hover:border-[#6C63FF]/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Cover Header */}
                  {c.videoURL && c.videoURL.includes("youtube") ? (
                    <img
                      src={`https://img.youtube.com/vi/${extractYouTubeId(c.videoURL)}/hqdefault.jpg`}
                      alt={c.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-[#6C63FF] to-[#7C6FFF] flex items-center justify-center relative">
                      <i className="fa-solid fa-book-open text-white/25 text-3xl"></i>
                    </div>
                  )}

                  {/* Body Content Container */}
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#6C63FF]/20 text-[#94A3B8] border border-[#6C63FF]/30 tracking-wide max-w-[65%] truncate">
                        {c.category || "General"}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase shrink-0 ${
                          statusStyle[c.status] || statusStyle.Inactive
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#F8FAFC] group-hover:text-[#6C63FF] transition-colors line-clamp-1">
                      {c.title}
                    </h3>
                    <p className="text-[#94A3B8] text-sm line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 pb-5 pt-2 border-t border-[#6C63FF]/10 flex items-center justify-between text-xs text-[#94A3B8] font-medium mt-auto">
                  <span>
                    <i className="fa-solid fa-user-group mr-1.5 text-[#6C63FF]/40"></i>
                    {c.enrolled_count || 0} students
                  </span>
                  <span className="text-[#6C63FF] group-hover:underline font-semibold flex items-center gap-1">
                    View details{" "}
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LecturerLayout>
  );
}

function extractYouTubeId(url) {
  if (!url) return "";
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
}
