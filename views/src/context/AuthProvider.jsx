import { createContext, useEffect, useState } from "react";
import { createStudentAccount, loginUser, getCurrentUser } from "../api/userAPI.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {AuthContext} from "./AuthContext.jsx";


export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

useEffect ( () => {
  console.log("user change", user)
},[user])
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getCurrentUser(token);
        const userData = {
          user_id: res.user.user_id,
          role: res.user.role,
          email: res.user.email}
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        localStorage.removeItem("accessToken");
        console.log("this is small error")
        setUser(null);
        console.error("Error fetching current user:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Login

  const login = async (email, password) => {

    try {
      const res = await loginUser(email, password);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
      navigate(`students/${res.user.user_id}/dashboard`);
      toast.success("Login successful!");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during login."); }

  }

  // Register

  const register = async (form) => {
    try {
      const res = await createStudentAccount(form);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
      navigate(`students/${res.user.user_id}/dashboard`);
    } catch( err) {
      console.error("Error during registration:", err);
      setError(err.response?.data?.error || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }

  };

  // Logout

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        error,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Expose context as a property to avoid named exports in this file
AuthProvider.AuthContext = AuthContext;
