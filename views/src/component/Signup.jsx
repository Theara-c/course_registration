import { useState } from "react";
import registerImage from "../assets/hero.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ROLES = [
  {
    value: "Student",
    title: "Student",
    desc: "Browse & enroll in courses",
    icon: "fa-user-graduate",
    ring: "ring-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
    grad: "from-blue-500 to-indigo-600",
  },
  {
    value: "Lecturer",
    title: "Lecturer",
    desc: "Create & teach courses",
    icon: "fa-chalkboard-teacher",
    ring: "ring-purple-500",
    bg: "bg-purple-50",
    text: "text-purple-600",
    grad: "from-purple-500 to-fuchsia-600",
  },
];

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    user_role: "Student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectRole = (value) => {
    setFormData({ ...formData, user_role: value });
  };

  const passwordScore = (() => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[0-9]/.test(p) && /[a-zA-Z]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    return score;
  })();
  const strengthMeta = [
    { label: "Too short", color: "bg-gray-200" },
    { label: "Weak", color: "bg-red-400" },
    { label: "Okay", color: "bg-amber-400" },
    { label: "Good", color: "bg-lime-500" },
    { label: "Strong", color: "bg-emerald-500" },
  ][passwordScore];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        full_name: formData.fullName,
        date_of_birth: formData.dob,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone_number: formData.phone,
        gender: formData.gender,
        user_role: formData.user_role,
        telegram_link: "",
      };

      const response = await axios.post(
        "http://localhost:8000/api/auth/register",
        payload,
      );

      if (response.status === 201 || response.status === 200) {
        // Lecturer accounts need to be confirmed by an Administrator
        // before they can sign in — the backend flags this for us.
        if (response.data?.pendingApproval) {
          toast.info(
            "🎉 Request submitted! An admin will review and confirm your lecturer account soon.",
            { autoClose: 6000 },
          );
          navigate("/login", {
            state: {
              notice:
                "Your lecturer account is pending admin approval. You'll be able to sign in once it's confirmed.",
            },
          });
        } else {
          toast.success("Account created successfully! Please log in.");
          navigate("/login");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isLecturer = formData.user_role === "Lecturer";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Left Image / Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={registerImage}
          alt="register"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#142175]/90 via-[#142175]/30 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="w-12 h-12 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-graduation-cap text-2xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold leading-tight drop-shadow">
            Join EduFlow & start learning today ✨
          </h2>
          <p className="text-white/80 mt-2 text-sm">
            Thousands of students and lecturers are already growing their skills
            with us.
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center px-4 py-10">
        <div className="w-full max-w-lg bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-white p-8 sm:p-10 my-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
              <i className="fa-solid fa-user-plus text-white"></i>
            </div>
            <h2 className="font-extrabold text-[#142175] text-2xl sm:text-3xl">
              Create your account
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Pick a role, fill in your details, and you're on your way.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role picker — colorful cards instead of a boring dropdown */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2 tracking-wide">
                I WANT TO JOIN AS
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => {
                  const active = formData.user_role === role.value;
                  return (
                    <button
                      type="button"
                      key={role.value}
                      onClick={() => selectRole(role.value)}
                      className={`relative text-left p-4 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden group ${
                        active
                          ? `border-transparent ${role.ring} ring-2 shadow-lg`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${role.grad} opacity-0 ${active ? "opacity-100" : "group-hover:opacity-10"} transition-opacity`}
                      />
                      <div className="relative">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${active ? "bg-white/20" : role.bg}`}
                        >
                          <i
                            className={`fa-solid ${role.icon} ${active ? "text-white" : role.text}`}
                          ></i>
                        </div>
                        <p
                          className={`font-bold text-sm ${active ? "text-white" : "text-gray-800"}`}
                        >
                          {role.title}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${active ? "text-white/80" : "text-gray-500"}`}
                        >
                          {role.desc}
                        </p>
                      </div>
                      {active && (
                        <i className="fa-solid fa-circle-check absolute top-3 right-3 text-white"></i>
                      )}
                    </button>
                  );
                })}
              </div>

              {isLecturer && (
                <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3">
                  <i className="fa-solid fa-shield-halved mt-0.5"></i>
                  <p>
                    <strong>Heads up:</strong> Lecturer accounts are reviewed by
                    an Administrator before activation. You'll get access to the
                    Faculty Portal as soon as it's confirmed.
                  </p>
                </div>
              )}
            </div>

            {/* Full Name + DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  FULL NAME
                </label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Johny Sin"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  DATE OF BIRTH
                </label>
                <div className="relative">
                  <i className="fa-solid fa-cake-candles absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="alexjohn@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  PASSWORD
                </label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i
                      className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} text-sm`}
                    ></i>
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-1.5">
                    <div className="flex gap-1 h-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full ${i < passwordScore ? strengthMeta.color : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {strengthMeta.label}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i
                      className={`fa-solid ${showConfirm ? "fa-eye" : "fa-eye-slash"} text-sm`}
                    ></i>
                  </button>
                </div>
                {formData.confirmPassword && (
                  <span
                    className={`text-[11px] mt-1 block ${formData.confirmPassword === formData.password ? "text-emerald-600" : "text-red-500"}`}
                  >
                    <i
                      className={`fa-solid ${formData.confirmPassword === formData.password ? "fa-circle-check" : "fa-circle-exclamation"} mr-1`}
                    ></i>
                    {formData.confirmPassword === formData.password
                      ? "Passwords match"
                      : "Passwords don't match yet"}
                  </span>
                )}
              </div>
            </div>

            {/* Phone & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  PHONE NUMBER
                </label>
                <div className="relative">
                  <i className="fa-solid fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(+855) 000-000-000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  GENDER
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
                >
                  <option value="">Select Option</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm font-medium rounded-xl flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i> {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-semibold py-3 rounded-xl transition cursor-pointer shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r ${
                isLecturer
                  ? "from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
                  : "from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  Creating Account...
                </>
              ) : isLecturer ? (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  Submit for Admin Approval
                </>
              ) : (
                <>
                  <i className="fa-solid fa-rocket"></i>
                  Create Account
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
