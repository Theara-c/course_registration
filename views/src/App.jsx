import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import components
import Home from "./component/Home.jsx";
import Course from "./component/Course.jsx";
import AboutUs from "./component/AboutUs.jsx";
import Login from "./component/Login.jsx";
import Signup from "./component/Signup.jsx";
import CourseDetail from "./component/CourseDetail.jsx";
import Video from "./component/Video.jsx";
import Privacy from "./component/Privacy.jsx";
import Terms from "./component/Terms.jsx";
import Support from "./component/Support.jsx";
// import pages
import Layout from "./component/Layout.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
// Lecturer
import LecturerDashboard from "./pages/LecturerDashboard.jsx";
import CreateCoursePage from "./pages/CreateCoursePage.jsx";
import LecturerCourseDetailPage from "./pages/LecturerCourseDetailPage.jsx";
import LecturerProfile from "./pages/LecturerProfile.jsx";
import LecturerSettings from "./pages/LecturerSettings.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer
          position="top-right" // Options: "top-right", "top-left", "top-center", etc.
          autoClose={3000} // Closes automatically after 3 seconds
          hideProgressBar={false}
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/courses" element={<Course />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/support" element={<Support />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/courses/:id/course_detail"
              element={<CourseDetail />}
            />
            <Route path="/courses/:id/watch" element={<Video />} />

            {/* student page */}
            <Route
              path="/students/:id/dashboard"
              element={<StudentDashboard />}
            />
            {/* lecturer page ------------------------------*/}
            <Route
              path="/lecturer/:id/dashboard"
              element={<LecturerDashboard />}
            />
            <Route
              path="/lecturer/courses/new"
              element={<CreateCoursePage />}
            />
            <Route
              path="/lecturer/courses/:id"
              element={<LecturerCourseDetailPage />}
            />
            <Route path="/lecturer/:id/profile" element={<LecturerProfile />} />
            <Route
              path="/lecturer/:id/settings"
              element={<LecturerSettings />}
            />
            {/* Admin */}
            <Route path="/admin/:id/dashboard" element={<AdminDashboard />} />

            <Route
              path="*"
              element={
                <h1 className="text-center text-2xl mt-20">
                  404 - Page Not Found
                </h1>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
