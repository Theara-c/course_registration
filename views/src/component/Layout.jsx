import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const path = useLocation().pathname;
  const isAuthPage = path === "/login" || path === "/signup";
  return (
    <>
      { !isAuthPage && <Navbar /> }

      <main className = 'max-h-full'>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
export default Layout;
