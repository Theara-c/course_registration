import { useState, useEffect } from "react";
import AdminLayout from "./adminLayout";
import { getCategory } from "../../api/courseApi";
import { useSearchParams } from "react-router-dom";
import { getAdminDashboard, updateCourseStatus } from "../../api/adminAPI";
import ReviewVideo from "../../component/ReviewVideo.jsx";

import {
  FaUsers,
  FaBookOpen,
  FaClipboardCheck,
  FaEye,
  FaFilter,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]); // Renamed to plural for clarity
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [ data, setData] = useState(null);
  const [isReview, setIsReview] = useState(false);
  const [ selectCourse, setSelectCourse] = useState(null);

  // 1. Read the current category ID from the URL search parameters
  const currentCategory = searchParams.get("category") || "";

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const c = await getCategory();
        setCategories(c);
      } catch (err) {
        console.log("Error", err);
      }
    };
    fetchCategory();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;

    if (value) {
      searchParams.set("category", value);
    } else {
      searchParams.delete("category"); // Clears the parameter if "All Categories" is picked
    }
    setSearchParams(searchParams);
  };
  const handleDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  const handleApproval = async ( mode, course_id) => {

    const token = localStorage.getItem("accessToken");
    const res = await updateCourseStatus(token, mode, course_id);
    console.log(res)
    toast.success(res.msg);
    setCourses((prevCourses) => 
      prevCourses.filter((course) => course.course_id !== course_id)
    );
    setIsReview(false);
    
  }
  useEffect ( () => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      console.log(searchParams.toString())
      const res = await getAdminDashboard(token, searchParams.toString());
      setData(res.total);
      setCourses(res.courses)
      console.log(res)
    }
    fetchData()
  },[searchParams])

  return (
    <AdminLayout activeTab="dashboard"> 
      <div className="p-8 bg-slate-50 min-h-screen">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-4xl font-bold text-indigo-900">
              System Overview
            </p>
            <p className="text-gray-500 mt-2">
              Real-time platform performance and learner engagement metrics.
            </p>
          </div>
        </div>

        {/* Statistic Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
              <FaUsers />
            </div>
            <p className="text-gray-500 mt-4">Total Users</p>
            <h2 className="text-3xl font-bold text-indigo-900">{data?.totalUsers}</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <FaBookOpen />
            </div>
            <p className="text-gray-500 mt-4">Active Courses</p>
            <h2 className="text-3xl font-bold text-indigo-900">{data?.activeCourses}</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-500">
              <FaClipboardCheck />
            </div>
            <p className="text-gray-500 mt-4">Pending Approvals</p>
            <h2 className="text-3xl font-bold text-indigo-900">{data?.pendingApprovals}</h2>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-indigo-900">Course Approvals</h2>
          <p className="text-gray-500 mt-2">
            Review and verify courses submitted by lecturers.
          </p>
        </div>

        {/* Filter Box */}
        <div className="bg-white border rounded-xl p-5 mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <FaFilter />
            Filter by:
          </div>
          
          {/* 3. Dropdown setup linked to URL parameters */}
          <select
            name="category"
            value={currentCategory} 
            onChange={handleFilterChange} 
            className="border rounded-lg px-4 py-2 bg-white"
          >
            <option value="">All Categories</option>
            {Array.isArray(categories) &&
              categories.map((c) => (
                <option key={c.category_id} value={c.category_name}>
                  {c.category_name}
                </option>
              ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr className="text-left text-gray-600 text-sm">
                <th className="px-6 py-4">Lecturer</th>
                <th>Course Title</th>
                <th>Price</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((course) => (
                <tr key={course.id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-5">
                    <div>
                      <h4 className="font-semibold text-indigo-900">{course.full_name}</h4>
                      <p className="text-sm text-gray-500">{course.specialization}</p>
                    </div>
                  </td>
                  <td className="font-medium text-gray-700">{course.title}</td>
                  <td className = 'text-md text-white pr-4'>
                    <span className  = "p-2 bg-green-500 rounded-lg ">{course.price == 0 ? 'Free': "$"+course.price }</span></td>
                  <td>{handleDate(course.created_at)}</td>
                  <td>
                    <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      Pending
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center items-center gap-3">
                      <button className="text-gray-500 hover:text-indigo-700" 
                      onClick={ () => { setIsReview(true) 
                        setSelectCourse(course)    
                        console.log(selectCourse) 
                        }}>
                        <FaEye  />
                      </button>
                      <button className="border border-red-400 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm"
                      onClick = { ()=> { handleApproval('reject', course.course_id)}}>
                        Reject
                      </button>
                      <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm"
                      onClick = { ()=> { handleApproval('active', course.course_id)}}>
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              { isReview && selectCourse && < ReviewVideo onClose={ () => setIsReview(false)} 
                title = { selectCourse.title} videoUrl={selectCourse.video_id} onApprove={() => handleApproval('active', selectCourse.course_id)}  />}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}