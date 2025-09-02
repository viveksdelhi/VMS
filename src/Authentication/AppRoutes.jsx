import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
  { path: '/devices/zones', element: <ZoneDetails />, roles: ["Admin",'user'] },
  { path: '/devices/wards', element: <WardDetails />, roles: ["Admin",'user'] },
  //user management
  { path: '/roles', element: <RoleData />, roles: ["Admin"] },
  { path: '/users', element: <UserTable />, roles: ["Admin"] },
  { path: '/user/form', element: <UserForm />, roles: ["Admin"] },
  { path: '/permissions', element: <PermissionData />, roles: ["Admin"] },
  //end user management

  { path: '/unauthorized', element: <Unauthorized />, roles: [] }, // public
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
       {/* Fallback 404 Route */}
    <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;



// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Dashboard from '../Component/Dashboard/Dashboard';
// import AnalyticsData from '../Component/Pages/Analytics/AnalyticsData';



// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/dashboard" element={<Dashboard/>} />
//       <Route path="/analytics" element={<AnalyticsData/>} />
//     </Routes>
//   );
// };

// export default AppRoutes;
