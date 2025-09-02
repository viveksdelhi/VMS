import React, { useEffect, useState } from "react";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fakeData = [
      {
        id: 1,
        type: "Camera Online",
        message: "Camera #12 came online.",
        color: "bg-purple-200 text-purple-700",
        time: "2 mins ago",
      },
      {
        id: 2,
        type: "Fire Alert",
        message: "🔥 Fire detected in Zone 4.",
        color: "bg-purple-200 text-purple-700",
        time: "10 mins ago",
      },
      {
        id: 3,
        type: "AI Analytics",
        message: "New vehicle count report generated.",
        color: "bg-purple-200 text-purple-700",
        time: "30 mins ago",
      },
      {
        id: 4,
        type: "Rodent Alert",
        message: "Rodent activity detected in storage.",
        color: "bg-purple-200 text-purple-700",
        time: "1 hour ago",
      },
      {
        id: 5,
        type: "Camera Offline",
        message: "Camera #09 went offline.",
        color: "bg-purple-200 text-purple-700",
        time: "2 hours ago",
      },
      {
        id: 6,
        type: "Fire Alert",
        message: "Fire test alert Zone 2.",
        color: "bg-purple-200 text-purple-700",
        time: "5 hours ago",
      },
      {
        id: 7,
        type: "AI Analytics",
        message: "Heatmap generated for lobby.",
        color: "bg-purple-200 text-purple-700",
        time: "Today",
      },
    ];
    setActivities(fakeData);
  }, []);

  return (
    <div className="p-4 bg-purple-100 rounded-md shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Recent Alerts</h2>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start justify-between p-3 rounded-md border-l-4 ${activity.color} shadow-sm`}
          >
            <div>
              <p className="text-sm font-medium text-gray-800">
                {activity.message}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-white shadow-inner">
              {activity.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
