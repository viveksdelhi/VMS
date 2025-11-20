import React from "react";
import DashboardCards from "./DashboardCards";
import RecentActivity from "./RecentActivity";
import MapComponent from "./MapComponent";
import WeeklyAlertGraph from "./WeeklyAlertGraph";
import DashboardFilters from "./DashboardFilters";

const Dashboard = () => {
  console.log('Dashboard - Component rendering');

  return (
    <div>
      <div className="p-4">
        <DashboardFilters />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-2">
        {/* First Column - 8 columns wide on medium and up */}
        <div className="md:col-span-12">
          <DashboardCards />
        </div>
        <div className="md:col-span-6">
          <RecentActivity />
        </div>
        <div className="md:col-span-6">
          <WeeklyAlertGraph />
        </div>
        <div className="md:col-span-12">
          <MapComponent />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
