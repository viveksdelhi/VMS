import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaExpand,
  FaCompress,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ onToggle }) => {
  const [showAlerts, setShowAlerts] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [hasNewAlerts, setHasNewAlerts] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const alertRef = useRef();
  const profileRef = useRef();

  // Clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setShowAlerts(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const doc = window.document;
    const docEl = doc.documentElement;
    const requestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullscreen ||
      docEl.msRequestFullscreen;
    const cancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (
      !doc.fullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.msFullscreenElement
    ) {
      requestFullScreen.call(docEl);
      setIsFullscreen(true);
    } else {
      cancelFullScreen.call(doc);
      setIsFullscreen(false);
    }
  };

  const alerts = [
    { id: 1, message: "Fire detected in Zone A", time: "2 mins ago" },
    { id: 2, message: "Motion detected in Parking", time: "10 mins ago" },
    { id: 3, message: "Camera 5 disconnected", time: "30 mins ago" },
  ];

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white text-gray-800 shadow-md z-50 relative">
        {/* Sidebar Toggle */}
        <button
          onClick={onToggle}
          className="block md:hidden p-2 rounded-md hover:bg-purple-100"
          title="Toggle Sidebar"
        >
          <FaBars className="text-xl text-[#3B1E54]" />
        </button>

        {/* Welcome + Time */}
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-2xl text-[#9864db]" />
          <div>
            <p className="text-sm font-semibold text-[#3B1E54]">Welcome, Admin</p>
            <p className="text-xs text-gray-500">{currentTime}</p>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-md hover:bg-purple-100 transition"
          >
            {isFullscreen ? (
              <FaCompress className="text-lg text-[#3B1E54]" />
            ) : (
              <FaExpand className="text-lg text-[#3B1E54]" />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={toggleSidebar}
            className="block p-2 rounded-md hover:bg-purple-600 bg-purple-500 text-white"
            title="Toggle Camera Sidebar"
          >
            AI Analysis
          </button>

          <div className="relative" ref={alertRef}>
            <button
              onClick={() => {
                setShowAlerts(!showAlerts);
                setHasNewAlerts(false);
              }}
              className="p-2 rounded-md hover:bg-purple-100 transition relative"
              title="Alerts"
            >
              <FaBell className="text-lg text-[#3B1E54]" />
              {hasNewAlerts && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>

            {/* Alert Dropdown */}
            {showAlerts && (
              <div className="absolute right-0 top-12 w-64 bg-white border border-purple-200 rounded-lg shadow-xl z-50">
                <div className="px-4 py-2 text-sm font-semibold border-b border-purple-200 text-[#3B1E54]">
                  Recent Alerts
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {alerts.map((alert) => (
                    <li
                      key={alert.id}
                      className="px-4 py-2 text-sm hover:bg-purple-50 transition"
                    >
                      <p className="font-medium text-gray-800">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-1 rounded-full hover:bg-purple-100 transition"
              title="Profile"
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-[#9864db]"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white border border-purple-200 rounded-lg shadow-lg z-50">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-purple-200">
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="User"
                    className="w-10 h-10 rounded-full border border-purple-300"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#3B1E54]">Admin</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>
                </div>
                <ul>
                  <li
                    onClick={() => navigate("/profile")}
                    className="px-4 py-2 text-sm hover:bg-purple-50 cursor-pointer"
                  >
                    My Profile
                  </li>
                  <li
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="px-4 py-2 text-sm text-red-500 hover:bg-purple-50 cursor-pointer flex items-center gap-2"
                  >
                    <FaSignOutAlt className="text-sm" />
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Animated Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 z-500"
              onClick={toggleSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar iframe */}
            <motion.iframe
              ref={sidebarRef}
              title="AI Analysis"
              src="http://localhost:3000/"
              className="fixed top-0 right-0 h-full w-120 z-500 shadow-xl border-none"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
