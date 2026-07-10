// pages/LecturerProfile.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import LecturerLayout from "../component/LecturerLayout.jsx";

const API = "http://localhost:8000/api/lecturer";

function authHeaders() {
  return {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly,
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-500 block mb-1 uppercase tracking-wide">
        {label}
      </span>
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition ${
          readOnly
            ? "bg-gray-50 text-gray-400 cursor-default border-gray-200"
            : "border-gray-300 focus:border-[#142175] bg-white"
        }`}
      />
    </label>
  );
}

export default function LecturerProfile() {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    gender: "",
    date_of_birth: "",
    specialization: "",
    telegram_link: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load fresh data from DB when page opens
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    axios
      .get(`${API}/profile`, authHeaders())
      .then((res) => {
        const u = res.data;
        setForm({
          full_name: u.full_name || "",
          email: u.email || "",
          phone_number: u.phone_number || "",
          gender: u.gender || "",
          date_of_birth: u.date_of_birth ? u.date_of_birth.split("T")[0] : "",
          specialization: u.specialization || "",
          telegram_link: u.telegram_link || "",
        });
      })
      .catch(() => {
        // Fallback to localStorage if API fails
        setForm({
          full_name: stored.full_name || "",
          email: stored.email || "",
          phone_number: stored.phone_number || "",
          gender: stored.gender || "",
          date_of_birth: stored.date_of_birth
            ? stored.date_of_birth.split("T")[0]
            : "",
          specialization: stored.specialization || "",
          telegram_link: stored.telegram_link || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSave() {
    setSaving(true);
    try {
      const res = await axios.put(`${API}/profile`, form, authHeaders());
      // Update localStorage with fresh data from server
      localStorage.setItem(
        "user",
        JSON.stringify({ ...stored, ...res.data.user }),
      );
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    axios.get(`${API}/profile`, authHeaders()).then((res) => {
      const u = res.data;
      setForm({
        full_name: u.full_name || "",
        email: u.email || "",
        phone_number: u.phone_number || "",
        gender: u.gender || "",
        date_of_birth: u.date_of_birth ? u.date_of_birth.split("T")[0] : "",
        specialization: u.specialization || "",
        telegram_link: u.telegram_link || "",
      });
      toast.info("Changes discarded.");
    });
  }

  if (loading) {
    return (
      <LecturerLayout activeTab="profile">
        <div className="flex items-center justify-center h-40 text-gray-400">
          Loading profile...
        </div>
      </LecturerLayout>
    );
  }

  return (
    <LecturerLayout activeTab="profile">
      <div className="max-w-4xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold text-[#142175] mb-1">My Profile</h1>
        <p className="text-gray-500 text-sm mb-8">
          Manage your personal information and public lecturer profile.
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left: read-only summary ── */}
          <div className="bg-white rounded-xl border p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-[#142175] flex items-center justify-center text-white text-4xl font-bold mb-4">
              {form.full_name?.charAt(0)?.toUpperCase() || "L"}
            </div>
            <p className="font-bold text-gray-800">{form.full_name}</p>
            <p className="text-gray-400 text-xs mt-0.5">{form.email}</p>
            <span className="mt-3 text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
              Lecturer
            </span>

            <div className="w-full mt-5 space-y-2.5 text-left text-xs text-gray-600 border-t pt-4">
              {form.specialization && (
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-brain text-[#142175]"></i>
                  {form.specialization}
                </div>
              )}
              {form.phone_number && (
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-phone text-[#142175]"></i>
                  {form.phone_number}
                </div>
              )}
              {form.telegram_link && (
                <div className="flex items-center gap-2 overflow-hidden">
                  <i className="fa-brands fa-telegram text-[#142175] shrink-0"></i>
                  <a
                    href={form.telegram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    Telegram
                  </a>
                </div>
              )}
              {form.gender && (
                <div className="flex items-center gap-2 capitalize">
                  <i className="fa-solid fa-user text-[#142175]"></i>
                  {form.gender}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: editable form ── */}
          <div className="lg:col-span-2 bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-5">Edit Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Field
                label="Full Name"
                value={form.full_name}
                onChange={set("full_name")}
                placeholder="Your full name"
              />
              <Field
                label="Email (locked — cannot change)"
                value={form.email}
                readOnly
              />
              <Field
                label="Phone Number"
                value={form.phone_number}
                onChange={set("phone_number")}
                placeholder="+855 xx xxx xxx"
              />
              <Field
                label="Date of Birth"
                type="date"
                value={form.date_of_birth}
                onChange={set("date_of_birth")}
              />
              <Field
                label="Specialization"
                value={form.specialization}
                onChange={set("specialization")}
                placeholder="e.g. Database Systems"
              />
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={set("gender")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#142175]"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                  Telegram Link
                </label>
                <input
                  type="url"
                  value={form.telegram_link}
                  onChange={set("telegram_link")}
                  placeholder="https://t.me/yourhandle"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#142175]"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Must start with https:// — e.g. https://t.me/yourname
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#142175] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0d185a] transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleDiscard}
                className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </LecturerLayout>
  );
}
