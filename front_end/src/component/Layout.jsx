import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const path = useLocation().pathname;

  const isAuthPage = path === "/login" || path === "/signup";

  const isLecturerOrAdminPage = 
    path.startsWith("/lecturer") || 
    path.startsWith("/admin");

  const hideNavAndFooter = isAuthPage || isLecturerOrAdminPage;

  return (
    <>
      {!hideNavAndFooter && <Navbar />}

      <main className="max-h-full">
        <Outlet />
      </main>

      {!hideNavAndFooter && <Footer />}
    </>
  );
}

export default Layout;