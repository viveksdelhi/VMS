import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // ✅ Import Navigate
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
  { path: '/analytics/tripwire', eventType: 'tripwire' },
  { path: '/analytics/trespass', eventType: 'trespass' },
  { path: '/analytics/camera-tampering', eventType: 'camera-tampering' },
  { path: '/analytics/loitering-detection', eventType: 'loitering-detection' },
  { path: '/analytics/tailgating-detection', eventType: 'tailgating-detection' },
  { path: '/analytics/left-object-detection', eventType: 'left-object-detection' },
  { path: '/analytics/missing-object-detection', eventType: 'missing-object-detection' },
  { path: '/analytics/continuous-auto-ptz-tracking', eventType: 'continuous-auto-ptz-tracking' },
  { path: '/analytics/ptz-handoff', eventType: 'ptz-handoff' },
  { path: '/analytics/ptz-preset-position-analytics', eventType: 'ptz-preset-position-analytics' },
  { path: '/analytics/crowding-detection', eventType: 'crowding-detection' },
  { path: '/analytics/crowd-counting', eventType: 'crowd-counting' },
  { path: '/analytics/crowd-flow-detection', eventType: 'crowd-flow-detection' },
  { path: '/analytics/video-smoke-detection', eventType: 'video-smoke-detection' },
  { path: '/analytics/video-fire-detection', eventType: 'video-fire-detection' },
  { path: '/analytics/slip-fall-detection', eventType: 'slip-fall-detection' },
];

const AppRoutes = () => {
  return (
    <Routes>
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
      {/* Event report routes */}
      {eventReportRoutes.map(r => (
        <Route
          key={r.path}
          path={r.path}
          element={<EventReportPage eventType={r.eventType} />}
        />
      ))}
      {/* Custom Event Management */}
      <Route
        path="/analytics/custom-events"
        element={<CustomEventManagement />}
      />
      {/* Custom event routes - Dynamic */}
      <Route
        path="/analytics/custom/:customEventId"
        element={<CustomEventReportPage />}
      />
      {/* Fallback: Redirect any undefined route to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
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

