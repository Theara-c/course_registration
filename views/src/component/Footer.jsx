import { Link } from "react-router-dom";
function Footer() {
  const menu = [
    { name: "Home", path: "/home" },
    { name: "Course", path: "/course" },
    { name: "About Us", path: "/about" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "support", path: "/support" },
  ];
  const logo = [
    { name: "Facebook", icon: "fa-brands fa-facebook", link: "https://facebook.com" },
    { name: "Twitter", icon: "fa-brands fa-telegram", link: "https://telegram.org" },
    { name: "LinkedIn", icon: "fa-brands fa-linkedin", link: "https://linkedin.com" },
    {name : 'Github', icon : 'fa-brands fa-github', link : 'https://github.com'}
  ];
  return (
    <footer className="w-full bg-[#2A2D2F] text-white flex flex-col md:flex-row justify-center mt-10 items-start md:items-center px-5 py-3 gap-6">
      <div className="flex flex-col gap-3 w-full md:w-auto items-start md:items-start mr-auto">
        <Link to="/home" className="font-bold text-2xl md:text-3xl text-white sm:text-3xl mb-5">
          EduFlow
        </Link>
        <p className="text-sm sm:text-base">
          Copyright © 2026 EduFlow. All rights reserved.
        </p>
      </div>
      <div className="w-full md:w-auto ">
        <ul className="grid grid-cols-4 gap-4">
          {menu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="text-gray-400 hover:text-white text-sm sm:text-base"
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm sm:text-base"
            >
              Contact us on Telegram
            </a>
          </li>
        </ul>
        {/* Logo  */}
        <div className = "flex gap-10 mt-5">
            {logo.map((item)  => (
                <a key = {item.name} href = {item.link} target = "_blank" title = {item.name} 
                 >
                    <i className = {`${item.icon} text-3xl `}> </i>
                    </a>
            ))}
        </div>
      </div>
    </footer>
  );
}
export default Footer;
