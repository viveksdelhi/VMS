
import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Dashboard from '../Component/Dashboard/Dashboard';
import AnalyticsData from '../Component/Pages/Analytics/AnalyticsData';
import Unauthorized from '../Component/Pages/Unauthorized/Unauthorized';
import NotFound from '../Component/Pages/Unauthorized/NotFound';
import ProtectedRoute from './ProtectedRoute';
import LiveStreaming from '../Component/Pages/LiveStreaming/LiveStreaming';
import AboutOverview from '../Component/Pages/About/AboutOverview';
import RecordingViewer from '../Component/Pages/Recording/RecordingViewer';
import CameraDetailsTable from '../Component/Pages/Devices/Camera/CameraDetails';
import NvrDetailsTable from '../Component/Pages/Devices/NVR/NvrDetailsTable';
import ZoneDetails from '../Component/Pages/Devices/Zone/ZoneDetails';
import AlertReport from '../Component/Pages/Report/AlertReport';
import EventDetectionTable from '../Component/Pages/Analytics/EventDetectionTable';
import AnalyticsReport from '../Component/Pages/Report/AnalyticsReport';
import WardDetails from '../Component/Pages/Devices/Ward/WardDetails';
import RoleData from '../Component/Pages/UserManagement/RoleData';
import UserTable from '../Component/Pages/UserManagement/UserTable';
import UserForm from '../Component/Pages/UserManagement/UserForm';
import PermissionData from '../Component/Pages/UserManagement/Permission';
import NvrForm from '../Component/Pages/Devices/NVR/NvrForm';
import CameraForm from '../Component/Pages/Devices/Camera/CameraForm';
import AssignPermission from '../Component/Pages/UserManagement/AssignPermission';
import LocationForm from '../Component/Pages/Devices/Location/LocationForm';
import LocationDetailsTable from '../Component/Pages/Devices/Location/LocationDetailsTable ';
import EventReportPage from '../Component/Pages/Analytics/EventDetectionTable';
import CustomEventReportPage from '../Component/Pages/Analytics/CustomEventReportPage';
import CustomEventManagement from '../Component/Pages/Analytics/CustomEventManagement';
import { useCustomEvents } from '../contexts/CustomEventContext';
import { slugify } from '../utils/slugify';

const routeConfig = [
  { path: '/dashboard', element: <Dashboard />, roles: ['Admin',"User"] },
  { path: '/analytics', element: <AnalyticsData />, roles: ["Admin",'User'] },
  { path: '/live/stream', element: <LiveStreaming />, roles: ["Admin",'User'] },
  { path: '/about/overview', element: <AboutOverview />, roles: ["Admin",'User'] },
  { path: '/recordings', element: <RecordingViewer />, roles: ["Admin",'User'] },
  { path: '/event', element: <EventDetectionTable />, roles: ["Admin",'User'] },
  { path: '/reports/alerts', element: <AlertReport />, roles: ["Admin",'User'] },
  { path: '/reports/analytics', element: <AnalyticsReport />, roles: ["Admin",'User'] },
  { path: '/devices/cameras', element: <CameraDetailsTable />, roles: ["Admin",'User'] },
  { path: '/devices/nvrs', element: <NvrDetailsTable />, roles: ["Admin",'User'] },
  { path: '/nvr/form', element: <NvrForm />, roles: ["Admin",'User'] },
  { path: '/camera/form', element: <CameraForm />, roles: ["Admin",'User'] },
  { path: '/devices/zones', element: <ZoneDetails />, roles: ["Admin",'User'] },
  { path: '/devices/locations', element: <LocationDetailsTable />, roles: ["Admin",'User'] },
  { path: '/location/form', element: <LocationForm />, roles: ["Admin",'User'] },
  { path: '/devices/wards', element: <WardDetails />, roles: ["Admin",'User'] },
  // user management
  { path: '/roles', element: <RoleData />, roles: ["Admin"] },
  { path: '/users', element: <UserTable />, roles: ["Admin"] },
  { path: '/user/form', element: <UserForm />, roles: ["Admin"] },
  { path: '/permissions', element: <PermissionData />, roles: ["Admin"] },
  { path: '/assign/permissions', element: <AssignPermission />, roles: ["Admin"] },
  // end user management
  { path: '/unauthorized', element: <Unauthorized />, roles: [] }, // public
];

const eventReportRoutes = [
  
];

// Helper function to find custom event by slug
const findCustomEventBySlug = (customEvents, eventSlug) => {
  if (!customEvents || !Array.isArray(customEvents)) return null;
  
  return customEvents.find(event => {
    const eventNameSlug = slugify(event.eventName || `custom-event-${event.eventId}`);
    return eventNameSlug === eventSlug;
  });
};

// Unified component to handle custom event routes with slug matching
const EventRoute = () => {
  const { eventSlug } = useParams();
  const { customEvents, loading } = useCustomEvents();
  
  if (loading) {
    return <div>Loading event...</div>;
  }
  
  // Find custom event by slug
  const customEvent = findCustomEventBySlug(customEvents, eventSlug);
  
  if (customEvent) {
    return <CustomEventReportPage eventSlug={eventSlug} />;
  }
  
  // Custom event not found
  console.warn(`Custom event not found for slug: ${eventSlug}`);
  return <Navigate to="/analytics" replace />;
};

const AppRoutes = () => {
  console.log('AppRoutes - Rendering AppRoutes component');
  
  return (
    <Routes>
      {/* Unified Event routes - Dynamic (using slugified event names) - Handles only custom events */}
      <Route
        path="/analytics/event/:eventSlug"
        element={
          <ProtectedRoute allowedRoles={["Admin", "User"]}>
            <EventRoute />
          </ProtectedRoute>
        }
      />
      
      {/* Custom Event Management */}
      <Route
        path="/analytics/custom-events"
        element={
          <ProtectedRoute allowedRoles={["Admin", "User"]}>
            <CustomEventManagement />
          </ProtectedRoute>
        }
      />
      
      {/* All other routes */}
      {routeConfig.map(({ path, element, roles }) => (
        <Route
          key={path}
          path={path}
          element={
            roles.length > 0 ? (
              <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>
            ) : (
              element
            )
          }
        />
      ))}
      
      {/* Legacy Event report routes - kept for backward compatibility */}
      {eventReportRoutes.map(r => (
        <Route
          key={r.path}
          path={r.path}
          element={
            <ProtectedRoute allowedRoles={["Admin", "User"]}>
              <EventReportPage eventType={r.eventType} />
            </ProtectedRoute>
          }
        />
      ))}
      
      {/* Fallback: Redirect any undefined route to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
