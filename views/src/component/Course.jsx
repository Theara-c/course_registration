import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Course() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);

      try {
        const res = await axios.get(
          "http://localhost:8000/api/student/courses",
          {
            params: { search },
          },
        );

        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [search]);
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Search */}
      <div className="mb-10">
        <div className="relative max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search for courses, skills, or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#142175]"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <div className="text-center py-16">
          <i className="fa-solid fa-book-open text-5xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">
            No courses found{search ? ` for "${search}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.course_id}
              onClick={() =>
                navigate(`/courses/${course.course_id}/course_detail`)
              }
              className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition cursor-pointer"
            >
              {/* Thumbnail from YouTube or fallback */}
              <img
                src={
                  course.videoURL && course.videoURL.includes("youtube")
                    ? `https://img.youtube.com/vi/${extractYouTubeId(course.videoURL)}/hqdefault.jpg`
                    : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400"
                }
                alt={course.title}
                className="h-44 w-full object-cover"
              />

              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {course.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {course.duration ? `${course.duration} min` : ""}
                  </span>
                </div>

                <h3 className="font-bold text-base text-gray-800 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {course.sub_description || course.description}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  <i className="fa-solid fa-chalkboard-teacher mr-1"></i>
                  {course.instructor_name}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">
                    <i className="fa-solid fa-user-group mr-1"></i>
                    {course.enrolled_count} students
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${course.course_id}/course_detail`);
                    }}
                    className="border border-[#142175] text-[#142175] text-xs px-3 py-1.5 rounded hover:bg-[#142175] hover:text-white transition"
                  >
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Helper: extract YouTube video ID from full URL or short ID
function extractYouTubeId(url) {
  if (!url) return "";
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : url;
}
export default Course;
