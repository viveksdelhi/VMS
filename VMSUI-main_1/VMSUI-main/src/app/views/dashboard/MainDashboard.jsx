// import React from "react";
// import { Row, Col, Card } from "react-bootstrap";
// import Tooltip from "@mui/material/Tooltip";
// import VideocamIcon from "@mui/icons-material/Videocam";
// import TimelineIcon from "@mui/icons-material/Timeline";
// import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
// // Ensure the correct path is used here
// import CameraStatusChart from "./CameraStatusChart"; // Correct path
// import ActivityList from "./ActivityList";
// import LastSevenDaysAlertGraph from "./LastSevenDaysAlertGraph";
// import CameraMapPoint from "./CameraMapPoint";

// const stats = [
//   {
//     title: "Total Cameras",
//     total: 120,
//     percentage: 100,
//     icon: <VideocamIcon style={{ color: "#2563eb" }} fontSize="medium" />,
//     gradientId: "gradientBlue",
//     gradientFrom: "#1e3a8a",
//     gradientTo: "#93c5fd"
//   },
//   {
//     title: "Total Analytics",
//     total: 65,
//     percentage: (65 / 120) * 100,
//     icon: <TimelineIcon style={{ color: "#10b981" }} fontSize="medium" />,
//     gradientId: "gradientGreen",
//     gradientFrom: "#16a34a",
//     gradientTo: "#86efac"
//   },
//   {
//     title: "Total ANPR",
//     total: 42,
//     percentage: (42 / 120) * 100,
//     icon: <DirectionsCarIcon style={{ color: "#f59e0b" }} fontSize="medium" />,
//     gradientId: "gradientOrange",
//     gradientFrom: "#d97706",
//     gradientTo: "#fcd34d"
//   }
// ];

// const VmsDashboardCards = () => {
//   const radius = 28;
//   const stroke = 6;
//   const normalizedRadius = radius - stroke / 2;
//   const circumference = 2 * Math.PI * normalizedRadius;

//   return (
//     <>
//       <Row className="g-4 p-3">
//         {stats.map((item, index) => (
//           <Col key={index} xs={12} md={4}>
//             <Tooltip title={item.title} arrow>
//               <Card
//                 style={{
//                   borderRadius: "1rem",
//                   padding: "0.5rem",
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                   cursor: "pointer"
//                 }}
//               >
//                 <Card.Body className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <div
//                       style={{
//                         width: 44,
//                         height: 44,
//                         borderRadius: 8,
//                         backgroundColor: "#f1f5f9",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         marginBottom: 12
//                       }}
//                     >
//                       {item.icon}
//                     </div>
//                     <div style={{ fontSize: 22, fontWeight: "bold" }}>{item.total}</div>
//                     <div style={{ fontSize: 14 }}>{item.title}</div>
//                   </div>

//                   <div style={{ position: "relative", width: 80, height: 80 }}>
//                     <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
//                       <defs>
//                         <linearGradient
//                           id={item.gradientId}
//                           x1="0%"
//                           y1="0%"
//                           x2="100%"
//                           y2="100%"
//                         >
//                           <stop offset="0%" stopColor={item.gradientFrom} />
//                           <stop offset="100%" stopColor={item.gradientTo} />
//                         </linearGradient>
//                       </defs>
//                       <circle
//                         cx="40"
//                         cy="40"
//                         r={normalizedRadius}
//                         stroke="#e5e7eb"
//                         strokeWidth={stroke}
//                         fill="none"
//                       />
//                       <circle
//                         cx="40"
//                         cy="40"
//                         r={normalizedRadius}
//                         stroke={`url(#${item.gradientId})`}
//                         strokeWidth={stroke}
//                         fill="none"
//                         strokeDasharray={circumference}
//                         strokeDashoffset={circumference * (1 - item.percentage / 100)}
//                         strokeLinecap="round"
//                       />
//                     </svg>
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         width: "100%",
//                         height: "100%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: 14,
//                         fontWeight: 600
//                       }}
//                     >
//                       {Math.round(item.percentage)}%
//                     </div>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Tooltip>
//           </Col>
//         ))}
//       </Row>

