import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaVideo,
  FaChartLine,
  FaBroadcastTower,
  FaFileVideo,
  FaFire,
  FaBug,
  FaServer,
  FaUsers,
  FaClipboardList,
  FaInfoCircle,
  FaCogs,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaUserShield,
} from "react-icons/fa";
import { MdMenu, MdMenuOpen, MdExpandLess, MdExpandMore } from "react-icons/md";
import Logo from "../assets/logo.jpg";

const Sidebar = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Full VMS Menu
  const menuItems = [
    {
      key: "video-management",
      label: "Video Management",
      icon: <FaVideo />,
      children: [
        { key: "dashboard", label: "Dashboard", icon: <FaChartLine />, path: "/dashboard" },
        { key: "live", label: "Live Stream", icon: <FaBroadcastTower />, path: "/live/stream" },
        { key: "recordings", label: "Recordings", icon: <FaFileVideo />, path: "/recordings" },
      ],
    },
    {
      key: "smart-detection",
      label: "Smart Detection",
      icon: <FaBug />,
      children: [
        { key: "analytics", label: "Video Analytics", icon: <FaChartLine />, path: "/analytics" },
        // { key: "event", label: "Event Detection", icon: <FaFire />, path: "/event" },
      ],
    },
    {
      key: "device-management",
      label: "Devices",
      icon: <FaServer />,
      children: [
        { key: "cameras", label: "Cameras", icon: <FaVideo />, path: "/devices/cameras" },
        { key: "nvrs", label: "NVRs", icon: <FaServer />, path: "/devices/nvrs" },
        { key: "zones", label: "Zones", icon: <FaMapMarkerAlt />, path: "/devices/zones" },
        // { key: "wards", label: "Wards", icon: <FaLayerGroup />, path: "/devices/wards" },
      ],
    },
    {
      key: "user-management",
      label: "User Management",
      icon: <FaUsers />,
      children: [
        { key: "users", label: "Users", icon: <FaUsers />, path: "/users" },
        { key: "roles", label: "Roles", icon: <FaUserShield />, path: "/roles" },
        { key: "permissions", label: "Permissions", icon: <FaShieldAlt />, path: "/permissions" },
        { key: "assign_permissions", label: "Assign Permissions", icon: <FaShieldAlt />, path: "/assign/permissions" },
      ],
    },
    {
      key: "reports",
      label: "Reports",
      icon: <FaClipboardList />,
      children: [
        { key: "alerts", label: "Event Reports", icon: <FaClipboardList />, path: "/reports/alerts" },
        { key: "analyticsreports", label: "Analytics Reports", icon: <FaClipboardList />, path: "/reports/analytics" },
        // { key: "usagereports", label: "Usage Reports", icon: <FaClipboardList />, path: "/reports/usage" },
      ],
    },
    // {
    //   key: "settings",
    //   label: "Settings",
    //   icon: <FaCogs />,
    //   children: [
    //     { key: "system", label: "System Settings", icon: <FaCogs />, path: "/settings/system" },
    //     { key: "network", label: "Network Settings", icon: <FaCogs />, path: "/settings/network" },
    //     { key: "storage", label: "Storage Settings", icon: <FaCogs />, path: "/settings/storage" },
    //   ],
    // },
    {
      key: "about",
      label: "About VMS",
      icon: <FaInfoCircle />,
      children: [
        { key: "overview", label: "Overview", icon: <FaInfoCircle />, path: "/about/overview" },
      ],
    },
  ];

  useEffect(() => {
    if (!collapsed) {
      setOpenMenus(menuItems.reduce((acc, item) => ({ ...acc, [item.key]: true }), {}));
    }
  }, [collapsed]);

  // ✅ Active route logic
  const selectedKey = (() => {
    const path = location.pathname;
    for (let menu of menuItems) {
      for (let item of menu.children) {
        if (path === item.path) return item.key;
      }
    }
    for (let menu of menuItems) {
      for (let item of menu.children) {
        if (path.startsWith(item.path)) return item.key;
      }
    }
    return "";
  })();

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className={`${collapsed ? "w-16" : "w-65"} h-screen bg-white text-gray-900 flex flex-col justify-between shadow-xl transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full" />
            <span className="font-bold text-lg text-[#9357c9]">VMS</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-full bg-gray-100 hover:bg-purple-300 transition-all"
        >
          {collapsed ? <MdMenu /> : <MdMenuOpen />}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto space-y-2 px-2 relative mt-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {menuItems.map((menu) => (
          <div key={menu.key} className="group relative">
            {/* Parent */}
            <div
              onClick={() => (collapsed ? null : toggleMenu(menu.key))}
              className={`flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all ${collapsed ? "justify-center" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg text-[#390964]">{menu.icon}</span>
                {!collapsed && <span className="text-sm font-semibold text-gray-700">{menu.label}</span>}
              </div>
              {!collapsed && <span className="text-gray-500">{openMenus[menu.key] ? <MdExpandLess /> : <MdExpandMore />}</span>}
            </div>

            {/* Hover submenu (collapsed) */}
            {collapsed && (
              <div className="absolute left-full top-0 ml-2 w-52 bg-white rounded-lg shadow-lg z-50 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200">
                {menu.children.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 text-md rounded-md transition-all ${
                      selectedKey === item.key
                        ? "bg-purple-100 text-[#8f5eb8] font-medium"
                        : "hover:bg-gray-50 text-purple-700"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Expanded submenu */}
            {!collapsed && openMenus[menu.key] && (
              <div className="ml-5 mt-1 space-y-1">
                {menu.children.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`flex items-center gap-2 p-2 rounded-md text-sm transition-all ${
                      selectedKey === item.key
                        ? "bg-[#b17ef3] text-white font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-xl p-4 text-center shadow-inner">
          {!collapsed && (
            <>
              <p className="text-sm font-semibold text-purple-700">Video Management System</p>
              <p className="text-xs text-gray-500 mt-1">
                Powered by <span className="font-bold text-[#3B1E54]">Ajeevi</span>
              </p>
              <button className="mt-3 w-full rounded-lg bg-[#9864db] hover:bg-[#8754d1] text-white py-2 text-sm font-medium transition-all">
                Learn More
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
