import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const path = useLocation().pathname;
  const isAuthPage = path === "/login" || path === "/signup";

  // const isDashboard = path.includes("/dashboard") || path.includes("/watch");
  // return (
  //   <>
  //     {!isAuthPage && <Navbar />}

  //     <main className="max-h-full">
  //       <Outlet />
  //     </main>
  //     <Footer />
  //   </>
  // );
  const hasOwnLayout =
    path.includes("/students/") ||
    path.includes("/lecturer/") ||
    path.includes("/admin/") ||
    path.includes("/watch");
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Hide standard layout shell chrome on app workspaces */}
      {!isAuthPage && !hasOwnLayout && <Navbar />}

      <main className="flex-grow w-full">
        <Outlet />
      </main>
      {/* <Footer /> */}

      {!isAuthPage && !hasOwnLayout && <Footer />}
    </div>
  );
}
export default Layout;
