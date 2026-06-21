import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

function Auth() {

  return (
    <>
 <Navbar /> 
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
export default Auth;
