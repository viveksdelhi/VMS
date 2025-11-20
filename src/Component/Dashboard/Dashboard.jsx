import React from "react";
import DashboardCards from "./DashboardCards";
import RecentActivity from "./RecentActivity";
import MapComponent from "./MapComponent";
import WeeklyAlertGraph from "./WeeklyAlertGraph";
import DashboardFilters from "./DashboardFilters";
import { DeviceInventoryProvider } from "../../contexts/DeviceInventoryContext";
import { AlertDataProvider } from "../../contexts/AlertDataContext";

const DashboardContent = () => (
  <div>
    <div className="p-4">
      <DashboardFilters />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-2">
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

const Dashboard = () => (
  <DeviceInventoryProvider>
    <AlertDataProvider>
      <DashboardContent />
    </AlertDataProvider>
  </DeviceInventoryProvider>
);

export default Dashboard;
