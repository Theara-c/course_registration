
import { useState } from "react";
import registerImage from "../assets/hero.jpg"; // 
import { Link } from "react-router-dom";
function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    if (formData.password !== formData.confirmPassword) {
      setError("Password does not match!. Pls try again");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 character.");
      return;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={registerImage}
          alt="register"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-gray-50 px-4 py-10 mb-15">
        <div className="w-full max-w-lg">
          <h2 className=" font-bold text-[#142175] mb-2" style={{ fontSize: "2rem" }}>
            REGISTRATION
          </h2>

          <div className="w-16 h-1 bg-blue-600 mb-8"></div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name + DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Johny Sin"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  DATE OF BIRTH
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                placeholder="alexjohn@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  PASSWORD
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder=""
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder=""
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            {/* Phone & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="(+855) 000-000-000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  GENDER
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select Option</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#1D4ED8] hover:bg-[#142175] text-white font-semibold py-3 rounded-lg transition cursor-pointer"
            >
              CREATE ACCOUNT
            </button>
            {error && (
          <div className="bg-red-500 text-white rounded-lg">{error}</div>
        )}

          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
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