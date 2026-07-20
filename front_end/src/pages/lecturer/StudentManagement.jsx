import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Check,
  X,
} from "lucide-react";
import { getCourseEnrollment } from "../../api/lecturerAPI";
import LecturerLayout from "../../component/LecturerLayout";
import { useNavigate } from "react-router-dom";
import { updateStatus } from "../../api/enrollmentAPI";
import { toast } from "react-toastify";

export default function StudentManagement() {
  const [tab, setTab] = useState("students");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('status') || '';
  const [data, setData] = useState([]);
  const {id} = useParams();
  const token = localStorage.getItem('accessToken');
  const isFree = ( data.price == 0) ? true : false;
      const handleFilterChange = (e) => {
    const value = e.target.value;

    if (value) {
      searchParams.set("status", value);
    } else {
      searchParams.delete("status"); 
    }
    setSearchParams(searchParams);
  };
  useEffect( () => {
    const fetchData =  async () => {
      const res = await getCourseEnrollment(token, id, searchParams.toString());
      console.log(res);
      setData(res);
    }
    fetchData()

  }, [id, searchParams])
      const handleDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleRequest = async (user_id,id, mode) => {
    const res = await updateStatus(user_id, id, mode, token);
    console.log(res);
    toast.success(res.msg);
setData((pre) => {
  return {
    ...pre, 
    students: pre.students.filter((s) => s.course_id !== id) 
  };
});
  }

  return (
    <LecturerLayout > 
      <button
        onClick={() => navigate(-1)}
        className="inline-flex ml-8 mt-10 items-center gap-2 bg-[#142175] text-white px-4 py-2 rounded-full cursor-pointer hover:bg-opacity-90 transition"
      >
        ← Back
      </button>
    <div className="space-y-6 mr-5 mt-8 ml-10">

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className  = "gap-3">
              <p className="text-xs text-gray-500 uppercase">
                Total Students
              </p>

              <h2 className="text-4xl font-bold text-indigo-700 mt-2">
                {data.totalStudents}
              </h2>

            </div>

            <Users className="text-indigo-700" />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">
                Avg. Progress
              </p>

              <h2 className="text-4xl font-bold text-indigo-700 mt-2">
                {data.averageProgress}%
              </h2>
            </div>

            <TrendingUp className="text-indigo-700" />
          </div>
        </div>
      </div>

      {/* Tabs */}

      <div className="flex justify-between items-center">

        <div className="flex gap-3">

          <button
            onClick={() => {setTab("students")
              searchParams.delete('status')
              setSearchParams(searchParams);
            }}
            className={`px-5 py-2 rounded-lg border ${
              tab === "students"
                ? "bg-indigo-600 text-white"
                : "bg-white"
            }`}
          >
            Enrolled Students
          </button>

          { !isFree &&
           <button
            onClick={() => {setTab("requests")
              searchParams.set('status', 'waiting')
              setSearchParams(searchParams);
            }}
            className={`px-5 py-2 rounded-lg border ${
              tab === "requests"
                ? "bg-indigo-600 text-white"
                : "bg-white"
            }`}
          >
            Enrollment Requests
          </button>
           } 

        </div>

        {tab === "students" && (
          <select className="border rounded-lg px-4 py-2"
           onChange = { handleFilterChange}
           value = { mode}
           >
            <option >All</option>
            <option value = "enrolled">In Progress</option>
            <option value = "completed">Completed</option>
          </select>
        )}
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border bg-white">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr className="text-left text-sm text-gray-600">

              <th className="p-4">#</th>
              <th>Student ID</th>
              <th>Course ID</th>
              <th>Student Name</th>

              {tab === "students" ? (
                <>
                  <th>Enrollment Date</th>
                  <th>Progress</th>
                  <th>Status</th>
                </>
              ) : (
                <>
                  <th>Request Date</th>
                  <th>Action</th>
                </>
              )}
            </tr>

          </thead>

          <tbody>

            {tab === "students" &&
              data.students?.map((student, index) => (
                <tr key={student.user_id} className="border-t">

                  <td className="p-4">{index + 1}</td>

                  <td>{student.user_id}</td>
                  <td>{student.course_id}</td>

                  <td className="font-medium">
                    {student.full_name}
                  </td>

                  <td>{handleDate(student.enrolled_at)}</td>

                  <td className="w-72">

                    <div className="flex items-center gap-3">

                      <span className="font-semibold text-indigo-700">
                        {student.progress}%
                      </span>

                    </div>

                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.status === "Completed"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {student.status}
                    </span>

                  </td>

                </tr>
              ))}

            {tab === "requests" &&
              data.students?.map((student, index) => (
                <tr key={student.user_id} className="border-t">

                  <td className="p-4">{index + 1}</td>

                  <td>{student.user_id}</td>
                  <td>{student.course_id}</td>

                  <td>{student.full_name}</td>
                  <td>{handleDate(student.enrolled_at)}</td>
                  <td>
                    <div className="flex gap-2">

                      <button className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                        onClick = { () => handleRequest(student.user_id,student.course_id, 'reject')} 
                      >
                        <X size={16} 
                        />
                        Reject
                      </button>

                      <button className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                      
                        onClick = { () => handleRequest(student.user_id,student.course_id, 'enrolled')}
                      >
                        <Check size={16}
                         />
                        Approve
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

          </tbody>

        </table>

      </div>
    </div>
    </LecturerLayout>
  );
}