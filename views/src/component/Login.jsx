// component/Login.jsx
// FIXED: response.data is { token, user } — so role is response.data.user.user_role
// Also fixed: role check now matches 'Lecturer' not 'instructor'
// And: token + user saved to localStorage so protected pages can read them

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
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

      // FIX: was `response.data.user_role` — correct path is response.data.user.user_role
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome back, ${user.full_name}!`);

      // FIX: role values in DB are 'Student', 'Lecturer', 'Administrator'
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
      toast.error(
        error.response?.data?.error || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F7F8FC] px-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-[#142175] rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
          </div>
        </div>

        <div className="text-center mt-6">
          <h1 className="text-3xl font-bold text-[#142175]">Welcome Back</h1>
          <p className="text-gray-500 mt-2">
            Log in to your EduFlow account to continue learning.
          </p>
        </div>

        <form
          onSubmit={handleLoginSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-8"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#142175]"
            />
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
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none focus:border-[#142175]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#142175] text-white py-3 rounded-lg mt-6 font-medium hover:bg-[#0d185a] transition disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In →"}
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
              className="border rounded-lg py-3 flex justify-center items-center gap-2 hover:bg-gray-50"
            >
              <i className="fa-brands fa-google"></i> Google
            </button>
            <button
              type="button"
              className="border rounded-lg py-3 flex justify-center items-center gap-2 hover:bg-gray-50"
            >
              <i className="fa-brands fa-github"></i> Github
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 mt-8">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal-600 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
