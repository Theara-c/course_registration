import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/lecturer";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

function extractYouTubeId(input) {
  if (!input) return null;
  const value = input.trim();
  if (!value) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = value.match(regExp);
  return match && match[2] && match[2].length === 11 ? match[2] : null;
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
    video_id: "",
    duration: "",
    price: 0,
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
    const cleanVideoId = extractYouTubeId(form.video_id);
    if (!form.video_id.trim()) {
      toast.error(
        "An intro video is required — the Admin needs something to review.",
      );
      return;
    }
    if (!cleanVideoId) {
      toast.error("That doesn't look like a valid YouTube link or video ID.");
      return;
    }

    setSaving(true);

    // 2. Format Payload to avoid data type mismatch errors
    const processedPayload = {
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim() || null,
      sub_description: form.sub_description.trim() || null,
      video_id: form.video_id.trim() || null, // Convert empty strings to null safely
      // Convert duration string safely to a structured integer radix
      duration: form.duration ? parseInt(form.duration, 10) : 0,
      price: Number(form.price) || 0, // Ensure price is a number
      status: "Pending", // Forces submission sequence rule
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
    <div className="min-h-screen bg-[#080B24]">
      <section className="max-w-2xl mx-auto px-6 py-10">
        <Link
          to={`/lecturer/${user.user_id}/dashboard`}
          className="text-sm text-slate-400 hover:text-[#6C63FF] mb-6 inline-flex items-center gap-1"
        >
          ← Back to My Courses
        </Link>

        <h1 className="text-2xl font-bold text-[#F8FAFC] mb-1">
          Create New Course
        </h1>
        <p className="text-[#94A3B8] text-sm mb-8">
          Fill in the details below — including your intro video — and it goes
          straight to an Admin for review.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-[#171B46] rounded-xl shadow-sm border border-[#6C63FF]/20 p-6 space-y-5"
        >
          {/* 1. Title */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 uppercase font-medium">
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Advanced React Patterns"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-[#6C63FF]/20 bg-[#0D1030] text-white placeholder-slate-500 rounded-lg px-4 py-2.5 outline-none focus:border-[#6C63FF] transition"
            />
          </div>

          {/* 2. Category */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 uppercase font-medium">
              Category *
            </label>
            <input
              type="text"
              name="category"
              placeholder="e.g. Web Development"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-[#6C63FF]/20 bg-[#0D1030] text-white placeholder-slate-500 rounded-lg px-4 py-2.5 outline-none focus:border-[#6C63FF] transition"
            />
          </div>

          {/* 3. Short summary */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 uppercase font-medium">
              Short Summary
            </label>
            <input
              type="text"
              name="sub_description"
              placeholder="One sentence shown on the course card"
              value={form.sub_description}
              onChange={handleChange}
              className="w-full border border-[#6C63FF]/20 bg-[#0D1030] text-white placeholder-slate-500 rounded-lg px-4 py-2.5 outline-none focus:border-[#6C63FF] transition"
            />
          </div>

          {/* 4. Full description */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 uppercase font-medium">
              Full Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="What will students learn in this course?"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-[#6C63FF]/20 bg-[#0D1030] text-white placeholder-slate-500 rounded-lg px-4 py-2.5 outline-none focus:border-[#6C63FF] transition"
            />
          </div>

          {/* 5. Video */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 uppercase font-medium">
              Introduction Video (YouTube) *
            </label>
            <input
              type="text"
              name="video_id"
              required
              placeholder="Paste a YouTube link (e.g. https://www.youtube.com/watch?v=...) or just the video ID"
              value={form.video_id}
              onChange={handleChange}
              className="w-full border border-[#6C63FF]/20 bg-[#0D1030] text-white placeholder-slate-500 rounded-lg px-4 py-2.5 outline-none focus:border-[#6C63FF] transition"
            />
            <p className="text-xs text-slate-500 mt-1">
              Required — this is what the Admin reviews to approve your course.
              Paste the full YouTube URL or just the video ID; we'll figure it
              out.
            </p>

            {form.video_id.trim() &&
              (() => {
                const previewId = extractYouTubeId(form.video_id);
                return previewId ? (
                  <div className="mt-3 rounded-lg overflow-hidden border border-[#6C63FF]/20 aspect-video bg-black">
                    <img
                      src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`}
                      alt="Video preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    Doesn't look like a valid YouTube link or ID yet.
                  </p>
                );
              })()}
          </div>

          {/* 6. Duration */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 uppercase font-medium">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              placeholder="e.g. 180"
              value={form.duration}
              onChange={handleChange}
              className="w-full border border-[#6C63FF]/20 bg-[#0D1030] text-white placeholder-slate-500 rounded-lg px-4 py-2.5 outline-none focus:border-[#6C63FF] transition"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#6C63FF] hover:bg-[#5a52d9] text-white py-3 rounded-lg font-medium transition disabled:opacity-50 cursor-pointer shadow-lg shadow-[#6C63FF]/20"
          >
            {saving ? "Creating..." : "Submit for Admin Review"}
          </button>
        </form>
      </section>
    </div>
  );
}
