import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [mode, setMode] = useState("All");
  // 2. Fixed: Read directly inside initialization function to avoid the cascading render warning entirely
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (err) {
        console.error("Failed to parse user session object:", err);
      }
    }
    return null;
  });

  const filters = ["All", "Enrolled", "Completed"];
  const courses = [
    {
      id: 1,
      title: "Advanced Data Structures",
      progress: 68,
      status: "In Progress",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    },
    {
      id: 2,
      title: "UI Design Principles",
      progress: 42,
      status: "In Progress",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    },
    {
      id: 3,
      title: " Design Principles",
      progress: 42,
      status: "Completed",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    },
  ];
  // ── Action: Clear session elements and route home ──
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Get first letter of the name for the profile circle avatar token
  const getInitial = () => {
    if (user?.full_name) return user.full_name.charAt(0).toUpperCase();
    return "S";
  };

  // Format timestamp string safely if present
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm px-8 py-4 flex justify-end relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-10 h-10 rounded-full bg-[#142175] text-white"
        >
          {getInitial()}
        </button>

        {showMenu && (
          <div className="absolute top-16 right-8 w-52 bg-white rounded-lg shadow-lg border">
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                My Learning
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Profile
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Settings
              </li>
              <li
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="max-w-6xl mx-auto mt-8 px-6">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt={user?.full_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="mt-4 font-semibold">{user?.username || "N/A"}</p>
            </div>

            {/* Info */}
            <div>
              <p className="text-3xl font-bold">
                Welcome back,{" "}
                {user?.full_name ? user.full_name.split(" ")[0] : "Alex"}
              </p>

              <h2 className="mt-6 text-xl font-medium ">
                Personal Information
              </h2>

              <div className="mt-6 space-y-3 text-black font-normal ">
                <p>
                  <strong>Name:</strong> {user?.full_name || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email || "N/A"}
                </p>
                <p>
                  <strong>Phone number:</strong> {user?.phone || "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong> {user?.gender || "N/A"}
                </p>
                <p>
                  <strong>DOB:</strong> {formatDate(user?.dob)}
                </p>
                <p>
                  <strong>Role:</strong> Student
                </p>
                <p>
                  <strong>Address:</strong> {user?.address || "N/A"}
                </p>
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
              className={`px-6 py-2 rounded-full border cursor-pointer transition
        ${
          mode === filter
            ? "bg-[#142175] text-white"
            : "bg-white text-black hover:bg-[#142175] hover:text-white"
        }`}
            >
              {filter === "All"
                ? "All Courses"
                : filter === "Enrolled"
                  ? "Current Course"
                  : "Course Complete"}
            </button>
          ))}
        </div>

        {/* Continue Learning */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    {course.status}
                  </span>

                  <h3 className="font-bold text-xl mt-4">{course.title}</h3>

                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Course Progress</span>
                      <span>{course.progress}%</span>
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-teal-500 rounded-full"
                        style={{
                          width: `${course.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button className="mt-6 w-full bg-[#142175] text-white py-3 rounded-lg">
                    Resume Lesson →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
