import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menu = [
    { name: "Home", path: "/home" },
    { name: "Course", path: "/courses" },
    { name: "About Us", path: "/about" },
  ];
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
        <Link to="/home" className="font-bold text-3xl text-[#142175] ml-3">
          EduFlow
        </Link>
        <div className="hidden md:flex gap-8 mx-5 justify-evenly items-center md:w-1/2 w-auto">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "text-[#142175] font-semibold" : "text-gray-500"
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Login Buttons */}
        <div className=" flex gap-3 ml-auto justify-end items-center md:px-5">
          <Link to="/login">
            <div>Login</div>
          </Link>

          <Link to="/signup">
            <div className="bg-[#142175] text-white px-4 py-2 rounded">
              Sign Up
            </div>
          </Link>
        </div>
      </nav>
      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-40 bg-white z-50 shadow-lg transform transition-transform duration-300 md:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-xmark text-2xl cursor-pointer"></i>
          </button>
        </div>

        {/* Mobile Links */}
        <div className="flex flex-col gap-6 px-6">
        {menu.map((item) => (
          <NavLink
            key ={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-[#142175] font-semibold" : "text-gray-500"
            }
          >
            {item.name}
          </NavLink>
        ))}
          <hr />
        </div>
      </div>
    </>
  );
}

export default Navbar;
