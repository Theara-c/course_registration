import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogin = () => {
    setIsLogin(true);
  };

  const handleLogout = () => {
    setIsLogin(false);
    setShowMenu(false);
  };

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
        {!isLogin && (
          <div className=" flex gap-3 ml-auto justify-end items-center md:px-5">
            <Link to="/login">
            <div onClick={handleLogin} >Login</div>
              {/* <div>Login</div> */}
            </Link>

            <Link to="/signup">
              <div className="bg-[#142175] text-white px-4 py-2 rounded">
                Sign Up
              </div>
            </Link>
          </div>
        )}

        {isLogin && (
          <div className=" bg-transparent flex justify-end  ml-auto items-center md:px-5 mr-5 ">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-[#142175] text-white"
            >
              A
            </button>
            {showMenu && (
              <div className="absolute top-16 right-8 w-52 bg-white rounded-lg shadow-lg border">
                <ul className="py-2">
                  <Link
                    to="students/dashboard"
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    My Learning
                  </Link>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Settings
                  </li>
                  <li 
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
                    Logout
                  {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
                    Logout */}
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
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
              key={item.path}
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
