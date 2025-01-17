import { lazy } from "react";
import Loadable from "app/components/Loadable";
import ObjectList from "ObjectList";
import UserLicense from "User license";
import Aboutvms from "Aboutvms";

// const AppForm = Loadable(lazy(() => import("./forms/AppForm")));
const AppMenu = Loadable(lazy(() => import("./menu/AppMenu")));
const AppIcon = Loadable(lazy(() => import("./icons/AppIcon")));
const AppProgress = Loadable(lazy(() => import("./AppProgress")));
const AppRadio = Loadable(lazy(() => import("./radio/AppRadio")));
// const AppTable = Loadable(lazy(() => import("./tables/AppTable")));
const AppSwitch = Loadable(lazy(() => import("./switch/AppSwitch")));
const AppSlider = Loadable(lazy(() => import("./slider/AppSlider")));
const AppDialog = Loadable(lazy(() => import("./dialog/AppDialog")));
const AppButton = Loadable(lazy(() => import("./buttons/AppButton")));
const AppCheckbox = Loadable(lazy(() => import("./checkbox/AppCheckbox")));
const AppSnackbar = Loadable(lazy(() => import("./snackbar/AppSnackbar")));
const AppAutoComplete = Loadable(lazy(() => import("./auto-complete/AppAutoComplete")));
const AppExpansionPanel = Loadable(lazy(() => import("./expansion-panel/AppExpansionPanel")));
const UserApp = Loadable(lazy(() => import("./userForm/UserApp")));
const UserTable = Loadable(lazy(() => import("./userTable/UserTable")));
const AppCamera = Loadable(lazy(() => import("./camera/AppCamera")));
const AllCamera = Loadable(lazy(() => import("./camera/allCamera/AllCamera")));
const AppGroup = Loadable(lazy(() => import("./group/AppGroup")));
// const AppPermission = Loadable(lazy(() => import("./userPermission/AppPermission")));
// const AppLive = Loadable(lazy(() => import("./liveFeed/AppLive")));
const Appnvr = Loadable(lazy(() => import("./nvr/Appnvr")));
const Allnvr = Loadable(lazy(() => import("./nvr/allnvr/Allnvr")));
const Liveapp = Loadable(lazy(() => import("./NewLiveFeed/Liveapp")));
const Apprecord = Loadable(lazy(() => import("./recording/Apprecord")));
const AppAnpr = Loadable(lazy(() => import("./anpr/AppAnpr")));
const Appalert = Loadable(lazy(() => import("./alerts/Appalert")));
const TotalAlerts = Loadable(lazy(() => import("./TotalAlerts/Totalalerts")));
const AlertDashboard = Loadable(lazy(() => import("./alertDashboard/AlertDashboard")));
const TicketTable = Loadable(lazy(() => import("./Ticket/TicketTable")));






const materialRoutes = [
  // { path: "/material/all-user", element: <AppTable /> },
  // { path: "/material/add-user", element: <AppForm /> },
  { path: "/material/buttons", element: <AppButton /> },
  { path: "/material/icons", element: <AppIcon /> },
  { path: "/material/progress", element: <AppProgress /> },
  { path: "/material/menu", element: <AppMenu /> },
  { path: "/material/checkbox", element: <AppCheckbox /> },
  { path: "/material/switch", element: <AppSwitch /> },
  { path: "/material/radio", element: <AppRadio /> },
  { path: "/material/slider", element: <AppSlider /> },
  { path: "/material/autocomplete", element: <AppAutoComplete /> },
  { path: "/material/expansion-panel", element: <AppExpansionPanel /> },
  { path: "/material/dialog", element: <AppDialog /> },
  { path: "/material/snackbar", element: <AppSnackbar /> },
  { path: "/add-user", element: <UserApp /> },
  { path: "/all-user", element: <UserTable /> },
  { path: "/add-camera", element: <AppCamera /> },
  { path: "/all-camera", element: <AllCamera /> },
  { path: "/add-group", element: <AppGroup /> },
  // { path: "/user-permission", element: <AppPermission /> },
  // { path: "/live", element: <AppLive /> },
  { path: "/add-nvr", element: <Appnvr /> },
  { path: "/all-nvr", element: <Allnvr /> },
  { path: "/live", element: <Liveapp /> },//new
  { path: "/recording", element: <Apprecord /> },
  { path: "/anpr", element: <AppAnpr /> },
  { path: "/alerts", element: <Appalert /> },
  {path:'/objectList', element:<ObjectList />},
  {path:'/userlicense',element:<UserLicense/> },
  {path:'/aboutvms', element:<Aboutvms />},
  {path:'/alertstable', element:<TotalAlerts />},
  {path:'/alertdashboard', element:<AlertDashboard />},
  {path:'/ticket-table', element:<TicketTable />},

];

export default materialRoutes;
