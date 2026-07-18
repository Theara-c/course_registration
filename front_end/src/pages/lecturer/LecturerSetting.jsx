import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import LecturerLayout from "../../component/LecturerLayout.jsx";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export default function LecturerSettings() {
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [saving, setSaving] = useState(false);

  // Track visibility state for each specific input field independently
  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });

  const set = (key) => (e) =>
    setPasswords((p) => ({ ...p, [key]: e.target.value }));

  // Helper function to toggle the state of a specific field
  const toggleVisibility = (key) => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  async function handleChangePassword(e) {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwords.new_password.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    try {
      await axios.put(
        "http://localhost:8000/api/lecturer/settings/password",
        {
          current_password: passwords.current_password,
          new_password: passwords.new_password,
        },
        authHeaders(),
      );
      toast.success("Password changed successfully.");
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <LecturerLayout activeTab="settings">
      <div className="max-w-2xl mx-auto px-8 py-10">
        <div className="text-[#94A3B8] text-sm mb-8">
          Manage your account security and preferences.
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-xl border border-[#6C63FF]/20 p-6 mb-6">
          <h2 className="font-bold text-white mb-5">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase block mb-1">
                Current Password
              </span>
              <div className="relative">
                <input
                  type={showPassword.current_password ? "text" : "password"}
                  value={passwords.current_password}
                  onChange={set("current_password")}
                  placeholder="••••••••"
                  className="w-full border border-black bg-gray-100 text-black rounded-lg pl-4 pr-12 py-2.5 text-sm outline-none  transition"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("current_password")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
                >
                  <i
                    className={`fa-solid ${showPassword.current_password ? "fa-eye" : "fa-eye-slash"}`}
                  ></i>
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase block mb-1">
                New Password
              </span>
              <div className="relative">
                <input
                  type={showPassword.new_password ? "text" : "password"}
                  value={passwords.new_password}
                  onChange={set("new_password")}
                  placeholder="••••••••"
                  className="w-full border border-black bg-gray-100 text-black rounded-lg pl-4 pr-12 py-2.5 text-sm outline-none  transition"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("new_password")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
                >
                  <i
                    className={`fa-solid ${showPassword.new_password ? "fa-eye" : "fa-eye-slash"}`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase block mb-1">
                Confirm New Password
              </span>
              <div className="relative">
                <input
                  type={showPassword.confirm_password ? "text" : "password"}
                  value={passwords.confirm_password}
                  onChange={set("confirm_password")}
                  placeholder="••••••••"
                  className="w-full border border-black bg-gray-100 text-black rounded-lg pl-4 pr-12 py-2.5 text-sm outline-none  transition"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("confirm_password")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
                >
                  <i
                    className={`fa-solid ${showPassword.confirm_password ? "fa-eye" : "fa-eye-slash"}`}
                  ></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-[#142175] hover:bg-[#142175]/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium  transition disabled:opacity-60 shadow-lg shadow-[#6C63FF]/20"
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Account info */}
        <div className="bg-[#171B46] rounded-xl border border-[#6C63FF]/20 p-6">
          <h2 className="font-bold text-white  mb-4" style = {{ color: "white"}}>Account</h2>
          <p className="text-sm text-white mb-4">
            Your account is managed by EduFlow. Contact an administrator if you
            need to change your email address or role.
          </p>
          <div className="bg-[#0D1030] border border-[#6C63FF]/20 rounded-lg px-4 py-3 text-sm text-slate-300">
            <strong>Role:</strong> Lecturer
          </div>
        </div>
      </div>
    </LecturerLayout>
  );
}