//       <Row>
//         <Col xs={12} md={3} className="p-1">
//           <CameraStatusChart />
//         </Col>
//         <Col xs={12} md={4} className="p-1">
//           <LastSevenDaysAlertGraph/>
//         </Col>
//         <Col xs={12} md={5} className="p-1">
//           <ActivityList />
//         </Col>
//       </Row>
//       <Row>
//         <Col xs={12} md={12} className="p-1">
//           <CameraMapPoint />
//         </Col>
//       </Row>

//     </>
//   );
// };

// export default VmsDashboardCards;

import { Fragment, useEffect, useState } from "react";
import {
  Card,
  Grid,
  styled,
  Typography,
  Box,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, token, userId } from "serverConnection";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
// import { ResponsiveContainer } from "recharts";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
// import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
// import LinkedCameraIcon from "@mui/icons-material/LinkedCamera";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
// import AddAlertIcon from "@mui/icons-material/AddAlert";
// import Fireworks from "Diwali";
import Counter from "Counter";

// Chart Data
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MainDashboard() {
  const navigate = useNavigate();

  // State to store camera counts and details
  const [totalCameras, setTotalCameras] = useState(0);
  const [activeCameras, setActiveCameras] = useState(0);
  const [inactiveCameras, setInactiveCameras] = useState(0);
  const [anprCount, setanprCount] = useState(0);
  const [totalanalytics, settotalanalytics] = useState(0);
  const [cameras, setCameras] = useState([]);

  // //alerts data
  // const [tableData, setTableData] = useState([]);
  // // const totalanalytics = tableData.length;
  // const basic = tableData.filter((data) => data.alertStatus === "B").length;
  // const sevier = tableData.filter((data) => data.alertStatus === "S").length;
  // const cretical = tableData.filter((data) => data.alertStatus === "C").length;

  // const [showFireworks, setShowFireworks] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      // setShowFireworks(false); // Hide the fireworks after 5 seconds
    }, (1 / 2) * 60 * 1000);

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);
  //alerts
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get(
          `${API}/api/NumberPlateReadedData/?user_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setanprCount(parseInt(response.data.count));
      } catch (error) {
        console.error("Error fetching camera data:", error);
      }
    };
    const fetchanalyticsTableData = async () => {
      try {
        const response = await axios.get(
          `${API}/api/CameraAlert/?user_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        settotalanalytics(response.data.count);
      } catch (error) {
        console.error("Error fetching camera data:", error);
      }
    };

    fetchTableData();
    fetchanalyticsTableData();
  }, []);

  // Fetch camera data
  useEffect(() => {
    axios
      .get(`${API}/api/Camera/?user_id=${userId}&pageNumber=1&pageSize=100000`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const cameraData = response.data.results;
        setCameras(cameraData);
        setTotalCameras(cameraData.length);
        setActiveCameras(
          cameraData.filter((camera) => camera.status === 0).length
        );
        setInactiveCameras(
          cameraData.filter((camera) => camera.status === 1).length
        );
      })
      .catch((error) => {
        console.error("Error fetching camera counts:", error);
      });
  }, []);

  // Hotspot locations
  // const hotspots = [
  //   { name: "CM House", position: [28.6139, 77.209] },
  //   { name: "President House", position: [28.6128, 77.2297] },
  //   { name: "PM House", position: [28.6128, 77.2289] },
  // ];

  const handleNavigation = (path, state) => {
    navigate(path, { state });
  };

  const ContentBox = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
  }));

  return (
    <Fragment>
      <ContentBox className="analytics">
        {/* first grid */}
        <Grid container spacing={2} className="pb-4">
          <Grid item lg={4} md={4} sm={6} xs={12}>
            <Card
              sx={{
                backgroundColor: "rgba(76, 175, 80, 0.2)", // Light gray background
                borderLeft: "5px solid #4caf50", // Green left border
                borderRadius: "5px", // Slightly rounded corners
                width: "100%",
                boxShadow:
                  "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important",
                maxWidth: "100%", // Set a maximum width for a smaller card
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="subtitle1" color="green">
                      Video Analytics
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "#333", // Dark text for readability
                    }}
                  >
                    <Counter target={totalanalytics} />
                    {/* {totalanalytics} */}
                  </Typography>
                  <AnalyticsIcon sx={{ color: "#000", fontSize: "46px" }} />{" "}
                  {/* Larger icon */}
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    padding: "0px",
                    margin: "0px",
                    color: "#1976d2", // Link color
                    cursor: "pointer",
                    "&:hover": {
                      color: "#0d47a1", // Darker shade on hover
                    },
                  }}
                  onClick={() => handleNavigation("/alerts")}
                >
                  View Details
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item lg={4} md={4} sm={6} xs={12}>
            <Card
              sx={{
                backgroundColor: "rgba(12, 173, 152, 0.2)", // Light gray background
                borderLeft: "5px solid #0cad98", // Green left border
                borderRadius: "5px", // Slightly rounded corners
                width: "100%",
                boxShadow:
                  "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important",
                maxWidth: "100%", // Set a maximum width for a smaller card
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="subtitle1" color="green">
                      ANPR
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "#333", // Dark text for readability
                    }}
                  >
                    <Counter target={anprCount} />
                  </Typography>
                  <DirectionsCarFilledIcon
                    sx={{ color: "#000", fontSize: "46px" }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    padding: "0px",
                    margin: "0px",
                    color: "#1976d2", // Link color
                    cursor: "pointer",
                    "&:hover": {
                      color: "#0d47a1", // Darker shade on hover
                    },
                  }}
                  onClick={() => handleNavigation("/anpr")}
                >
                  View Details
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={4} md={4} sm={6} xs={12}>
            <Card
              sx={{
                backgroundColor: "rgba(15, 65, 122, 0.2)", // Light gray background
                borderLeft: "5px solid #0f417a", // Green left border
                borderRadius: "5px", // Slightly rounded corners
                width: "100%",
                boxShadow:
                  "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important",
                maxWidth: "100%", // Set a maximum width for a smaller card
                height: "134px",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="subtitle1" color="green">
                      Camera Overview
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {/* Total Cameras */}
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#1565c0", // Deep blue
                        fontWeight: "500", // Medium weight
                        fontSize: "10px",
                      }}
                    >
                      Total Cameras
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "24px", // Larger size for numbers
                        color: "#333", // Dark text
                      }}
                    >
                      <Counter target={totalCameras} />
                    </Typography>
                  </Box>

                  {/* Active Cameras */}
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#2e7d32", // Green
                        fontWeight: "500",
                        fontSize: "10px",
                      }}
                    >
                      Active Cameras
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "24px",
                        color: "#333",
                      }}
                    >
                      <Counter target={activeCameras} />
                    </Typography>
                  </Box>

                  {/* Inactive Cameras */}
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#c62828", // Red
                        fontWeight: "500",
                        fontSize: "10px",
                      }}
                    >
                      Inactive Cameras
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "24px",
                        color: "#333",
                      }}
                    >
                      <Counter target={inactiveCameras} />
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    padding: "0px",
                    margin: "0px",
                    color: "#1976d2", // Link color
                    cursor: "pointer",
                    "&:hover": {
                      color: "#0d47a1", // Darker shade on hover
                    },
                  }}
                  onClick={() => handleNavigation("/all-camera")}
                >
                  View Details
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Map component */}
        <div
          style={{
            height: "500px",
            marginTop: "30px",
            width: "100%",
          }}
        >
          <MapContainer
            center={[23, 77]}
            zoom={6}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {cameras.map(
              (camera) =>
                camera.latitude &&
                camera.longitude && (
                  <Marker
                    key={camera.id}
                    position={[camera.latitude, camera.longitude]}
                  >
                    <Tooltip>
                      <div>
                        <Typography variant="body2">
                          <strong>Name:</strong> {camera.name}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Latitude:</strong> {camera.latitude}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Longitude:</strong> {camera.longitude}
                        </Typography>
                      </div>
                    </Tooltip>
                  </Marker>
                )
            )}
          </MapContainer>
        </div>

        </ContentBox>
      {/* {showFireworks && <Fireworks />} */}
    </Fragment>
  );
}
