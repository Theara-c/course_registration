import { useState } from "react";

function StudentDashboard() {
  const [showMenu, setShowMenu] = useState(false);
  const [mode, setMode] = useState('All');
  const filters = [ "All", 'Enrolled', 'Completed'];
  const courses = [
    {
      id: 1,
      title: "Advanced Data Structures",
      progress: 68,
      status: "In Progress",
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    },
    {
      id: 2,
      title: "UI Design Principles",
      progress: 42,
      status: "In Progress",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    },
    {
      id: 3,
      title: " Design Principles",
      progress: 42,
      status: "Completed",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow-sm px-8 py-4 flex justify-end relative">

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-10 h-10 rounded-full bg-[#142175] text-white"
        >
          A
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
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
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
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="mt-4 font-semibold">
                username
              </p>
            </div>

            {/* Info */}
            <div>
              <p className="text-3xl font-bold">
                Welcome back, Alex
              </p>

              <h2 className="mt-6 text-xl font-medium ">
                Personal Information
              </h2>

              <div className="mt-6 space-y-3 text-black font-normal ">
                <p><strong>Name:</strong> ABC DEF</p>
                <p><strong>Email:</strong> abc@email.com</p>
                <p><strong>Phone number:</strong> 0123456</p>
                <p><strong>Gender:</strong> Male</p>
                <p><strong>DOB:</strong> 11-11-2011</p>
                <p><strong>Role:</strong> Student</p>
                <p><strong>Address:</strong> Phnom Penh</p>
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
          <h2 className="text-2xl font-bold mb-6">
            Continue Learning
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <img
                  src={course.image}
                  alt=""
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    {course.status}
                  </span>

                  <h3 className="font-bold text-xl mt-4">
                    {course.title}
                  </h3>

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