import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const path = useLocation().pathname;
  const isAuthPage = path === "/login" || path === "/signup";

  const isDashboard = path.includes("/dashboard") || path.includes("/watch");
  // return (
  //   <>
  //     {!isAuthPage && <Navbar />}

  //     <main className="max-h-full">
  //       <Outlet />
  //     </main>
  //     <Footer />
  //   </>
  // );
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Hide standard layout shell chrome on app workspaces */}
      {!isAuthPage && !isDashboard && <Navbar />}

      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />

      {/* {!isAuthPage && !isDashboard && <Footer />} */}
    </div>
  );
}
export default Layout;
