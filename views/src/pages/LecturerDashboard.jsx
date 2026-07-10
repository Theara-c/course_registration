import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LecturerLayout from "../component/LecturerLayout.jsx";

// Matches your project's pattern: plain axios calls, JWT stored in
// localStorage after login, no separate "services" folder yet.
const API_URL = "http://localhost:8000/api/lecturer";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

const statusStyle = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-600",
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
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#142175]">My Courses</h1>
            <p className="text-gray-500 text-sm mt-1">
              Create and manage the courses you teach.
            </p>
          </div>

          <button
            onClick={() => navigate("/lecturer/courses/new")}
            className="bg-[#142175] hover:bg-[#0d185a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition"
          >
            <i className="fa-solid fa-plus"></i> New Course
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading your courses...</p>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500 mb-4">
              You haven't created any courses yet.
            </p>
            <button
              onClick={() => navigate("/lecturer/courses/new")}
              className="bg-[#142175] text-white px-5 py-2.5 rounded-lg text-sm font-medium inline-block"
            >
              Create your first course
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div
                key={c.course_id}
                onClick={() => navigate(`/lecturer/courses/${c.course_id}`)}
                className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                {/* Thumbnail from YouTube if videoURL exists */}
                {c.videoURL && c.videoURL.includes("youtube") ? (
                  <img
                    src={`https://img.youtube.com/vi/${extractYouTubeId(c.videoURL)}/hqdefault.jpg`}
                    alt={c.title}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-[#142175] to-[#2a3f9f] flex items-center justify-center">
                    <i className="fa-solid fa-book-open text-white/40 text-3xl"></i>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {c.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        statusStyle[c.status] || statusStyle.Inactive
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-gray-800 line-clamp-1">
                    {c.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {c.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>
                      <i className="fa-solid fa-user-group mr-1"></i>
                      {c.enrolled_count} students
                    </span>
                    <span className="text-[#142175] font-medium">
                      View details →
                    </span>
                  </div>
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
