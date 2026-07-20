import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import YouTube from "react-youtube";
import { createNewCourse } from "../api/lecturerAPI";
import { getCourseByIdForLecturer, updateCourse } from "../api/courseApi.js";

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

export default function CreateCourse({ setCreate, category, course_id }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    sub_description: "",
    video_id: "",
    duration: 0,
    price: 0,
  });
  const handleReady = (event) => {
    const player = event.target;
    const duration = Math.floor(player.getDuration());
    console.log(duration);
    setForm({ ...form, duration });
  };
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
    if (!form.category) {
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
    if (Number(form.price) > 0 && Number(form.price) < 1) {
      toast.error("Premium price must be at least $1.");
      return;
    }

    setSaving(true);

    // 2. Format Payload to avoid data type mismatch errors
    const processedPayload = {
      title: form.title.trim(),
      category_id: form.category,
      description: form.description.trim() || null,
      sub_description: form.sub_description.trim() || null,
      video_id: cleanVideoId,
      duration: form.duration ? parseInt(form.duration, 10) : 0,
      price: Number(form.price) || 0,
    };
    const token = localStorage.getItem("accessToken");
    // console.log(processedPayload)

    try {
      let res = null;
      if (!course_id) {
        res = await createNewCourse(token, processedPayload);

        toast.success("Course created successfully!");
        console.log(res);
        setCreate(false);
      } else {
        res = await updateCourse( token, course_id, processedPayload);
        console.log(res)
        toast.success(res.msg);
        setCreate(false)
      }
    } catch (err) {
      console.error("Course Creation Error Info:", err.response?.data);
      toast.error(
        err.response?.data?.error + " or This video is already exist." ||
          "Failed to create course",
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!course_id) return;
    async function loadCourse() {
      try {
        const data = await getCourseByIdForLecturer(course_id);
        console.log("this is data", data);
        setForm({
          title: data.title,
          category: data.category.category_id,
          description: data.description || "",
          sub_description: data.sub_description || "",
          video_id: data.video_id,
          duration: data.duration,
          price: data.price,
        });

        console.log("this is form ", form);
      } catch (err) {
        console.error(err);
      }
    }
    loadCourse();
  }, [course_id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs p-4 overflow-y-auto">
      <section className="relative w-full max-w-2xl rounded-2xl shadow-2xl border bg-white border-gray-200 text-gray-900 transition-colors duration-300 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Create New Course
            </h2>
            <p className="text-sm mt-1 text-gray-500">
              Fill in the details below — including your intro video — and it
              goes straight to an Admin for review.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. Title */}
          <div>
            <label className="text-xs block mb-1 uppercase font-semibold tracking-wider opacity-75">
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Advanced React Patterns"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2.5 outline-none transition border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-[#6C63FF]"
            />
          </div>

          {/* 2. Category */}
          <div>
            <label className="text-xs block mb-1 uppercase font-semibold tracking-wider opacity-75">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2.5 outline-none transition border-gray-300 bg-gray-50 text-gray-900 focus:border-[#6C63FF]"
            >
              <option value="" disabled>
                Select a category
              </option>
              {Array.isArray(category) &&
                category.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
            </select>
          </div>

          {/* 3. Short Summary */}
          <div>
            <label className="text-xs block mb-1 uppercase font-semibold tracking-wider opacity-75">
              Short Summary
            </label>
            <input
              type="text"
              name="sub_description"
              placeholder="One sentence shown on the course card"
              value={form.sub_description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2.5 outline-none transition border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-[#6C63FF]"
            />
          </div>

          {/* 4. Full Description */}
          <div>
            <label className="text-xs block mb-1 uppercase font-semibold tracking-wider opacity-75">
              Full Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="What will students learn in this course?"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2.5 outline-none transition border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-[#6C63FF]"
            />
          </div>

          {/* 5. Introduction Video */}
          <div>
            <label className="text-xs block mb-1 uppercase font-semibold tracking-wider opacity-75">
              Introduction Video (YouTube) *
            </label>
            <input
              type="text"
              name="video_id"
              required
              placeholder="Paste a YouTube link or video ID"
              value={form.video_id}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2.5 outline-none transition border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-[#6C63FF]"
            />
            <p className="text-xs mt-1 text-gray-500">
              Required for Admin review. Paste the full URL or ID.
            </p>

            {form.video_id.trim() &&
              (() => {
                const previewId = extractYouTubeId(form.video_id);
                return previewId ? (
                  <>
                    <div className="mt-3 rounded-lg overflow-hidden border border-[#6C63FF]/20 aspect-video bg-black max-h-48">
                      <img
                        src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`}
                        alt="Video preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="hidden">
                      <YouTube videoId={previewId} onReady={handleReady} />
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    Doesn't look like a valid YouTube link or ID yet.
                  </p>
                );
              })()}
          </div>

          {/* 6. Pricing */}
          <div>
            <label className="text-xs block mb-2 uppercase font-semibold tracking-wider opacity-75">
              Pricing Option
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, price: 0 })}
                className={`p-4 rounded-xl border-2 text-left transition ${
                  Number(form.price) === 0
                    ? "border-[#10B981] bg-[#10B981]/10"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <i
                    className={`fa-solid fa-gift ${
                      Number(form.price) === 0
                        ? "text-[#10B981]"
                        : "text-slate-400"
                    }`}
                  ></i>
                  <span
                    className={`font-bold text-sm ${
                      Number(form.price) === 0
                        ? "text-[#10B981]"
                        : "text-gray-700"
                    }`}
                  >
                    Free
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Open to every student
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, price: form.price > 0 ? form.price : 19 })
                }
                className={`p-4 rounded-xl border-2 text-left transition ${
                  Number(form.price) > 0
                    ? "border-[#F59E0B] bg-[#F59E0B]/10"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <i
                    className={`fa-solid fa-crown ${
                      Number(form.price) > 0
                        ? "text-[#F59E0B]"
                        : "text-slate-400"
                    }`}
                  ></i>
                  <span
                    className={`font-bold text-sm ${
                      Number(form.price) > 0
                        ? "text-[#F59E0B]"
                        : "text-gray-700"
                    }`}
                  >
                    Premium
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Students pay to enroll
                </p>
              </button>
            </div>

            {Number(form.price) > 0 && (
              <div className="mt-3">
                <label className="text-xs block mb-1 uppercase font-semibold tracking-wider opacity-75">
                  Price (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
                    className="w-full border rounded-lg pl-8 pr-4 py-2.5 outline-none transition border-gray-300 bg-gray-50 text-gray-900 focus:border-[#F59E0B]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setCreate(false)}
              className="flex-1 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-900 py-3 rounded-xl font-medium transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#142175] hover:bg-[#142175]/90 text-white py-3 rounded-xl font-medium transition disabled:opacity-50 cursor-pointer shadow-lg shadow-[#6C63FF]/20"
            >
              {saving ? "Creating..." : "Submit for Review"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
