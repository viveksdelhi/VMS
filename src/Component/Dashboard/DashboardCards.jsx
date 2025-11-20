import React from 'react';
import {
  FaVideo,
  FaBell,
  FaChartLine,
  FaServer,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaClipboardList,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { useDeviceInventory } from '../../contexts/DeviceInventoryContext';
import { useAlertData } from '../../contexts/AlertDataContext';

const DashboardCards = () => {
  const {
    cameraCount,
    nvrCount,
    siteCount,
    zoneCount,
    loading: inventoryLoading,
  } = useDeviceInventory();
  const { alertsCount, loading: alertLoading } = useAlertData();
  const systemHealth = 'Healthy';
  const loading = inventoryLoading || alertLoading;

  const cards = [
    {
      title: 'Sites',
      count: siteCount,
      subtitle: 'Total active Sites',
      icon: <FaLayerGroup className="text-xl text-purple-500" />,
      link: '/devices/locations',
      bg: 'bg-purple-100',
    },
    {
      title: 'Zones',
      count: zoneCount,
      subtitle: 'Total active Zones',
      icon: <FaMapMarkerAlt className="text-xl text-purple-500" />,
      link: '/devices/zones',
      bg: 'bg-purple-100',
    },
    {
      title: 'Alerts',
      count: alertsCount,
      subtitle: 'All Alerts',
      icon: <FaClipboardList className="text-xl text-purple-500" />,
      link: '/reports/alerts',
      bg: 'bg-purple-100',
    },
    {
      title: 'Events',
      count: alertsCount,
      subtitle: 'Recent security & safety events',
      icon: <FaBell className="text-xl text-purple-500" />,
      link: '/analytics',
      bg: 'bg-purple-100',
    },
    {
      title: 'Analytics',
      count: alertsCount,
      subtitle: 'AI-driven insights',
      icon: <FaChartLine className="text-xl text-purple-500" />,
      link: '/analytics',
      bg: 'bg-purple-100',
    },
    {
      title: 'NVRs',
      count: nvrCount,
      subtitle: 'Total connected NVRs',
      icon: <FaServer className="text-xl text-purple-500" />,
      link: '/devices/nvrs',
      bg: 'bg-purple-100',
    },
    {
      title: 'Cameras',
      count: cameraCount,
      subtitle: 'Total active cameras',
      icon: <FaVideo className="text-xl text-purple-500" />,
      link: '/devices/cameras',
      bg: 'bg-purple-100',
    },
    {
      title: 'System Health',
      count: systemHealth,
      subtitle: 'Health',
      icon: <FaServer className="text-xl text-purple-500" />,
      link: '/devices/nvrs',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {loading
        ? Array(4)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-purple-200 shadow-lg p-2 h-40 bg-white"
              >
                <Skeleton active paragraph={{ rows: 2 }} title={false} />
              </div>
            ))
        : cards.map((card, idx) => (
            <div
              key={idx}
              className={`${card.bg} rounded-lg border border-purple-200 shadow-lg p-2 h-fit flex flex-col justify-between transition duration-300 hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-purple-900">{card.title}</h2>
                <div className="bg-white p-2 rounded-full shadow">{card.icon}</div>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-bold text-purple-900">{card.count}</p>
                <p className="text-xs text-purple-700 mt-1">{card.subtitle}</p>
              </div>
              <div className="text-right mt-1">
                <Link
                  to={card.link}
                  className="text-sm font-medium text-purple-800 underline hover:text-purple-950"
                >
                  View All →
                </Link>
              </div>
            </div>
          ))}
    </div>
  );
};

export default DashboardCards;

// import React from "react";
// import { FaVideo, FaBell, FaChartLine, FaServer } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const DashboardCards = () => {
//   const cards = [
//     {
//       title: "Cameras",
//       count: 120,
//       subtitle: "Total active cameras",
//       icon: <FaVideo className="text-xl text-purple-500" />,
//       link: "/cameras",
//       bg: "bg-purple-100",
//     },
//     {
//       title: "Events",
//       count: 45,
//       subtitle: "Recent security & safety events",
//       icon: <FaBell className="text-xl text-purple-500" />,
//       link: "/events",
//       bg: "bg-purple-100",
//     },
//     {
//       title: "Analytics",
//       count: 88,
//       subtitle: "AI-driven insights",
//       icon: <FaChartLine className="text-xl text-purple-500" />,
//       link: "/analytics",
//       bg: "bg-purple-100",
//     },
//     {
//       title: "System Health",
//       count: 12,
//       subtitle: "NVRs & storage running fine",
//       icon: <FaServer className="text-xl text-purple-500" />,
//       link: "/system-health",
//       bg: "bg-purple-100",
//     },
//   ];

//   return (
//     <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//       {cards.map((card, idx) => (
//         <div
//           key={idx}
//           className={`${card.bg} rounded-lg border border-purple-200 shadow-lg p-2 h-40 flex flex-col justify-between transition duration-300 hover:shadow-xl`}
//         >
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-purple-900">{card.title}</h2>
//             <div className="bg-white p-2 rounded-full shadow">{card.icon}</div>
//           </div>
//           <div className="mt-2">
//             <p className="text-2xl font-bold text-purple-900">{card.count}</p>
//             <p className="text-xs text-purple-700 mt-1">{card.subtitle}</p>
//           </div>
//           <div className="text-right mt-1">
//             <Link
//               to={card.link}
//               className="text-sm font-medium text-purple-800 underline hover:text-purple-950"
//             >
//               View All →
//             </Link>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DashboardCards;
