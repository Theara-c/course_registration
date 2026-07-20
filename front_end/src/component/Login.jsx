import { Link } from "react-router-dom";
import { useState } from "react";
import  useAuth  from "../hooks/useAuth";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState( {
    email: "",
    password: ""
  });
  const {error, loading} = useAuth();
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const { login } = useAuth(); 
 const handleLogin = async (e) => {
    e.preventDefault();
    console.log(form);
    // login(form.email, form.password);
    await login(form.email, form.password);
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F7F8FC] px-6">
      <div className="w-full max-w-md">

        <div className="flex justify-center">
          <div className="w-14 h-14 bg-[#142175] rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-graduation-cap text-white"></i>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mt-6">
          <h1 className="text-3xl font-bold text-[#142175]">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">
            Log in to your EduFlow account to continue learning.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-8">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              name = "email"
              placeholder="name@company.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#142175]"
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mt-5">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">
                Password
              </label>

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
                name="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none focus:border-[#142175]"
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          {/* Sign In */}
          <button
            className="w-full bg-[#142175] text-white py-3 cursor-pointer rounded-lg mt-6 font-medium hover:bg-[#0d185a] transition"
            type="submit"
          >
            {loading && <p>Loading...</p>}
            Sign In →
          </button>

          {error && (
          <div className="bg-red-500 text-white rounded-lg p-2 mt-3">{error}</div>
        )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>

            <span className="text-xs text-gray-400 uppercase">
              Or Continue With
            </span>

            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              className="border rounded-lg py-3 flex justify-center items-center gap-2 hover:bg-gray-50"
            >
              <i className="fa-brands fa-google"></i>
              Google
            </button>

            <button
              className="border rounded-lg py-3 flex justify-center items-center gap-2 hover:bg-gray-50"
            >
              <i className="fa-brands fa-github"></i>
              Github
            </button>
          </div>
        </form>

        {/* Signup */}
        <p className="text-center text-gray-600 mt-8">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-teal-600 font-medium"
          >
            Sign Up
          </Link>

        </p>
      </div>
    </div>
  );
}

export default Login;