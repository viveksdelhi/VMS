import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { API_URL } from "../config";
import axios from "axios";
import { FiUser, FiLock } from "react-icons/fi"; // 👤 & 🔒 icons

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/Account/login`, {
        username: email,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      if (accessToken) {
        const decoded = jwtDecode(accessToken);

        const userId =
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const userEmail =
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        const userRole =
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        Cookies.set("token", accessToken);
        Cookies.set("refreshToken", refreshToken);
        Cookies.set("userId", userId);
        Cookies.set("email", userEmail);
        Cookies.set("role", userRole);

        login(accessToken, userRole);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Check your credentials or server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-purple-600 to-purple-900 px-4 relative overflow-hidden">

      {/* Floating Particles */}
      {[...Array(40)].map((_, i) => {
        const size = Math.random() * 20 + 6;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: size,
              height: size,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.15, 0.8, 0.15],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Login Card */}
      <motion.div
        className="relative w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 z-10 border border-white/20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* CCTV SVG Icon */}
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14 text-purple-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2 7l20 5-5 2-2 7-13-9z"
            />
          </svg>
        </div>

        {/* Branding */}
        <h1 className="text-3xl font-extrabold text-center text-white mb-2 font-sans tracking-wide">
          VisionHub VMS
        </h1>
        <p className="text-center text-purple-200 mb-6 text-sm">
          Smarter surveillance, seamless management,
          and total control over your video streams.
        </p>

        {error && <div className="text-red-400 text-center mb-4">{error}</div>}

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="relative">
            <FiUser className="absolute left-4 top-3.5 text-purple-300 text-lg" />
            <input
              type="text"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 rounded-full border border-purple-400
                         bg-white/10 text-white placeholder-gray-300
                         font-medium tracking-wide text-[15px]
                         focus:outline-none focus:ring-2 focus:ring-purple-500 
                         shadow-inner transition-all duration-300"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <FiLock className="absolute left-4 top-3.5 text-purple-300 text-lg" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 rounded-full border border-purple-400
                         bg-white/10 text-white placeholder-gray-300
                         font-medium tracking-wide text-[15px]
                         focus:outline-none focus:ring-2 focus:ring-purple-500 
                         shadow-inner transition-all duration-300"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 
                       text-white py-3 rounded-full 
                       hover:from-purple-700 hover:to-indigo-700
                       transition-all duration-300 shadow-lg font-semibold tracking-wide"
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </motion.button>
        </form>

        {/* Links */}
        <div className="flex justify-between mt-5 text-sm text-purple-200">
          <a href="#" className="hover:text-white">Forgot Password?</a>
          <a href="#" className="hover:text-white">Contact Support</a>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-purple-200 text-sm">
        Powered by <span className="font-semibold text-white">Your Company</span>
      </div>
    </div>
  );
};

export default LoginPage;
