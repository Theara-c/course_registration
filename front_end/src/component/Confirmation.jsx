import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function CreateCourse() {
  const navigate = useNavigate();

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
      toast.error("An intro video is required.");
      return;
    }
    if (!cleanVideoId) {
      toast.error("Invalid YouTube link or video ID.");
      return;
    }
    if (Number(form.price) > 0 && Number(form.price) < 1) {
      toast.error("Premium price must be at least $1.");
      return;
    }

    setSaving(true);

    const processedPayload = {
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim() || null,
      sub_description: form.sub_description.trim() || null,
      video_id: cleanVideoId,
      duration: form.duration ? parseInt(form.duration, 10) : 0,
      price: Number(form.price) || 0,
      status: "Pending",
    };

    try {
      const res = await axios.post(
        `${API_URL}/courses`,
        processedPayload,
        authHeaders()
      );
      toast.success("Course created successfully!");

      const targetId = res.data.course_id || res.data.id;
      navigate(`/lecturer/courses/${targetId}`);
    } catch (err) {
      console.error("Course Creation Error:", err.response?.data);
      toast.error(err.response?.data?.error || "Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Reduced width to max-w-md and fixed white background */}
      <section className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-5 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Create New Course
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Fill in details below for admin review.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="text-[11px] font-semibold text-gray-600 block mb-1 uppercase tracking-wider">
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Advanced React Patterns"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#6C63FF] focus:bg-white transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-[11px] font-semibold text-gray-600 block mb-1 uppercase tracking-wider">
              Category *
            </label>
            <input
              type="text"
              name="category"
              placeholder="e.g. Web Development"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#6C63FF] focus:bg-white transition"
            />
          </div>

          {/* Short Summary */}
          <div>
            <label className="text-[11px] font-semibold text-gray-600 block mb-1 uppercase tracking-wider">
              Short Summary
            </label>
            <input
              type="text"
              name="sub_description"
              placeholder="One sentence course card summary"
              value={form.sub_description}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#6C63FF] focus:bg-white transition"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="text-[11px] font-semibold text-gray-600 block mb-1 uppercase tracking-wider">
              Full Description
            </label>
            <textarea
              name="description"
              rows={2}
              placeholder="What will students learn?"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#6C63FF] focus:bg-white transition"
            />
          </div>

          {/* Intro Video */}
          <div>
            <label className="text-[11px] font-semibold text-gray-600 block mb-1 uppercase tracking-wider">
              Intro Video (YouTube) *
            </label>
            <input
              type="text"
              name="video_id"
              required
              placeholder="Paste YouTube link or video ID"
              value={form.video_id}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#6C63FF] focus:bg-white transition"
            />

            {form.video_id.trim() &&
              (() => {
                const previewId = extractYouTubeId(form.video_id);
                return previewId ? (
                  <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 aspect-video bg-black max-h-36">
                    <img
                      src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`}
                      alt="Video preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    Invalid YouTube link/ID
                  </p>
                );
              })()}
          </div>

          {/* Pricing */}
          <div>
            <label className="text-[11px] font-semibold text-gray-600 block mb-1.5 uppercase tracking-wider">
              Pricing Option
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setForm({ ...form, price: 0 })}
                className={`p-3 rounded-lg border text-left transition ${
                  Number(form.price) === 0
                    ? "border-[#10B981] bg-[#10B981]/10 text-[#10B981]"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <i className="fa-solid fa-gift"></i> Free
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, price: form.price > 0 ? form.price : 19 })
                }
                className={`p-3 rounded-lg border text-left transition ${
                  Number(form.price) > 0
                    ? "border-[#F59E0B] bg-[#F59E0B]/10 text-[#D97706]"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <i className="fa-solid fa-crown"></i> Premium
                </div>
              </button>
            </div>

            {Number(form.price) > 0 && (
              <div className="mt-2.5">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    step="1"
                    placeholder="19"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-gray-50 text-gray-900 rounded-lg pl-7 pr-3 py-2 text-sm outline-none focus:border-[#F59E0B] transition"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#6C63FF] hover:bg-[#5a52d9] text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50 cursor-pointer shadow-md shadow-[#6C63FF]/20 mt-1"
          >
            {saving ? "Creating..." : "Submit for Review"}
          </button>
        </form>
      </section>
    </div>
  );
}