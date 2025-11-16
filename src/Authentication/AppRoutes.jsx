import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom'; // ✅ Import Navigate
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
import { useEvents } from '../hooks/useEvents';
import { slugify } from '../utils/slugify';

const routeConfig = [
  { path: '/dashboard', element: <Dashboard />, roles: ['Admin'] },
  { path: '/analytics', element: <AnalyticsData />, roles: ["Admin",'user'] },
  { path: '/live/stream', element: <LiveStreaming />, roles: ["Admin",'user'] },
  { path: '/about/overview', element: <AboutOverview />, roles: ["Admin",'user'] },
  { path: '/recordings', element: <RecordingViewer />, roles: ["Admin",'user'] },
  { path: '/event', element: <EventDetectionTable />, roles: ["Admin",'user'] },
  { path: '/reports/alerts', element: <AlertReport />, roles: ["Admin",'user'] },
  { path: '/reports/analytics', element: <AnalyticsReport />, roles: ["Admin",'user'] },
  { path: '/devices/cameras', element: <CameraDetailsTable />, roles: ["Admin",'user'] },
  { path: '/devices/nvrs', element: <NvrDetailsTable />, roles: ["Admin",'user'] },
  { path: '/nvr/form', element: <NvrForm />, roles: ["Admin",'user'] },
  { path: '/camera/form', element: <CameraForm />, roles: ["Admin",'user'] },
  { path: '/devices/zones', element: <ZoneDetails />, roles: ["Admin",'user'] },
  { path: '/devices/locations', element: <LocationDetailsTable />, roles: ["Admin",'user'] },
  { path: '/location/form', element: <LocationForm />, roles: ["Admin",'user'] },
  { path: '/devices/wards', element: <WardDetails />, roles: ["Admin",'user'] },
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

// Component to handle API event routes with slug matching
const ApiEventRoute = () => {
  const { eventSlug } = useParams();
  const { events: apiEvents, loading, error } = useEvents();
  
  // Wait for events to load before trying to match
  if (loading) {
    return <div>Loading event...</div>;
  }
  
  if (error) {
    console.error('Error loading events:', error);
    return <Navigate to="/analytics" replace />;
  }
  
  // Find event by matching slug
  const event = apiEvents.find(e => {
    const eventSlugified = slugify(e.eventName || `event-${e.eventId}`);
    return eventSlugified === eventSlug;
  });
  
  if (!event) {
    console.warn(`Event not found for slug: ${eventSlug}`, {
      availableSlugs: apiEvents.map(e => slugify(e.eventName || `event-${e.eventId}`)),
      availableEvents: apiEvents.map(e => ({ id: e.eventId, name: e.eventName }))
    });
    return <Navigate to="/analytics" replace />;
  }
  
  return (
    <EventReportPage 
      eventId={event.eventId} 
      eventData={event} 
    />
  );
};

const AppRoutes = () => {
  console.log('AppRoutes - Rendering AppRoutes component');
  const { events: apiEvents } = useEvents();
  
  return (
    <Routes>
      {/* API Event routes - Dynamic (using slugified event names) - Must come before /analytics route */}
      <Route
        path="/analytics/event/:eventSlug"
        element={
          <ProtectedRoute allowedRoles={["Admin", "user"]}>
            <ApiEventRoute />
          </ProtectedRoute>
        }
      />
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
            <ProtectedRoute allowedRoles={["Admin", "user"]}>
              <EventReportPage eventType={r.eventType} />
            </ProtectedRoute>
          }
        />
      ))}
      {/* Custom Event Management */}
      <Route
        path="/analytics/custom-events"
        element={
          <ProtectedRoute allowedRoles={["Admin", "user"]}>
            <CustomEventManagement />
          </ProtectedRoute>
        }
      />
      {/* Custom event routes - Dynamic */}
      <Route
        path="/analytics/custom/:customEventId"
        element={
          <ProtectedRoute allowedRoles={["Admin", "user"]}>
            <CustomEventReportPage />
          </ProtectedRoute>
        }
      />
      {/* Fallback: Redirect any undefined route to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;



// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Dashboard from '../Component/Dashboard/Dashboard';
// import AnalyticsData from '../Component/Pages/Analytics/AnalyticsData';
// import Unauthorized from '../Component/Pages/Unauthorized/Unauthorized';
// import NotFound from '../Component/Pages/Unauthorized/NotFound';
// import ProtectedRoute from './ProtectedRoute';
// import LiveStreaming from '../Component/Pages/LiveStreaming/LiveStreaming';
// import AboutOverview from '../Component/Pages/About/AboutOverview';
// import RecordingViewer from '../Component/Pages/Recording/RecordingViewer';
// import CameraDetailsTable from '../Component/Pages/Devices/Camera/CameraDetails';
// import NvrDetailsTable from '../Component/Pages/Devices/NVR/NvrDetailsTable';
// import ZoneDetails from '../Component/Pages/Devices/Zone/ZoneDetails';
// import AlertReport from '../Component/Pages/Report/AlertReport';
// import EventDetectionTable from '../Component/Pages/Analytics/EventDetectionTable';
// import AnalyticsReport from '../Component/Pages/Report/AnalyticsReport';
// import WardDetails from '../Component/Pages/Devices/Ward/WardDetails';
// import RoleData from '../Component/Pages/UserManagement/RoleData';
// import UserTable from '../Component/Pages/UserManagement/UserTable';
// import UserForm from '../Component/Pages/UserManagement/UserForm';
// import PermissionData from '../Component/Pages/UserManagement/Permission';
// import NvrForm from '../Component/Pages/Devices/NVR/NvrForm';
// import CameraForm from '../Component/Pages/Devices/Camera/CameraForm';
// import AssignPermission from '../Component/Pages/UserManagement/AssignPermission';
// import LocationForm from '../Component/Pages/Devices/Location/LocationForm';
// import LocationDetailsTable from '../Component/Pages/Devices/Location/LocationDetailsTable ';

// const routeConfig = [
//   { path: '/dashboard', element: <Dashboard />, roles: ['Admin'] },
//   { path: '/analytics', element: <AnalyticsData />, roles: ["Admin",'user'] },
//   { path: '/live/stream', element: <LiveStreaming />, roles: ["Admin",'user'] },
//   { path: '/about/overview', element: <AboutOverview />, roles: ["Admin",'user'] },
//   { path: '/recordings', element: <RecordingViewer />, roles: ["Admin",'user'] },
//   { path: '/event', element: <EventDetectionTable />, roles: ["Admin",'user'] },
//   { path: '/reports/alerts', element: <AlertReport />, roles: ["Admin",'user'] },
//   { path: '/reports/analytics', element: <AnalyticsReport />, roles: ["Admin",'user'] },
//   { path: '/devices/cameras', element: <CameraDetailsTable />, roles: ["Admin",'user'] },
//   { path: '/devices/nvrs', element: <NvrDetailsTable />, roles: ["Admin",'user'] },
//   { path: '/nvr/form', element: <NvrForm />, roles: ["Admin",'user'] },
//   { path: '/camera/form', element: <CameraForm />, roles: ["Admin",'user'] },
//   { path: '/devices/zones', element: <ZoneDetails />, roles: ["Admin",'user'] },
//   { path: '/devices/locations', element: <LocationDetailsTable />, roles: ["Admin",'user'] },
//   { path: '/location/form', element: <LocationForm />, roles: ["Admin",'user'] },
//   { path: '/devices/wards', element: <WardDetails />, roles: ["Admin",'user'] },
//   //user management
//   { path: '/roles', element: <RoleData />, roles: ["Admin"] },
//   { path: '/users', element: <UserTable />, roles: ["Admin"] },
//   { path: '/user/form', element: <UserForm />, roles: ["Admin"] },
//   { path: '/permissions', element: <PermissionData />, roles: ["Admin"] },
//   { path: '/assign/permissions', element: <AssignPermission />, roles: ["Admin"] },
//   //end user management

//   { path: '/unauthorized', element: <Unauthorized />, roles: [] }, // public
// ];

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {routeConfig.map(({ path, element, roles }) => (
//         <Route
//           key={path}
//           path={path}
//           element={
//             roles.length > 0 ? (
//               <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>
//             ) : (
//               element
//             )
//           }
//         />
//       ))}
//        {/* Fallback 404 Route */}
//     <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default AppRoutes;

