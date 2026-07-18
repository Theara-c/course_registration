import { useState } from "react";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { createLecturerAccount } from "../../api/adminAPI.js";
export default function CreateLecturer({
  onClose
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    specialization: "",
    password: "",
    confirmPassword: "",
    telegram_link: ""
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!form.specialization.trim()) {
      toast.error("Specialization is required");
      return;
    }
    if (!form.password) {
      toast.error("Password is required");
      return;
    }
 
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
 
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
 
    
    if (form.password !== form.confirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    setSaving(true);
    console.log(form);
    const token = localStorage.getItem("accessToken");
    try {
        const res = await createLecturerAccount(token, form)
        console.log(res);
        toast.success("Create lecturer account successfully!");
          console.log(res);
          onClose();
    } catch (err) {
      console.error("Course Creation Error Info:", err.response?.data);
      toast.error(err.response?.data?.error + " or This video is already exist." || "Failed to create course");
    } finally {
      setSaving(false);
    }

  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-5 overflow-y-auto">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">

        {/* Header */}

        <div className="flex justify-between items-start px-8 py-6 bg-slate-100 border-b">

          <div>
            <h2 className="text-3xl font-bold text-indigo-900">
              Create Lecturer Account
            </h2>

            <p className="text-gray-500 mt-1">
              Add a new lecturer to the learning platform.
            </p>
          </div>

          <button
            onClick={() =>onClose()}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            <FaTimes />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >

          {/* Full Name */}

          <div>

            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="John Smith"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

          </div>

          {/* Email */}

          <div>

            <label className="block mb-2 font-medium">
              Professional Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

          </div>

          {/* Specialization */}

          <div>

            <label className="block mb-2 font-medium">
              Specialization
            </label>

            <input
              type="text"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="Software Engineering"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

          </div>

          {/* Password */}

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="block mb-2 font-medium">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>


            <div>

              <label className="block mb-2 font-medium">
                Confirm Password
              </label>


              <div className="relative">

                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirm ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>
            {/* telegram */}

          </div>
            <div>

            <label className="block mb-2 font-medium">
              Telegram Link
            </label>

            <input
              type="text"
              name="telegram_link"
              value={form.telegram_link}
              onChange={handleChange}
              placeholder="https://t.me/John"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

          </div>

          {/* Footer */}

          <div className="border-t pt-6 flex justify-end gap-4">

            <button
              type="button"
              onClick={() =>onClose()}
              className="border border-indigo-700 text-indigo-700 px-6 py-2 rounded-lg hover:bg-indigo-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-900 text-white px-6 py-2 rounded-lg hover:bg-indigo-800"
            >
              {saving ? "Creating....": "Create Account"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}