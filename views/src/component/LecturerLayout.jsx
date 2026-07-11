import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LecturerLayout({ children, activeTab }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  }

  const navItems = [
    {
      key: "courses",
      label: "My Courses",
      icon: "fa-book-open",
      onClick: () => navigate(`/lecturer/${user.user_id}/dashboard`),
    },
    {
      key: "profile",
      label: "My Profile",
      icon: "fa-circle-user",
      onClick: () => navigate(`/lecturer/${user.user_id}/profile`),
    },
    {
      key: "settings",
      label: "Settings",
      icon: "fa-gear",
      onClick: () => navigate(`/lecturer/${user.user_id}/settings`),
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#080B24]">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-[#0D1030] border-r border-[#6C63FF]/20 flex flex-col shrink-0 min-h-screen">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#6C63FF]/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#6C63FF] rounded-lg flex items-center justify-center shadow-lg shadow-[#6C63FF]/20">
              <i className="fa-solid fa-graduation-cap text-white text-sm"></i>
            </div>
            <span className="text-white font-bold text-lg">
              EduFlow{" "}
              <span className="text-[#6C63FF] font-semibold">Teach</span>
            </span>
          </div>
        </div>

        {/* Profile summary */}
        <div className="px-6 py-5 border-b border-[#6C63FF]/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7C6FFF] to-[#6C63FF] flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
              {user.full_name?.charAt(0)?.toUpperCase() || "L"}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-semibold text-sm truncate">
                {user.full_name || "Lecturer"}
              </p>
              <p className="text-slate-400 text-xs truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left ${
                activeTab === item.key
                  ? "bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#6C63FF]/10"
              }`}
            >
              <i className={`fa-solid ${item.icon} w-4`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        {/* New course button */}
        <div className="px-4 pb-4">
          <button
            onClick={() => navigate("/lecturer/courses/new")}
            className="w-full bg-[#6C63FF]/20 hover:bg-[#6C63FF]/30 border border-[#6C63FF]/30 text-white text-sm font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> New Course
          </button>
        </div>

        {/* Logout */}
        <div className="px-4 pb-6">
          <button
            onClick={logout}
            className="w-full text-slate-500 hover:text-rose-400 text-sm py-2 flex items-center justify-center gap-2 transition"
          >
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto bg-[#080B24]">{children}</main>
    </div>
  );
}

export default LecturerLayout;
