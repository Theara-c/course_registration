import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// import components
import Home from "./component/Home.jsx";
import Course from "./component/Course.jsx";
import AboutUs from "./component/AboutUs.jsx";
import Login from './component/Login.jsx';
import Signup from './component/Signup.jsx';
import CourseDetail from './component/CourseDetail.jsx'
import Video  from "./component/Video.jsx";
// import pages
import Layout from "./component/Layout.jsx" ;
import StudentDashboard from "./pages/StudentDashboard.jsx";


import Test from './pages/Test.jsx'
import Tes from './pages/Tes.jsx'
function App() {

  return (
    <>
     
    <BrowserRouter>
    <ToastContainer 
        position="top-right" // Options: "top-right", "top-left", "top-center", etc.
        autoClose={3000}     // Closes automatically after 3 seconds
        hideProgressBar={false}
      />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path = '/home' element = {< Home/>} />
        <Route path = '/courses' element = {< Course/>} />
        <Route path = '/about' element = {< AboutUs/>} />

        <Route path="/login" element = { <Login />} />
        <Route path="/signup" element = { <Signup />} />
        <Route path="/courses/:id/course_detail" element = {<CourseDetail/> } />
        <Route path='/courses/:id/watch' element = { <Video />} />

        {/* student page */}
        <Route path='/students/:id/dashboard' element = { <StudentDashboard />} />
        <Route path="/test" element = { <Test />} />
        <Route path='/tes/:id' element = { < Tes />} />
        <Route path="*" element={<h1 className="text-center text-2xl mt-20">404 - Page Not Found</h1>} />

      </Route>

    </Routes>

    </BrowserRouter>

    </>
  )
}

export default App;
