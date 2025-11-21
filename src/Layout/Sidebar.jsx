import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
} from 'react-icons/fa';
import { MdMenu, MdMenuOpen, MdExpandLess, MdExpandMore } from 'react-icons/md';
import Logo from '../assets/logo.jpg';
import { useCustomEvents } from '../contexts/CustomEventContext';
import { slugify } from '../utils/slugify';

const Sidebar = ({ collapsed, onToggleCollapse, onCustomEventClick }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openMenus, setOpenMenus] = useState({});
  const [wasManuallyCollapsed, setWasManuallyCollapsed] = useState(false);
  const manualCollapseTimeRef = useRef(0);
  const { getCustomEventsForSidebar, customEvents } = useCustomEvents();

  // Debug logging - only custom events
  console.log('Sidebar - customEvents:', customEvents);
  console.log('Sidebar - getCustomEventsForSidebar():', getCustomEventsForSidebar());

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Full VMS Menu - only using custom events from context
  const menuItems = useMemo(
    () => [
      {
        key: 'video-management',
        label: 'Dashboard',
        icon: <FaVideo />,
        children: [
          { key: 'overview', label: 'Overview', icon: <FaChartLine />, path: '/dashboard' },
          // { key: 'live', label: 'Live Stream', icon: <FaBroadcastTower />, path: '/live/stream' },
          // { key: 'recordings', label: 'Recordings', icon: <FaFileVideo />, path: '/recordings' },
        ],
      },
      {
        key: 'video-management',
        label: 'Live Monitoring',
        icon: <FaVideo />,
        children: [
          { key: 'live feed', label: 'Live Feed', icon: <FaChartLine />, path: '/live/stream' },
          { key: 'multi view', label: 'Multi View', icon: <FaBroadcastTower />, path: '/live/stream' },
          { key: 'ptzcontrol', label: 'PTZ Control', icon: <FaBroadcastTower />, path: '/live/stream' },
          // { key: 'recordings', label: 'Recordings', icon: <FaFileVideo />, path: '/recordings' },
        ],
      },
      {
        key: 'camera-management',
        label: 'Camera Management',
        icon: <FaServer />,
        children: [
          { key: 'cameras', label: 'Camera List', icon: <FaVideo />, path: '/devices/cameras' },
          { key: 'camera health', label: 'Camera Health', icon: <FaVideo />, path: '/devices/cameras' },
          { key: 'cameras group', label: 'Camera Group', icon: <FaVideo />, path: '/devices/cameras' },
          // { key: 'nvrs', label: 'NVRs', icon: <FaServer />, path: '/devices/nvrs' },
          // { key: 'zones', label: 'Zones', icon: <FaMapMarkerAlt />, path: '/devices/zones' },
          // {
          //   key: 'locations',
          //   label: 'Locations',
          //   icon: <FaLayerGroup />,
          //   path: '/devices/locations',
          // },
        ],
      },
      {
        key: 'video-recording',
        label: 'Recording',
        icon: <FaVideo />,
        children: [
          { key: 'recordings', label: 'Live Recordings', icon: <FaFileVideo />, path: '/recordings' },
          { key: 'playback', label: 'Playback', icon: <FaBroadcastTower />, path: '/recordings' },
          { key: 'Storage', label: 'Storage', icon: <FaBroadcastTower />, path: '/storage' },
          // { key: 'recordings', label: 'Recordings', icon: <FaFileVideo />, path: '/recordings' },
        ],
      },
      {
        key: 'smart-detection',
        label: 'Analytics',
        icon: <FaBug />,
        children: [
          { key: 'face recognition', label: 'Face Recognition', icon: <FaChartLine />, path: '/analytics' },
          { key: 'object detection', label: 'Object Detection', icon: <FaChartLine />, path: '/analytics' },
          { key: 'crowd analytics', label: 'Crowd Analytics', icon: <FaChartLine />, path: '/analytics' },
          { key: 'behaviour analytics', label: 'Behaviour Analytics', icon: <FaChartLine />, path: '/analytics' },
          { key: 'Heat Map', label: 'Heat Map', icon: <FaChartLine />, path: '/analytics' },
        ],
      },
      {
        key: 'event-reports',
        label: 'Event and Alerts',
        icon: <FaBug />,
        children: [
          { key: 'Event Timeline', label: 'Event Timeline', icon: <FaChartLine />, path: '/analytics/custom-events' },
          { key: 'Active Alerts', label: 'Active Alerts', icon: <FaChartLine />, path: '/analytics/custom-events' },
          // Add custom events dynamically from context only
          ...getCustomEventsForSidebar(),
          {
            key: 'custom_event_management',
            label: 'Alert Rules',
            icon: <FaCogs />,
            path: '/analytics/custom-events',
          },
        ],
      },
      {
        key: 'reports',
        label: 'Reports',
        icon: <FaClipboardList />,
        children: [
          {
            key: 'alerts',
            label: 'Analytics',
            icon: <FaClipboardList />,
            path: '/reports/alerts',
          },
          {
            key: 'alerts',
            label: 'System',
            icon: <FaClipboardList />,
            path: '/reports/alerts',
          },
          {
            key: 'analyticsreports',
            label: 'Custom Reports',
            icon: <FaClipboardList />,
            path: '/reports/analytics',
          },
        ],
      },
      // {
      //   key: 'device-management',
      //   label: 'Devices',
      //   icon: <FaServer />,
      //   children: [
      //     { key: 'cameras', label: 'Cameras', icon: <FaVideo />, path: '/devices/cameras' },
      //     { key: 'nvrs', label: 'NVRs', icon: <FaServer />, path: '/devices/nvrs' },
      //     { key: 'zones', label: 'Zones', icon: <FaMapMarkerAlt />, path: '/devices/zones' },
      //     {
      //       key: 'locations',
      //       label: 'Locations',
      //       icon: <FaLayerGroup />,
      //       path: '/devices/locations',
      //     },
      //   ],
      // },
      {
        key: 'user-management',
        label: 'Masters',
        icon: <FaUsers />,
        children: [
          { key: 'users', label: 'User Management', icon: <FaUsers />, path: '/users' },
          {
            key: 'locations',
            label: 'Site Management',
            icon: <FaLayerGroup />,
            path: '/devices/locations',
          },
          {
            key: 'locations',
            label: 'Device Registry',
            icon: <FaLayerGroup />,
            path: '/devices/locations',
          },
          { key: 'roles', label: 'Roles', icon: <FaUserShield />, path: '/roles' },
          { key: 'permissions', label: 'Permissions', icon: <FaShieldAlt />, path: '/permissions' },
          {
            key: 'assign_permissions',
            label: 'Assign Permissions',
            icon: <FaShieldAlt />,
            path: '/assign/permissions',
          },
        ],
      },
      {
        key: 'config-management',
        label: 'Configurations',
        icon: <FaUsers />,
        children: [
          // { key: 'users', label: 'User Management', icon: <FaUsers />, path: '/users' },
          {
            key: 'locations',
            label: 'System Settings',
            icon: <FaLayerGroup />,
            path: '/devices/locations',
          },
          {
            key: 'locations',
            label: 'Security',
            icon: <FaLayerGroup />,
            path: '/devices/locations',
          },
          { key: 'roles', label: 'Integrations', icon: <FaUserShield />, path: '/roles' },
          // { key: 'permissions', label: 'Permissions', icon: <FaShieldAlt />, path: '/permissions' },
          // {
          //   key: 'assign_permissions',
          //   label: 'Assign Permissions',
          //   icon: <FaShieldAlt />,
          //   path: '/assign/permissions',
          // },
        ],
      },
      {
        key: 'about',
        label: 'About VMS',
        icon: <FaInfoCircle />,
        children: [
          { key: 'overview', label: 'Overview', icon: <FaInfoCircle />, path: '/about/overview' },
        ],
      },
    ],
    [getCustomEventsForSidebar, customEvents]
  ); // Only depend on custom events

  useEffect(() => {
    if (!collapsed) {
      setOpenMenus(menuItems.reduce((acc, item) => ({ ...acc, [item.key]: true }), {}));
      // Clear manual collapse flag when sidebar expands (either by hover or manual)
      setWasManuallyCollapsed(false);
    }
  }, [collapsed, menuItems]);

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
    return '';
  })();

  const toggleMenu = key => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSidebarHover = () => {
    // Only auto-expand if collapsed and wasn't manually collapsed recently
    const timeSinceManualCollapse = Date.now() - manualCollapseTimeRef.current;
    if (collapsed && !wasManuallyCollapsed && timeSinceManualCollapse > 500) {
      onToggleCollapse();
    }
  };

  const handleSidebarLeave = () => {
    // When mouse leaves, allow hover expansion again after a delay
    if (collapsed && wasManuallyCollapsed) {
      setTimeout(() => {
        setWasManuallyCollapsed(false);
        manualCollapseTimeRef.current = 0;
      }, 300);
    }
  };

  const handleManualToggle = () => {
    // If currently expanded, we're about to collapse - mark as manually collapsed
    if (!collapsed) {
      setWasManuallyCollapsed(true);
      manualCollapseTimeRef.current = Date.now();
    } else {
      // If currently collapsed, we're about to expand - clear the flag
      setWasManuallyCollapsed(false);
      manualCollapseTimeRef.current = 0;
    }
    onToggleCollapse();
  };

  return (
    <div
      className={`${collapsed ? 'w-16' : 'w-65'} h-screen bg-white text-gray-900 flex flex-col justify-between shadow-xl transition-all duration-300`}
      onMouseEnter={handleSidebarHover}
      onMouseLeave={handleSidebarLeave}
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
          onClick={e => {
            e.stopPropagation();
            handleManualToggle();
          }}
          className="p-2 rounded-full bg-gray-100 hover:bg-purple-300 transition-all"
        >
          {collapsed ? <MdMenu /> : <MdMenuOpen />}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto space-y-2 px-2 relative mt-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {menuItems.map(menu => (
          <div key={menu.key} className="group relative">
            {/* Parent */}
            <div
              onClick={e => {
                e.stopPropagation();
                if (collapsed) {
                  onToggleCollapse();
                } else {
                  toggleMenu(menu.key);
                }
              }}
              className={`flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all ${collapsed ? 'justify-center' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg text-[#390964]">{menu.icon}</span>
                {!collapsed && (
                  <span className="text-sm font-semibold text-gray-700">{menu.label}</span>
                )}
              </div>
              {!collapsed && (
                <span className="text-gray-500">
                  {openMenus[menu.key] ? <MdExpandLess /> : <MdExpandMore />}
                </span>
              )}
            </div>

            {/* Hover submenu (collapsed) */}
            {collapsed && (
              <div className="absolute left-full top-0 ml-2 w-52 bg-white rounded-lg shadow-lg z-50 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200">
                {menu.children.map(item => (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 text-md rounded-md transition-all ${
                      selectedKey === item.key
                        ? 'bg-purple-100 text-[#8f5eb8] font-medium'
                        : 'hover:bg-gray-50 text-purple-700'
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      if (collapsed) {
                        onToggleCollapse();
                      }
                      if (item.key === 'custom_event') {
                        e.preventDefault();
                        onCustomEventClick && onCustomEventClick();
                      }
                    }}
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
                {menu.children.map(item => (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`flex items-center gap-2 p-2 rounded-md text-sm transition-all ${
                      selectedKey === item.key
                        ? 'bg-[#b17ef3] text-white font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      if (item.key === 'custom_event') {
                        e.preventDefault();
                        onCustomEventClick && onCustomEventClick();
                      }
                    }}
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
