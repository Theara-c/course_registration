import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { studentDashboard } from "../api/enrollmentAPI.js";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
function StudentDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [enrollment, setEnrollment] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("filter mode", searchParams.toString());
        const data = await studentDashboard(
          token,
          searchParams.toString(),
        );
        setEnrollment(data.enrollmentRecord);
        setUserInfo(data.data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
      }
    };
    fetchData();
  }, [searchParams, user.user_id]);

  const mode = searchParams.get("filter") || "all";

  const filters = [
    { label: "All Courses", value: "all" },
    { label: "Current Course", value: "enrolled" },
    { label: "Completed Course", value: "completed" },
    { label: "Waiting Course", value: "waiting" },
  ];
  const calculateProgress = (duration, progress) => {
    if (enrollment.length === 0) return 0;
    const progressPercentage = (progress / duration) * 100;
    return Math.min(Math.max(progressPercentage, 0), 100).toFixed(2);
  };
  const handleDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto mt-8 px-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="mt-4 font-semibold">{userInfo.full_name}</p>
            </div>

            <div>
              <p className="text-3xl font-bold">
                Welcome back, {userInfo.full_name}
              </p>

              <h2 className="mt-6 text-xl font-medium">Personal Information</h2>

              <div className="mt-6 space-y-3">
                <p>
                  <strong>Email:</strong> {userInfo?.email}
                </p>
                <p>
                  <strong>Phone:</strong> {userInfo?.phone_number}
                </p>
                <p>
                  <strong>Gender:</strong> {userInfo.gender}
                </p>
                <p>
                  <strong>DOB:</strong> {handleDate(userInfo.dob)}
                </p>
                <p>
                  <strong>Role:</strong> {userInfo.user_role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSearchParams({ filter: filter.value })}
              className={`px-6 py-2 rounded-full border transition cursor-pointer 
                ${
                  mode === filter.value
                    ? "bg-[#142175] text-white"
                    : "bg-white hover:bg-[#142175] hover:text-white"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Courses */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8">
            {filters.find((f) => f.value === mode)?.label}
          </h2>

          {enrollment.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              No courses found.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
              {enrollment.map((course) => (
                <div
                  key={course.id}
                  className="bg-white  rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition"
                  id="move"
                >
                  <img
                    src={`https://img.youtube.com/vi/${course.video_id}/hqdefault.jpg`}
                    alt={course.title}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          course.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : course.status === "Waiting"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {course.status}
                    </span>

                    <h3 className="font-bold text-xl mt-4">{course.title}</h3>

                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Course Progress</span>
                        <span>{course.progress ? `${calculateProgress(course.duration, course.progress)}%` : "0%"}</span>
                      </div>

                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-teal-500 rounded-full"
                          style={{
                            width: `${calculateProgress(course.duration, course.progress)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <button
                      className={`mt-6 w-full  ${course.status === "waiting" ? "bg-yellow-500 hover:bg-yellow-600" :
                        course.status === 'reject'? 'bg-red-500 hover:bg-red-400': "bg-[#142175] hover:bg-blue-600"}
                     text-white py-3 rounded-lg transition cursor-pointer`}
                      disabled={course.status === "waiting" ? true : false}
                      onClick = {() => {
                        if (course.status === "enrolled") {
                          navigate(`/courses/${course.course_id}/watch`, { state: { course } });  
                      } }
                    }
                    >
                      {course.status === "waiting"
                          ? "Waiting Approval"
                          : course.status ==='reject'? 'Request reject': "Resume Lesson →"}
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

export default StudentDashboard;
