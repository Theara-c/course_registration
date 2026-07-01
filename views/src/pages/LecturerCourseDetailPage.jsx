import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Note: Ensure this base route pattern matches your backend Router mount paths
const API_URL = "http://localhost:8000/api/lecturer";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export default function LecturerCourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    video_id: "",
  });
  const [saving, setSaving] = useState(false);

  // ── Memoized Data Fetcher Block to satisfy ESLint rule ──
  const loadData = useCallback(() => {
    axios
      .get(`${API_URL}/courses/${id}`, authHeaders())
      .then((res) => {
        const courseData = res.data.course || res.data;
        setCourse(courseData);
        // Break object reference matching so canceling edits doesn't alter active states
        setForm({ ...courseData });
        setStudents(res.data.students || []);
        setRatings(res.data.ratings || []);
      })
      .catch((err) => {
        console.error("❌ Data retrieval failure:", err);
        toast.error("Failed to fetch course metrics.");
      });
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Action: Update ──
  async function handleSaveEdit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_URL}/courses/${id}`, form, authHeaders());
      toast.success("Course updated successfully");
      setEditing(false);
      loadData();
    } catch (err) {
      console.error("❌ Update failure:", err);
      toast.error(
        err.response?.data?.error || "Failed to update course details",
      );
    } finally {
      setSaving(false);
    }
  }

  // ── Action: Publish ──
  async function handlePublish() {
    try {
      await axios.put(`${API_URL}/courses/${id}/publish`, {}, authHeaders());
      toast.success("Course is now live for students");
      loadData();
    } catch (err) {
      console.error("❌ Publish operation error:", err);
      toast.error(err.response?.data?.error || "Failed to publish course");
    }
  }

  // ── Action: Unpublish ──
  async function handleUnpublish() {
    try {
      await axios.put(`${API_URL}/courses/${id}/unpublish`, {}, authHeaders());
      toast.success("Course hidden from students");
      loadData();
    } catch (err) {
      console.error("❌ Unpublish operation error:", err);
      toast.error("Failed to unpublish course");
    }
  }

  // ── Action: Delete ──
  async function handleDelete() {
    if (
      !confirm(`Delete "${course.title}" permanently? This cannot be undone.`)
    )
      return;
    try {
      await axios.delete(`${API_URL}/courses/${id}`, authHeaders());
      toast.success("Course deleted");
      navigate("/lecturer/dashboard");
    } catch (err) {
      console.error("❌ Delete path runtime error:", err);
      toast.error("Failed to delete records");
    }
  }

  if (!course)
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading course metrics...
      </p>
    );

  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <Link
        to="/lecturer/dashboard"
        className="text-sm text-gray-500 hover:text-[#142175] mb-6 inline-flex items-center gap-1"
      >
        <i className="fa-solid fa-arrow-left"></i> Back to My Courses
      </Link>

      {/* ── Header Card Layout ── */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{course.title}</h1>
            <p className="text-sm text-gray-500">{course.category}</p>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              course.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {course.status}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-5">{course.description}</p>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              setEditing(!editing);
              if (editing) setForm({ ...course }); // Rollback inputs if canceled
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
          >
            <i className="fa-solid fa-pen mr-2"></i>
            {editing ? "Cancel Edit" : "Edit Course"}
          </button>

          {course.status === "Inactive" || course.status === "Draft" ? (
            <button
              onClick={handlePublish}
              className="px-4 py-2 rounded-lg bg-[#142175] text-white text-sm font-medium hover:bg-[#0d185a]"
            >
              <i className="fa-solid fa-upload mr-2"></i> Publish Course
            </button>
          ) : (
            <button
              onClick={handleUnpublish}
              className="px-4 py-2 rounded-lg border border-yellow-400 text-yellow-700 text-sm font-medium hover:bg-yellow-50"
            >
              <i className="fa-solid fa-eye-slash mr-2"></i> Unpublish
            </button>
          )}

          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50"
          >
            <i className="fa-solid fa-trash mr-2"></i> Delete Course
          </button>
        </div>
      </div>

      {/* ── Edit Form Context Block ── */}
      {editing && (
        <form
          onSubmit={handleSaveEdit}
          className="bg-white rounded-xl shadow-sm border p-6 mb-6 space-y-4"
        >
          <div>
            <label className="text-xs text-gray-500 block mb-1 uppercase font-medium">
              Title
            </label>
            <input
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#142175]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1 uppercase font-medium">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#142175]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1 uppercase font-medium">
              Video ID (YouTube Key)
            </label>
            <input
              value={form.video_id || ""}
              onChange={(e) => setForm({ ...form, video_id: e.target.value })}
              placeholder="e.g., u31qwQUeGuM"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#142175]"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#142175] text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-[#0d185a]"
          >
            {saving ? "Saving changes..." : "Save Changes"}
          </button>
        </form>
      )}

      {/* ── Enrolled Students Matrix View ── */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">
          Enrolled Students ({students.length})
        </h2>
        {students.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No students enrolled yet.
          </p>
        ) : (
          <div className="divide-y">
            {students.map((s) => (
              <div
                key={s.enrollment_id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-800">{s.full_name}</p>
                  <p className="text-gray-500 text-xs">{s.email}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    s.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : s.status === "Cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Ratings Feed Block ── */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="font-bold text-gray-800 mb-4">
          Student Feedback ({ratings.length})
        </h2>
        {ratings.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No feedback published yet.
          </p>
        ) : (
          <div className="divide-y">
            {ratings.map((r) => (
              <div key={r.rating_id} className="py-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800">
                    {r.full_name}
                  </span>
                  <span className="text-yellow-500">
                    {"★".repeat(r.rating)}
                  </span>
                </div>
                <p className="text-gray-500">{r.feedback}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
