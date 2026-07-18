// pages/LecturerProfile.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import LecturerLayout from "../../component/LecturerLayout.jsx";

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
      <span className="text-xs font-semibold text-gray-600 block mb-1 uppercase tracking-wider">
        {label}
      </span>
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full border rounded-lg px-3.5 py-2 text-sm outline-none transition ${
          readOnly
            ? "bg-gray-100 text-gray-500 cursor-default border-gray-200"
            : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-[#6C63FF] focus:bg-white"
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
        JSON.stringify({ ...stored, ...res.data.user })
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
        <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
          <i className="fa-solid fa-spinner animate-spin mr-2"></i> Loading profile...
        </div>
      </LecturerLayout>
    );
  }

  return (
    <LecturerLayout activeTab="profile">
      {/* Centered container with full height */}
      <div className="min-h-screen flex justify-center items-center px-4 py-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-3 gap-6">
          {/* ── Left: summary card ── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center shadow-sm h-fit sticky top-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7C6FFF] to-[#6C63FF] flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-md shadow-[#6C63FF]/20">
              {form.full_name?.charAt(0)?.toUpperCase() || "L"}
            </div>
            <p className="font-bold text-gray-900 text-lg">{form.full_name}</p>
            <p className="text-gray-500 text-xs mt-0.5">{form.email}</p>
            <span className="mt-3 text-xs px-3 py-1 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20 font-semibold">
              Lecturer
            </span>

            <div className="w-full mt-6 space-y-3 text-left text-xs text-gray-600 border-t border-gray-100 pt-5">
              {form.specialization && (
                <div className="flex items-center gap-2.5">
                  <i className="fa-solid fa-brain text-[#6C63FF] text-sm w-4 text-center"></i>
                  <span>{form.specialization}</span>
                </div>
              )}
              {form.phone_number && (
                <div className="flex items-center gap-2.5">
                  <i className="fa-solid fa-phone text-[#6C63FF] text-sm w-4 text-center"></i>
                  <span>{form.phone_number}</span>
                </div>
              )}
              {form.telegram_link && (
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <i className="fa-brands fa-telegram text-[#6C63FF] text-sm shrink-0 w-4 text-center"></i>
                  <a
                    href={form.telegram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6C63FF] hover:underline truncate font-medium"
                  >
                    Telegram Profile
                  </a>
                </div>
              )}
              {form.gender && (
                <div className="flex items-center gap-2.5 capitalize">
                  <i className="fa-solid fa-user text-[#6C63FF] text-sm w-4 text-center"></i>
                  <span>{form.gender}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: editable form ── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 text-lg mb-5 pb-3 border-b border-gray-100">
              Edit Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field
                label="Full Name"
                value={form.full_name}
                onChange={set("full_name")}
                placeholder="Your full name"
              />
              <Field
                label="Email (Locked)"
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
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={set("gender")}
                  className="w-full border border-gray-300 bg-gray-50 text-gray-900 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#6C63FF] focus:bg-white transition"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1">
                  Telegram Link
                </label>
                <input
                  type="url"
                  value={form.telegram_link}
                  onChange={set("telegram_link")}
                  placeholder="https://t.me/yourhandle"
                  className="w-full border border-gray-300 bg-gray-50 text-gray-900 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#6C63FF] focus:bg-white transition"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must start with https:// — e.g. https://t.me/yourname
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#6C63FF] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#5a52d9] transition disabled:opacity-60 shadow-md shadow-[#6C63FF]/20 cursor-pointer"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleDiscard}
                className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition cursor-pointer"
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