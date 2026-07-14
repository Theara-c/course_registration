import { Link } from "react-router-dom";

// Internal pages — use React Router Link so navigation never triggers a
// full page reload.
const internalLinks = [
  { name: "Home", path: "/home" },
  { name: "Course", path: "/courses" },
  { name: "About Us", path: "/about" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms of Service", path: "/terms" },
  { name: "Support", path: "/support" },
];

// External destinations — real <a> tags, always opened in a new tab.
const TELEGRAM_CONTACT_URL = "https://telegram.org";

const socials = [
  {
    name: "Facebook",
    icon: "fa-brands fa-facebook",
    link: "https://www.facebook.com/",
  },
  {
    name: "Telegram",
    icon: "fa-brands fa-telegram",
    link: "https://telegram.org",
  },
  {
    name: "LinkedIn",
    icon: "fa-brands fa-linkedin",
    link: "https://linkedin.com",
  },
  {
    name: "GitHub",
    icon: "fa-brands fa-github",
    link: "https://github.com",
  },
];

function Footer() {
  return (
    <footer className="w-full bg-[#2A2D2F] text-white flex flex-col md:flex-row justify-center mt-10 items-start md:items-center px-5 py-8 gap-6">
      <div className="flex flex-col gap-3 w-full md:w-auto items-start mr-auto">
        <Link
          to="/home"
          className="font-bold text-2xl md:text-3xl text-white sm:text-3xl mb-5 cursor-pointer hover:text-gray-200 transition-colors duration-200"
        >
          EduFlow
        </Link>
        <p className="text-sm sm:text-base text-gray-400">
          Copyright © 2026 EduFlow. All rights reserved.
        </p>
      </div>

      <div className="w-full md:w-auto">
        <ul className="grid grid-cols-4 gap-4">
          {internalLinks.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="text-gray-400 hover:text-white text-sm sm:text-base cursor-pointer transition-colors duration-200"
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={TELEGRAM_CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm sm:text-base cursor-pointer transition-colors duration-200"
            >
              Contact us on Telegram
            </a>
          </li>
        </ul>

        {/* Social links */}
        <div className="flex gap-10 mt-5">
          {socials.map((item) => (
            <a
              key={item.name}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              title={item.name}
              aria-label={item.name}
              className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <i className={`${item.icon} text-3xl`}></i>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
export default Footer;
