import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#142175]">My Courses</h1>
          <p className="text-gray-500 text-sm mt-1">
            Create and manage the courses you teach.
          </p>
        </div>

        <Link
          to="/lecturer/courses/new"
          className="bg-[#142175] hover:bg-[#0d185a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition"
        >
          <i className="fa-solid fa-plus"></i> New Course
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 mb-4">
            You haven't created any courses yet.
          </p>
          <Link
            to="/lecturer/courses/new"
            className="bg-[#142175] text-white px-5 py-2.5 rounded-lg text-sm font-medium inline-block"
          >
            Create your first course
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.course_id}
              onClick={() => navigate(`/lecturer/courses/${c.course_id}`)}
              className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition cursor-pointer"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {c.category}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[c.status] || statusStyle.Inactive}`}
                  >
                    {c.status}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-gray-800">{c.title}</h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {c.description}
                </p>

                <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
                  <i className="fa-solid fa-user-group"></i> {c.enrolled_count}{" "}
                  students enrolled
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
