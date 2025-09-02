import React from "react";
import { FaVideo, FaBell, FaChartLine, FaServer } from "react-icons/fa";
import { Link } from "react-router-dom";

const DashboardCards = () => {
  const cards = [
    {
      title: "Cameras",
      count: 120,
      subtitle: "Total active cameras",
      icon: <FaVideo className="text-xl text-purple-500" />,
      link: "/cameras",
      bg: "bg-purple-100",
    },
    {
      title: "Events",
      count: 45,
      subtitle: "Recent security & safety events",
      icon: <FaBell className="text-xl text-purple-500" />,
      link: "/events",
      bg: "bg-purple-100",
    },
    {
      title: "Analytics",
      count: 88,
      subtitle: "AI-driven insights",
      icon: <FaChartLine className="text-xl text-purple-500" />,
      link: "/analytics",
      bg: "bg-purple-100",
    },
    {
      title: "System Health",
      count: 12,
      subtitle: "NVRs & storage running fine",
      icon: <FaServer className="text-xl text-purple-500" />,
      link: "/system-health",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.bg} rounded-lg border border-purple-200 shadow-lg p-2 h-40 flex flex-col justify-between transition duration-300 hover:shadow-xl`}
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
