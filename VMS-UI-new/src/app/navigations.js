import { FaRegIdBadge, FaTicketAlt } from "react-icons/fa";

export const navigations = [
  { name: "Dashboard", path: "/dashboard", icon: "dashboard" },

  { label: "Module", type: "label" },
  // { name: "Live Feed", path: "/live", icon: "live_tv" },
  // live feed
  { name: "Live Feed", path: "/live", icon: "live_tv" },
  // storage
  { name: "Recordings", path: "/recording", icon: "saved" },
  // { name: "Storage",
  //   path: "/dashboard/feed",
  //   icon: "storage",
  //   children: [
  //     { name: "Recordings", iconText: "R", path: "/recording" },
  //   ]
  // },
  { name: "Video Analytics", path: "/alerts", icon: "analytics" },

  { name: "ANPR", path: "/anpr", icon: "camera" },

  {
    name: "Masters",
    path: "/dashboard/management",
    icon: "settings",
    children: [
      // { name: "Add NVR", iconText: "ALC", path: "/add-nvr" },
      { name: "All NVR", iconText: "ALC", path: "/all-nvr" },
      // { name: "Add Camera", iconText: "ADC", path: "/add-camera" },
      { name: "All Camera", iconText: "ALC", path: "/all-camera" },
    ],
  },

  // { name: "Hotspot", path: "/add-group", icon: "wifi" },
  // { name: "Ticket", path: "/ticket-table", icon: <FaTicketAlt className='pb-1' /> },

  // { name: "Object List", path: "/objectList", icon: "list" },

  // user management
  // { label: "Configuration", type: "label" },
  // { name: "User Management",
  //   icon: "account_circle",
  //   children: [
  //     { name: "Add User", iconText: "ADU", path: "/add-user" },
  //     { name: "All User", iconText: "ALU", path: "/all-user" },
  //     // { name: "Permission", iconText: "P", path: "/user-permission" }
  //   ]
  // },
  { name: "Credit Report", path: "/report", icon: "paid" },
  { name: "About VMS", path: "aboutvms", icon: "info" },

  // {  name: "User License",
  //   path: "userlicense",
  //   icon: <FaRegIdBadge  className='pb-1'/>,}

  // { label: "Group", type: "label" },

  // { name: "Alert Management", path: "/dashboard/feed", icon: "add_alert" },
  // { name: "Video Analytics", path: "/dashboard/feed", icon: "videocam" },

  // { name: "Map Integration", path: "/dashboard/feed", icon: "map" },
  // { name: "System Health", path: "/dashboard/feed", icon: "add_box" },
  // { name: "Customization", path: "/dashboard/feed", icon: "tune" },
  // { name: "Integration", path: "/dashboard/feed", icon: "settings_input_hdmi" },
  // { name: "Settings", path: "/dashboard/feed", icon: "settings" },
  // { label: "Custom", type: "label" },

  // {
  //   name: "Session/Auth",
  //   icon: "security",
  //   children: [
  //     { name: "Sign in", iconText: "SI", path: "/session/signin" },
  //     { name: "Sign up", iconText: "SU", path: "/session/signup" },
  //     { name: "Forgot Password", iconText: "FP", path: "/session/forgot-password" },
  //     { name: "Error", iconText: "404", path: "/session/404" }
  //   ]
  // },
  // { label: "Components", type: "label" },
  // {
  //   name: "Components",
  //   icon: "favorite",
  //   badge: { value: "30+", color: "secondary" },
  //   children: [
  //     { name: "Auto Complete", path: "/material/autocomplete", iconText: "A" },
  //     { name: "Buttons", path: "/material/buttons", iconText: "B" },
  //     { name: "Checkbox", path: "/material/checkbox", iconText: "C" },
  //     { name: "Dialog", path: "/material/dialog", iconText: "D" },
  //     { name: "Expansion Panel", path: "/material/expansion-panel", iconText: "E" },
  //     { name: "Form", path: "/material/form", iconText: "F" },
  //     { name: "Icons", path: "/material/icons", iconText: "I" },
  //     { name: "Menu", path: "/material/menu", iconText: "M" },
  //     { name: "Progress", path: "/material/progress", iconText: "P" },
  //     { name: "Radio", path: "/material/radio", iconText: "R" },
  //     { name: "Switch", path: "/material/switch", iconText: "S" },
  //     { name: "Slider", path: "/material/slider", iconText: "S" },
  //     { name: "Snackbar", path: "/material/snackbar", iconText: "S" },
  //     { name: "Table", path: "/material/table", iconText: "T" }
  //   ]
  // },
  // {
  //   name: "Charts",
  //   icon: "trending_up",
  //   children: [{ name: "Echarts", path: "/charts/echarts", iconText: "E" }]
  // },
  // {
  //   name: "Documentation",
  //   icon: "launch",
  //   type: "extLink",
  //   path: "http://demos.ui-lib.com/matx-react-doc/"
  // }
];
