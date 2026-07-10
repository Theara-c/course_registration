import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function extractYouTubeId(url) {
  if (!url) return "";
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : url;
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

function Video() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [completing, setCompleting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isStudent = user?.user_role === "Student";

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/student/courses/${id}`, authHeaders())
      .then(async (res) => {
        setCourse(res.data.course);
        setEnrollment(res.data.enrollment);

        // Mark as watched when student opens the video
        if (res.data.enrollment && isStudent) {
          axios
            .put(
              `http://localhost:8000/api/student/enrollments/${res.data.enrollment.enrollment_id}/watch`,
              {},
              authHeaders(),
            )
            .catch(() => {});
        }
      })
      .catch(() => {
        toast.error("Course not found");
        navigate("/courses");
      })
      .finally(() => setLoading(false));
  }, [id, navigate, isStudent]);

  async function handleSubmitRating() {
    if (!enrollment) return;
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmittingRating(true);
    try {
      await axios.post(
        `http://localhost:8000/api/student/enrollments/${enrollment.enrollment_id}/rating`,
        { rating, feedback },
        authHeaders(),
      );
      toast.success("Rating submitted — thank you!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  }

  async function handleComplete() {
    if (!enrollment) return;
    setCompleting(true);
    try {
      await axios.put(
        `http://localhost:8000/api/student/enrollments/${enrollment.enrollment_id}/complete`,
        {},
        authHeaders(),
      );
      toast.success("Course marked as completed! 🎉");
      setEnrollment({ ...enrollment, status: "Completed" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to mark as completed");
    } finally {
      setCompleting(false);
    }
  }

  if (loading)
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!course) return null;

  const videoId = extractYouTubeId(course.videoURL);

  return (
    <div className="h-100%">
      {/* Back */}
      <button
        onClick={() => navigate(`/courses/${id}/course_detail`)}
        className="inline-flex ml-10 mt-5 items-center gap-2 bg-[#142175] text-white px-4 py-2 rounded-full cursor-pointer hover:bg-[#0d185a] transition"
      >
        ← Back
      </button>
      <div className="max-w-6xl mx-auto px-6 flex flex-col justify-center items-start">
        {/* Video */}
        <div className="mt-5 w-80/100 h-100 bg-black mb-3">
          {videoId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={course.title}
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <i className="fa-solid fa-video-slash text-5xl mb-4 opacity-60"></i>
                <p className="text-lg opacity-60">
                  No video available for this course yet
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <p className="text-2xl text-black font-medium ">{course.title}</p>

        {/* Instructor */}
        <div className="flex items-center gap-4 mt-5 ">
          <i className="fa-solid fa-circle-user text-4xl text-[#142175] mb-5"></i>

          <div className="mb-5">
            <h4 className="font-bold text-black ">{course.instructor_name}</h4>

            <p className="text-gray-500 text-sm">
              {course.specialization || "Instructor"}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-black  max-w-2xl leading-8">
          {course.description}
        </p>

        {/* Student-only actions */}
        {isStudent && enrollment && (
          <div className="mt-8 w-full max-w-2xl space-y-6">
            {/* Enrollment status */}
            <div
              className={`px-4 py-3 rounded-lg text-sm font-medium ${
                enrollment.status === "Completed"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-blue-50 border border-blue-200 text-blue-700"
              }`}
            >
              Status: {enrollment.status}
              {enrollment.last_watched && (
                <span className="ml-4 text-xs opacity-70">
                  Last watched:{" "}
                  {new Date(enrollment.last_watched).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Mark as Complete */}
            {enrollment.status !== "Completed" && (
              <button
                onClick={handleComplete}
                disabled={completing}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-60"
              >
                {completing ? "Marking..." : "✅ Mark as Completed"}
              </button>
            )}

            {/* Rating */}
            <div className="bg-gray-50 border rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-3">Rate this Course</h3>

              {/* Star selector */}
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition ${star <= rating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`}
                  >
                    ★
                  </button>
                ))}
                {rating > 0 && (
                  <span className="text-sm text-gray-500 ml-2 self-center">
                    {rating}/5
                  </span>
                )}
              </div>

              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your feedback (optional)..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#142175] resize-none"
              />

              <button
                onClick={handleSubmitRating}
                disabled={submittingRating || rating === 0}
                className="mt-3 bg-[#142175] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0d185a] transition disabled:opacity-50"
              >
                {submittingRating ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </div>
        )}

        {/* Non-enrolled student warning */}
        {isStudent && !enrollment && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-700">
            You are not enrolled in this course.{" "}
            <button
              onClick={() => navigate(`/courses/${id}/course_detail`)}
              className="underline font-medium"
            >
              Enroll now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Video;
