import { useParams, useNavigate } from "react-router-dom";
import Confirmation from "../component/Confirmation.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { getCourseById } from "../api/courseApi";
import { toast } from "react-toastify";
import { createEnrollment } from "../api/enrollmentAPI";
import  useAuth from "../hooks/useAuth"
function CourseDetail() {
  const [isEnroll, setIsEnroll] = useState(false);
  const [isRequest, setIsRequest] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [paid, setPaid] = useState(true);
  const [data, setData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const fetchCourseById = async (id) => {
    try {
      const c = await getCourseById(id);
      setData(c);
      setPaid(c.price > 0);
    } catch (error) {
      console.log({ msg: "Error fetching" }, error);
    }
  };

  useEffect(() => {
    fetchCourseById(id);
  }, [id]);

  async function createEnrollmentRecord (status) {
    try {
      const res = await createEnrollment( user?.user_id,id, status );
      console.log(res)
    } catch (err) {
      console.log( { msg: "Error create enrollment", err})
    }

  }
  const handleConfirm = async () => {
    setConfirm(false);
    setIsEnroll(true);
    console.log("paid", paid)
    let status;
    if (!paid) {
      status = "enrolled"
    } else {
      status = "waiting"
    }
    const res = await createEnrollmentRecord(status);
    console.log(res);
    if ( status === "waiting") {
      setIsRequest(true);
    }
    toast.success("Enrolled Successfully.");
  }

  const secondToHMS = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}min ${s}s`;
  };
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-16">
        {/* Left */}
        <div className="my-4">
          <p className=" text-3xl font-bold text-black flex justify-content items-center ">
            {data.title}
          </p>

          <p className=" text-black text-[20px]">{data.sub_description}</p>
          {/* additional info */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-10 mt-6 text-gray-600">
            <div className="flex items-center gap-2">
              <span> 💻Online Course</span>
            </div>

            <div className="flex items-center gap-2">
              <span>⏰ {secondToHMS(data.duration)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>🎓 Certificate</span>
            </div>

            <div className="flex items-center gap-2">
              <span>💬 Mentor Support</span>
            </div>
          </div>
          {/* Instructor */}
          <div className="flex items-center gap-4 mt-7 ">
            <i className="fa-solid fa-circle-user text-4xl text-[#142175] mb-5"></i>

            <div className="mb-5">
              <h4 className="font-bold text-black ">{data.full_name}</h4>

              <p className="text-gray-500 text-sm">{data.specialization}</p>
            </div>
          </div>

          <p className="text-lg text-black mt-10">About this course</p>

          <p className="mt-7 text-black leading-10 text-[19px]">
            {data.description}
          </p>
        </div>

        {/* Right */}
        <div className="flex  flex-col items-center">
          <div
            className="bg-white rounded-2xl overflow-hidden shadow border w-8/10  "
            id="move"
          >
            <img
              src={`https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg`}
              alt="thumbnail"
              className="w-full h-64 object-cover"
            />

            <div className="p-5">
              <div className="flex justify-between items-center">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                  {data.category_name}
                </span>

                <span>⭐ {data.rating ? parseInt(data.rating) : 3}</span>
              </div>

              <p className=" text-xl mt-5 text-black font-semibold">
                {data.title}
              </p>

              <p className="text-black mt-3">{data.sub_description}</p>
              <div className="flex items-center justify-between">
                <p className="text-[#142175] font-bold text-lg">Price:</p>
                <p className="text-lg font-bold text-black "> ${data.price}</p>
              </div>
            </div>
          </div>
          {!paid ? (
            <button
              className="block mt-8 bg-[#142175] text-white text-center py-4 rounded-full text-sm font-medium w-5/10
              cursor-pointer "
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error("Please login to enroll in the course.");
                  navigate("/login");
                  return;
                }
                if (!isEnroll ){
                  setConfirm(true)
                } else {
                  navigate(`/courses/${id}/watch`)
                }
              }}
            >
              {isEnroll ? (
                <p >
                  Preview Course →
                </p>
              ) : (
                <p>Enroll Now →</p>
              )}
            </button>
          ) : (
            <button
              className="block mt-8 bg-[#142175] text-white text-center py-4 rounded-full text-sm font-medium w-5/10
              cursor-pointer "
              onClick={() => 
                {if (!isRequest){
                  setConfirm(true)
                } 
              }}
            >
              {!isRequest ? <p>Request to enroll</p> : <p>Pending...</p>}
            </button>
          )}
          {/* confirmation */}
          {confirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-gray-800">
        Are you sure?
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        This action cannot be undone. Do you want to continue?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setConfirm(false)}
          className="rounded-lg border bg-red-600 text-white border-gray-300 px-4 py-2 t transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={() => handleConfirm()}
          className="rounded-lg bg-green-600 border px-4 py-2 text-white transition cursor-pointer"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}
          {isRequest && (
            <button
              className={`block mt-8 bg-[#142175] text-white text-center py-4 rounded-full text-sm font-medium w-4/10
            cursor-pointer`}
              onClick={() => setIsRequest(true)}
            >
              {isRequest && (
                <a href="https://telegram.org">
                  <p>Contact via telegram</p>
                </a>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
