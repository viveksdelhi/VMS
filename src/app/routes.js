import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import  LoginFirst  from "./views/sessions/login/LoginFirst"

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";

// import sessionRoutes from "./views/sessions/session-routes";
import materialRoutes from "app/views/material-kit/MaterialRoutes";

// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));
// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/MainDashboard")));
// dash
const UserApp = Loadable(lazy(() => import("app/views/material-kit/userForm/UserApp")));
const Applive = Loadable(lazy(() => import("app/views/material-kit/liveFeed/AppLive")));
const AppGroup = Loadable(lazy(() => import("app/views/material-kit/group/AppGroup")));
const AppCamera = Loadable(lazy(() => import("app/views/material-kit/camera/AppCamera")));



const routes = [
  {
    path: "/",
    element: (<LoginFirst/>)
  },
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      // dashboard route
      {
        path: "/dashboard",
        element: <Analytics />,
      },
      // e-chart route
      {
        path: "/charts/echarts",
        element: <AppEchart />,
      },
      //dash
      {
        path: "/add-user",
        element: <UserApp />,
      },
      {
        path: "/live",
        element: <Applive />,
      },
      {
        path: "/add-group",
        element: <AppGroup />,
      },
      {
        path: "/add-camera",
        element: <AppCamera />,
      },
    ]
  },

  // // session pages route
  // ...sessionRoutes
];

export default routes;
