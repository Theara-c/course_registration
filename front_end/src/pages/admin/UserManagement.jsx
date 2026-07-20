import { useEffect, useState } from "react";
import { FaChalkboardTeacher, FaUserGraduate, FaPlus } from "react-icons/fa";
import AdminLayout from "./adminLayout";
import { useSearchParams } from "react-router-dom";
import { getUserManagement } from "../../api/adminAPI.js";

import CreateLecturer from "./CreateLecture.jsx";
export default function UserManagement() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentRole = searchParams.get('role') || '';
    const [ data, setData] = useState([]);
    const [user, setUser] = useState([]);
    const [ totalPages, setTotalPage] = useState(1);
    const page = Number(searchParams.get("page")) || 1;
    const [ create, setCreate] = useState(false);

    const handleFilterChange = (e) => {
    const value = e.target.value;

    if (value) {
      searchParams.set("role", value);
    } else {
      searchParams.delete("role"); 
    }
    setSearchParams(searchParams);
  };
  useEffect( () => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      const res = await getUserManagement(token, searchParams.toString());
      setData(res.statistics);
      setUser(res.users)
      setTotalPage(res.totalPages)
      console.log(res)
    }
    fetchData()
  }, [searchParams])
    const handleDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  // Pagination 
    const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <AdminLayout activeTab='user'>
    <div className="bg-slate-50 min-h-screen p-8">

      {/* Header */}
      <div className="flex justify-between items-start mb-8">

        <div>
          <p className="text-4xl font-bold text-indigo-900">
            User Management
          </p>

          <p className="text-gray-500 mt-2">
            Manage your community of learners and lecturers.
          </p>
        </div>

        <button className="bg-indigo-900 hover:bg-indigo-800 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        onClick = { () => {setCreate(true)
        }}>
          <FaPlus />
          Create lecturer account
        </button>

      </div>
          { create && 
    <CreateLecturer onClose={() =>setCreate(false)} /> }

      {/* Cards */}

      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-xl border p-6 shadow-sm">

          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
            <FaChalkboardTeacher />
          </div>

          <p className="text-gray-500 mt-4">
            Total Lecturers
          </p>

          <h2 className="text-3xl font-bold text-indigo-900">
            {data?.totalLecturers}
          </h2>

        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">

          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <FaUserGraduate />
          </div>

          <p className="text-gray-500 mt-4">
            Total Students
          </p>

          <h2 className="text-3xl font-bold text-indigo-900">
            {data?.totalStudents}
          </h2>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        {/* Toolbar */}

        <div className="flex justify-between items-center p-5 border-b">

          <div>

            <p className="text-sm text-gray-500 mb-2">
              Filter by Role
            </p>

            <select
              value={currentRole}
              onChange={handleFilterChange}
              className="border rounded-lg px-4 py-2"
            >
              <option>All</option>
              <option value = "student">Student</option>
              <option value = 'lecturer'>Lecturer</option>
            </select>

          </div>
        </div>

        {/* Table */}

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr className="text-left text-gray-600 text-sm">

              <th className="px-6 py-4">User ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Join Date</th>

            </tr>

          </thead>

          <tbody>

            {user?.map((user) => (

              <tr
                key={user.user_id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-6 py-5 font-medium text-indigo-700">
                  {user.user_id}
                </td>

                <td className="font-semibold">
                  {user.full_name}
                </td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.user_role === "lecturer"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {user.user_role}
                  </span>

                </td>

                <td>{user.email}</td>

                <td>{handleDate(user.create_at)}</td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* Footer */}

    <div className="flex justify-center items-center gap-2 mt-12">
        <button
          className="w-8 h-8 border rounded text-gray-500"
          disabled={page === 1}
          onClick={() => {
            if (page > 1) {
              setSearchParams({
                page: page - 1,
                search: searchParams.get("search"),
              });
            }
          }}
        >
          ‹
        </button>

        {getPages().map((p, i) => (
          <button
            key={i}
            className={`w-8 h-8 ${page === p ? "bg-[#142175] text-white rounded" : "border rounded"}`}
            onClick={() => {
              setSearchParams({
                page: p,
                search: searchParams.get("search")
                  ? searchParams.get("search")
                  : "",
              });
            }}
          >
            {p}
          </button>
        ))}

        <button
          className="w-8 h-8 border rounded text-gray-500"
          disabled={page >= totalPages}
          onClick={() => {
            if (page < totalPages) {
              setSearchParams({
                page: page + 1,
                search: searchParams.get("search"),
              });
            }
          }}
        >
          ›
        </button>
      </div>

      </div>

    </div>

    </AdminLayout>
  );
}