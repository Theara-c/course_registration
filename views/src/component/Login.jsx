// component/Login.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const notice = location.state?.notice;

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password },
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome back, ${user.full_name}!`);

      const role = user.user_role;
      const redirectTo = location.state?.redirectTo;

      // Student-only destinations like "/courses" or "/signup" (e.g. from
      // the Enroll Now / Become an Instructor buttons on the homepage)
      if (redirectTo && role === "Student") {
        navigate(redirectTo);
      } else if (role === "Administrator") {
        navigate(`/admin/${user.user_id}/dashboard`);
      } else if (role === "Lecturer") {
        navigate(`/lecturer/${user.user_id}/dashboard`);
      } else {
        navigate(`/students/${user.user_id}/dashboard`);
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.pendingApproval) {
        // Lecturer accounts waiting on admin approval get a friendlier,
        // more informative message instead of a generic auth error.
        toast.warn(
          error.response.data.error ||
            "Your lecturer account is still awaiting admin approval.",
          { autoClose: 6000 },
        );
      } else if (error.response) {
        // The server responded, so trust its message (wrong password,
        // account rejected, etc).
        toast.error(error.response.data?.error || "Invalid email or password.");
      } else {
        // No response at all reached us — the backend server probably
        // isn't running, or the request never got there (CORS/network).
        toast.error(
          "Can't reach the server. Is the backend running on port 8000?",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#080B24] px-6 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-[#6C63FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6C63FF]/30">
            <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
          </div>
        </div>

        <div className="text-center mt-6">
          <h1 className="text-3xl font-extrabold text-[#F8FAFC]">
            Welcome Back
          </h1>
          <p className="text-[#94A3B8] mt-2">
            Log in to your EduFlow account to continue learning.
          </p>
        </div>

        {notice && (
          <div className="mt-6 flex items-start gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-sm rounded-xl p-3">
            <i className="fa-solid fa-hourglass-half mt-0.5"></i>
            <p>{notice}</p>
          </div>
        )}

        <form
          onSubmit={handleLoginSubmit}
          className="bg-[#171B46] backdrop-blur rounded-2xl shadow-xl border border-[#6C63FF]/20 p-8 mt-8"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#6C63FF]/20 bg-[#0D1030] text-white placeholder-slate-500 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition"
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#6C63FF] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#6C63FF]/20 bg-[#0D1030] text-white placeholder-slate-500 rounded-lg pl-10 pr-12 py-3 outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} text-sm`}
                ></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6C63FF] hover:bg-[#5a52d9] text-white py-3 rounded-lg mt-6 font-semibold shadow-lg shadow-[#6C63FF]/20 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                Signing In...
              </>
            ) : (
              <>Sign In →</>
            )}
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#6C63FF]/20"></div>
            <span className="text-xs text-slate-500 uppercase">
              Or Continue With
            </span>
            <div className="flex-1 h-px bg-[#6C63FF]/20"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="border border-[#6C63FF]/20 text-slate-300 rounded-lg py-3 flex justify-center items-center gap-2 hover:bg-[#0D1030] transition"
            >
              <i className="fa-brands fa-google text-red-400"></i> Google
            </button>
            <button
              type="button"
              className="border border-[#6C63FF]/20 text-slate-300 rounded-lg py-3 flex justify-center items-center gap-2 hover:bg-[#0D1030] transition"
            >
              <i className="fa-brands fa-github"></i> Github
            </button>
          </div>
        </form>

        <p className="text-center text-slate-400 mt-8">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#6C63FF] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
