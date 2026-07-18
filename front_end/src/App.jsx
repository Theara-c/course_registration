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
// import pages
import Layout from "./component/Layout.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import UnfoundPage from "./pages/UnfoundPage.jsx";
//lecturer page
import LecturerDashboard from "./pages/lecturer/LecturerDashboard.jsx";
import LecturerProfile from "./pages/lecturer/LecturerProfile.jsx";
import LecturerSetting from "./pages/lecturer/LecturerSetting.jsx";
// student page
import StudentManagement from "./pages/lecturer/StudentManagement.jsx";

//admin page
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";

import AuthProvider from "./context/AuthProvider.jsx";
import ProtectedRoute from "./hooks/ProtectedRoute.jsx";

import UnauthorizeUser from "./pages/UnauthorizeUser.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
        />
        <AuthProvider>
          <Routes>
            {/* Guest */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/courses" element={<Course />} />
              <Route path="/about" element={<AboutUs />} />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route
                path="/courses/:id/course_detail"
                element={<CourseDetail />}
              />

              {/* Protected route */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["Student", "student"]} />
                }
              >
                <Route
                  path="/students/:id/dashboard"
                  element={<StudentDashboard />}
                />

                <Route path="/courses/:id/watch" element={<Video />} />
              </Route>

              {/* lecturer */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["lecturer", "Lecturer"]} />
                }
              >
                <Route
                  path="/lecturers/:id/dashboard"
                  element={<LecturerDashboard />}
                />
                <Route
                  path="/lecturers/:id/profile"
                  element={<LecturerProfile />}
                />
                <Route
                  path="/lecturers/:id/settings"
                  element={<LecturerSetting />}
                />
                <Route
                  path="/lecturers/courses/:id"
                  element={<StudentManagement />}
                />
              </Route>

              <Route
                element={<ProtectedRoute allowedRoles={["admin", "Admin"]} />}
              >
                <Route
                  path="/admin/:id/dashboard"
                  element={<AdminDashboard />}
                />
                <Route path="/admin/:id/user" element={<UserManagement />} />
              </Route>

              <Route path="/unauthorized" element={<UnauthorizeUser />} />

              <Route path="*" element={<UnfoundPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
