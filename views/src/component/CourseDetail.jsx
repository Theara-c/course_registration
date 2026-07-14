import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}
function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;
  const isStudent = user?.user_role === "Student";
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/student/courses/${id}`, authHeaders())
      .then((res) => {
        setCourse(res.data.course);
        setEnrollment(res.data.enrollment);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Course not found");
        navigate("/courses");
      })
      .finally(() => setLoading(false));
  }, [id, navigate, isStudent]);

  const price = Number(course?.price) || 0;
  const isPaid = price > 0;

  async function doEnroll(paymentConfirmed) {
    setEnrolling(true);
    try {
      await axios.post(
        `http://localhost:8000/api/student/courses/${id}/enroll`,
        { payment_confirmed: paymentConfirmed },
        authHeaders(),
      );
      toast.success(
        paymentConfirmed
          ? "Payment successful — you're enrolled!"
          : "Enrolled successfully!",
      );
      setShowCheckout(false);
      // Reload to update enrollment status
      const res = await axios.get(
        `http://localhost:8000/api/student/courses/${id}`,
        authHeaders(),
      );
      setEnrollment(res.data.enrollment);
    } catch (err) {
      toast.error(err.response?.data?.error || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  }

  async function handleEnroll() {
    if (!isLoggedIn) {
      toast.error("You must be logged in to enroll in a course.");
      navigate("/login");
      return;
    }
    if (!isStudent) {
      toast.error("Only students can enroll in courses.");
      return;
    }
    if (isPaid) {
      // Paid course — open checkout instead of enrolling immediately
      setShowCheckout(true);
      return;
    }
    doEnroll(false);
  }
  function handleWatch() {
    navigate(`/courses/${id}/watch`);
  }
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading course details...
      </div>
    );
  }
  if (!course) return null;
  const videoId = course.video_id;
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-16">
        {/* Left */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
              {course.category}
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                isPaid
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {isPaid ? `Premium · $${price}` : "Free"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-black mt-4">{course.title}</h1>
          <p className="text-black text-lg mt-3">
            {course.sub_description || course.description}
          </p>
          {/* additional info */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-10 mt-6 text-gray-600">
            <div className="flex items-center gap-2">
              <span> 💻Online Course</span>
            </div>

            <div className="flex items-center gap-2">
              <span>
                ⏰ {course.duration ? `${course.duration} min` : "Self-paced"}
              </span>
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
              <h4 className="font-bold text-black ">
                {course.instructor_name}
              </h4>

              <p className="text-gray-500 text-sm">
                {course.specialization || "Instructor"}
              </p>
            </div>
          </div>

          <p className="text-lg text-black mt-10">About this course</p>

          <p className="mt-7 text-black leading-10 text-[19px]">
            {course.description}
          </p>
        </div>

        {/* Right */}
        <div className="flex  flex-col items-center">
          <div className="bg-white rounded-2xl overflow-hidden shadow border w-8/10  ">
            {videoId ? (
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="Course thumbnail"
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                <i className="fa-solid fa-photo-film text-4xl text-gray-400"></i>
              </div>
            )}

            <div className="p-5">
              <div className="flex justify-between items-center">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                  {course.category}
                </span>
              </div>

              <p className=" text-xl mt-5 text-black font-semibold">
                {course.title}
              </p>

              <p className="text-black mt-3">
                {course.description || course.sub_description}
              </p>
            </div>
          </div>
          {/* Action button — changes based on enrollment status */}
          <div className="mt-6 w-full max-w-sm space-y-3">
            {enrollment ? (
              // Already enrolled — show Watch button
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 text-center font-medium">
                  ✅ You are enrolled — {enrollment.status}
                </div>
                <button
                  onClick={handleWatch}
                  className="block w-full bg-[#142175] text-white text-center py-4 rounded-full text-sm font-medium cursor-pointer hover:bg-[#0d185a] transition"
                >
                  ▶ Watch Course
                </button>
              </>
            ) : isStudent ? (
              // Student but not enrolled — show Enroll button (price-aware)
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className={`block w-full text-white text-center py-4 rounded-full text-sm font-medium cursor-pointer transition disabled:opacity-60 ${
                  isPaid
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-[#142175] hover:bg-[#0d185a]"
                }`}
              >
                {enrolling
                  ? "Enrolling..."
                  : isPaid
                    ? `Enroll — $${price} →`
                    : "Enroll Free →"}
              </button>
            ) : !isLoggedIn ? (
              // Not logged in — prompt login
              <button
                onClick={() => navigate("/login")}
                className="block w-full bg-[#142175] text-white text-center py-4 rounded-full text-sm font-medium cursor-pointer hover:bg-[#0d185a] transition"
              >
                Log in to Enroll →
              </button>
            ) : (
              // Logged in as Lecturer/Admin — just preview
              <button
                onClick={handleWatch}
                className="block w-full border border-[#142175] text-[#142175] text-center py-4 rounded-full text-sm font-medium cursor-pointer hover:bg-[#142175] hover:text-white transition"
              >
                ▶ Preview Course
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Checkout modal — mock payment step for Premium courses */}
      {showCheckout && (
        <CheckoutModal
          course={course}
          price={price}
          submitting={enrolling}
          onCancel={() => setShowCheckout(false)}
          onConfirm={() => doEnroll(true)}
        />
      )}
    </div>
  );
}

// Simple mock checkout — this project has no real payment processor
// connected, so this simulates one: it validates basic card-shaped
// input, then calls the enroll endpoint with payment_confirmed: true.
function CheckoutModal({ course, price, submitting, onCancel, onConfirm }) {
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (
      card.number.replace(/\s/g, "").length < 12 ||
      !card.expiry ||
      card.cvc.length < 3 ||
      !card.name.trim()
    ) {
      toast.error("Please fill in all card details.");
      return;
    }
    onConfirm();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-black">Complete Purchase</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-1">{course.title}</p>
        <p className="text-2xl font-bold text-[#142175] mb-5">${price}</p>

        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg p-3 flex items-start gap-2">
          <i className="fa-solid fa-circle-info mt-0.5"></i>
          <span>
            Demo checkout — no real payment is processed. Any card-shaped input
            will work.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name on card"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#142175]"
          />
          <input
            type="text"
            placeholder="Card number"
            value={card.number}
            onChange={(e) => setCard({ ...card, number: e.target.value })}
            maxLength={19}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#142175]"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="MM/YY"
              value={card.expiry}
              onChange={(e) => setCard({ ...card, expiry: e.target.value })}
              maxLength={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#142175]"
            />
            <input
              type="text"
              placeholder="CVC"
              value={card.cvc}
              onChange={(e) => setCard({ ...card, cvc: e.target.value })}
              maxLength={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#142175]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#142175] hover:bg-[#0d185a] text-white py-3 rounded-lg font-medium transition disabled:opacity-60"
          >
            {submitting ? "Processing..." : `Pay $${price} & Enroll`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CourseDetail;
