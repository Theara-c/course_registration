
import { useState } from "react";
import registerImage from "../assets/hero.jpg"; // 
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Signup() {
  const { register, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    gender: "",
  });
//   const inputDate = "23/08/2026"; 
// const reversedDate = inputDate.split('/').reverse().join('/'); database accept this form
  const [err, setError] = useState("");
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Password does not match!. Please try again");
      return;
    }
    if ( !regex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if ( formData)
    if (formData.password.length < 6) {
      setError("Password must be at least 6 character.");
      return;
    }
    if ( formData.phone_number.length < 9){
      setError("Phone number must be at least 9 character.");
      return;
    }
    if (formData.phone_number === '' || !/^\d+$/.test(formData.phone_number)) {
      setError("Please enter a valid phone number.");
      return;
    }
    console.log("Form data before sending:", formData);
    await register(formData);

    if (error) setError(error);
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

            {/* Full Name + dob */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Johny Sin"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
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
                  required
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
                                  required

              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs text-gray-500 block mb-1">
                  PASSWORD
                </label>
                <input
                  type= { showPassword ? "text": "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                                    required

                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-65/100 -translate-y-1/2 text-gray-500"
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                                    required

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
                  name="phone_number"
                  placeholder="(+855) 000-000-000"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                                    required

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
                                    required

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
            {err && (
          <div className="bg-red-500 text-white rounded-lg p-2">{err}</div>
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