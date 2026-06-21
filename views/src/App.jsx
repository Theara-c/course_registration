import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// import components
import Home from "./pages/Home.jsx";
import Course from "./pages/Course.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import CourseDetail from './component/CourseDetail.jsx'
import Video  from "./pages/Video.jsx";
// import pages
import Layout from "./component/Layout.jsx" ;

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
        <Route path="*" element={<h1 className="text-center text-2xl mt-20">404 - Page Not Found</h1>} />

      </Route>

    </Routes>

    </BrowserRouter>

    </>
  )
}

export default App;
