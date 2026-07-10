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
      if (role === "Administrator") {
        navigate(`/admin/${user.user_id}/dashboard`);
      } else if (role === "Lecturer") {
        navigate(`/lecturer/${user.user_id}/dashboard`);
      } else {
        navigate(`/students/${user.user_id}/dashboard`);
      }
    } catch (error) {
      console.error("Login error:", error);
      // Lecturer accounts waiting on admin approval get a friendlier,
      // more informative message instead of a generic auth error.
      if (error.response?.data?.pendingApproval) {
        toast.warn(
          error.response.data.error ||
            "Your lecturer account is still awaiting admin approval.",
          { autoClose: 6000 },
        );
      } else {
        toast.error(
          error.response?.data?.error ||
            "Invalid credentials. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
          </div>
        </div>

        <div className="text-center mt-6">
          <h1 className="text-3xl font-extrabold text-[#142175]">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">
            Log in to your EduFlow account to continue learning.
          </p>
        </div>

        {notice && (
          <div className="mt-6 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-3">
            <i className="fa-solid fa-hourglass-half mt-0.5"></i>
            <p>{notice}</p>
          </div>
        )}

        <form
          onSubmit={handleLoginSubmit}
          className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white p-8 mt-8"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Password</label>
              <Link
                to="/forgot-password"
                className="text-sm text-teal-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                ></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg mt-6 font-semibold shadow-lg shadow-indigo-200 transition disabled:opacity-60 flex items-center justify-center gap-2"
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
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 uppercase">
              Or Continue With
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="border rounded-lg py-3 flex justify-center items-center gap-2 hover:bg-gray-50 transition"
            >
              <i className="fa-brands fa-google text-red-500"></i> Google
            </button>
            <button
              type="button"
              className="border rounded-lg py-3 flex justify-center items-center gap-2 hover:bg-gray-50 transition"
            >
              <i className="fa-brands fa-github"></i> Github
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 mt-8">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
