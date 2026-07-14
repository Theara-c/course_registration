import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

// Only list menu items that actually go somewhere distinct for that role.
// Students and Admins don't have separate Profile/Settings pages yet — their
// dashboard already shows that info — so we don't pretend those are
// separate destinations.
function profileMenuItems(user) {
  if (!user) return [];
  const { user_id, user_role } = user;

  if (user_role === "Administrator") {
    return [
      {
        label: "Dashboard",
        icon: "fa-gauge",
        path: `/admin/${user_id}/dashboard`,
      },
    ];
  }

  if (user_role === "Lecturer") {
    return [
      {
        label: "Profile",
        icon: "fa-user",
        path: `/lecturer/${user_id}/profile`,
      },
      {
        label: "Settings",
        icon: "fa-gear",
        path: `/lecturer/${user_id}/settings`,
      },
      {
        label: "My Courses",
        icon: "fa-book",
        path: `/lecturer/${user_id}/dashboard`,
      },
    ];
  }

  // Student (default)
  return [
    {
      label: "My Courses",
      icon: "fa-book",
      path: `/students/${user_id}/dashboard`,
    },
  ];
}

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Force a re-render when another tab logs in/out, so this navbar picks
  // up the change. Route changes in *this* tab already re-render Navbar,
  // so we read localStorage fresh on every render rather than mirroring
  // it into state.
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    function handleStorage() {
      forceUpdate((n) => n + 1);
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const user = getStoredUser();

  // Close the profile dropdown when clicking outside of it.
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLoggedIn = !!user;
  const menuItems = profileMenuItems(user);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowMenu(false);
    toast.success("Logged out successfully");
    navigate("/home");
  }

  const menu = [
    { name: "Home", path: "/home" },
    { name: "Course", path: "/courses" },
    { name: "About Us", path: "/about" },
  ];

  const linkClass = ({ isActive }) =>
    `cursor-pointer transition-colors duration-200 hover:text-[#142175] ${
      isActive ? "text-[#142175] font-semibold" : "text-gray-500"
    }`;

  return (
    <>
      <nav className="h-16 sticky top-0 z-50 bg-[#F8F9FF] flex items-center px-5 shadow">
        {/* Hamburger */}
        <button
          className="md:hidden text-2xl text-[#142175] cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <Link
          to="/home"
          className="font-bold text-3xl text-[#142175] ml-3 cursor-pointer"
        >
          EduFlow
        </Link>
        <div className="hidden md:flex gap-8 mx-5 justify-evenly items-center md:w-1/2 w-auto">
          {menu.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Login Buttons */}
        {!isLoggedIn && (
          <div className="flex gap-3 ml-auto justify-end items-center md:px-5">
            <Link
              to="/login"
              className="cursor-pointer text-gray-600 hover:text-[#142175] transition-colors duration-200"
            >
              Login
            </Link>

            <Link to="/signup">
              <div className="bg-[#142175] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#0d185a] transition-colors duration-200">
                Sign Up
              </div>
            </Link>
          </div>
        )}

        {isLoggedIn && (
          <div
            ref={menuRef}
            className="relative bg-transparent flex justify-end ml-auto items-center md:px-5 mr-5"
          >
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-[#142175] text-white cursor-pointer hover:bg-[#0d185a] transition-colors duration-200 font-semibold"
            >
              {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </button>
            {showMenu && (
              <div className="absolute top-12 right-0 w-52 bg-white rounded-lg shadow-lg border z-50">
                <ul className="py-2 text-sm">
                  <li className="px-4 py-2 text-gray-500 border-b text-xs truncate">
                    {user?.full_name || user?.email}
                  </li>
                  {menuItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.path}
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                      >
                        <i
                          className={`fa-solid ${item.icon} mr-2 text-[#142175]`}
                        ></i>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-red-50 cursor-pointer text-red-500 border-t"
                  >
                    <i className="fa-solid fa-right-from-bracket mr-2"></i>
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </nav>
      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-56 bg-white z-50 shadow-lg transform transition-transform duration-300 md:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)} className="cursor-pointer">
            <i className="fa-solid fa-xmark text-2xl cursor-pointer"></i>
          </button>
        </div>

        {/* Mobile Links */}
        <div className="flex flex-col gap-6 px-6">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={linkClass}
            >
              {item.name}
            </NavLink>
          ))}
          <hr />
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer text-gray-600 hover:text-[#142175]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer text-[#142175] font-semibold"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer text-gray-600 hover:text-[#142175]"
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="cursor-pointer text-red-500 text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
