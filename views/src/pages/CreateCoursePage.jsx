import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/lecturer";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export default function CreateCoursePage() {
  const navigate = useNavigate();
  // Read user ID from localStorage so "Back to My Courses" links to the correct dashboard URL
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    sub_description: "",
    videoURL: "",
    duration: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Mandatory Frontend Validation
    if (!form.title.trim()) {
      toast.error("Course title is required");
      return;
    }
    if (!form.category.trim()) {
      toast.error("Category is required");
      return;
    }

    setSaving(true);

    // 2. Format Payload to avoid data type mismatch errors
    const processedPayload = {
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim() || null,
      sub_description: form.sub_description.trim() || null,
      videoURL: form.videoURL.trim() || null, // Convert empty strings to null safely
      // Convert duration string safely to a structured integer radix
      duration: form.duration ? parseInt(form.duration, 10) : 0,
    };

    try {
      const res = await axios.post(
        `${API_URL}/courses`,
        processedPayload,
        authHeaders(),
      );
      toast.success("Course created successfully!");

      // Safety check: ensure dynamic redirect reads valid database response keys
      const targetId = res.data.course_id || res.data.id;
      navigate(`/lecturer/courses/${targetId}`);
    } catch (err) {
      console.error("Course Creation Error Info:", err.response?.data);
      toast.error(err.response?.data?.error || "Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-10">
      <Link
        to={`/lecturer/${user.user_id}/dashboard`}
        className="text-sm text-gray-500 hover:text-[#142175] mb-6 inline-flex items-center gap-1"
      >
        ← Back to My Courses
      </Link>

      <h1 className="text-2xl font-bold text-[#142175] mb-1">
        Create New Course
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Step 1 of 3 — fill in the details below, then add a video link and
        publish when ready.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border p-6 space-y-5"
      >
        {/* 1. Title */}
        <div>
          <label className="text-xs text-gray-500 block mb-1 uppercase font-medium">
            Course Title *
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Advanced React Patterns"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#142175]"
          />
        </div>

        {/* 2. Category */}
        <div>
          <label className="text-xs text-gray-500 block mb-1 uppercase font-medium">
            Category *
          </label>
          <input
            type="text"
            name="category"
            placeholder="e.g. Web Development"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#142175]"
          />
        </div>

        {/* 3. Short summary */}
        <div>
          <label className="text-xs text-gray-500 block mb-1 uppercase font-medium">
            Short Summary
          </label>
          <input
            type="text"
            name="sub_description"
            placeholder="One sentence shown on the course card"
            value={form.sub_description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#142175]"
          />
        </div>

        {/* 4. Full description */}
        <div>
          <label className="text-xs text-gray-500 block mb-1 uppercase font-medium">
            Full Description
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="What will students learn in this course?"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#142175]"
          />
        </div>

        {/* 5. Video link */}
        <div>
          <label className="text-xs text-gray-500 block mb-1 uppercase font-medium">
            Video Link (YouTube)
          </label>
          <input
            type="text"
            name="videoURL"
            placeholder="https://www.youtube.com/watch?v=..."
            value={form.videoURL}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#142175]"
          />
          <p className="text-xs text-gray-400 mt-1">
            You can leave this blank and add it later — but you'll need it
            before publishing.
          </p>
        </div>

        {/* 6. Duration */}
        <div>
          <label className="text-xs text-gray-500 block mb-1 uppercase font-medium">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            placeholder="e.g. 180"
            value={form.duration}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#142175]"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#142175] hover:bg-[#0d185a] text-white py-3 rounded-lg font-medium transition disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Creating..." : "Save as Draft"}
        </button>
      </form>
    </section>
  );
}
