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
import { API, token } from "serverConnection";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import LinkedCameraIcon from "@mui/icons-material/LinkedCamera";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import AddAlertIcon from '@mui/icons-material/AddAlert';

// Function to generate smooth static data with small gradual changes
const generateStaticData = (numPoints, amplitude) => {
  return Array.from({ length: numPoints }, (_, i) => ({
    time: i + 1,
    value: amplitude + Math.sin(i / 5) * amplitude * 0.5, // Creates smooth up-down motion
  }));
};

// Generate static weekly data
const generateWeeklyData = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days.map((day, index) => ({
    day,
    value: Math.floor(Math.random() * 100) + 1, // Random value for demonstration
  }));
};

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

export default function Analytics() {
  // Chart State
  const [activityData, setActivityData] = useState(generateStaticData(100, 50));
  const [streamingData, setStreamingData] = useState(
    generateStaticData(100, 30)
  );
  const [weeklyData, setWeeklyData] = useState(generateWeeklyData());

  // Update the chart slowly over time
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityData((prevData) => [
        ...prevData.slice(1),
        { ...prevData[0], value: prevData[0].value },
      ]);
      setStreamingData((prevData) => [
        ...prevData.slice(1),
        { ...prevData[0], value: prevData[0].value },
      ]);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  // State to store camera counts and details
  const [totalCameras, setTotalCameras] = useState(0);
  const [activeCameras, setActiveCameras] = useState(0);
  const [inactiveCameras, setInactiveCameras] = useState(0);
  const [cameras, setCameras] = useState([]);

  //alerts data
  const [tableData, setTableData] = useState([]);
  const totalanalytics = tableData.length
  const basic = tableData.filter(data => data.alertStatus === "B").length
  const sevier = tableData.filter(data => data.alertStatus === "S").length
  const cretical = tableData.filter(data => data.alertStatus === "C").length

  //alerts
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get(`${API}/api/CameraAlert/GetAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let filterData = response.data
        // console.log(filterData)
        // if(state==="Basic"){
        //   filterData=filterData.filter(data=>data.alertStatus==="B").length
        // }
        // else if(state==="Sevier"){
        //     filterData=filterData.filter(data=>data.alertStatus==="S").length
        //   }
        // else if(state==="Critical"){
        //     filterData=filterData.filter(data=>data.alertStatus==="C").length
        //   }
        setTableData(filterData);
      } catch (error) {
        console.error("Error fetching camera data:", error);
      }
    };

    fetchTableData();
  }, []);


  // Fetch camera data
  useEffect(() => {
    axios
      .get(`${API}/api/Camera/GetAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const cameraData = response.data;
        setCameras(cameraData);

        setTotalCameras(cameraData.length);
        setActiveCameras(
          cameraData.filter((camera) => camera.status === true).length
        );
        setInactiveCameras(
          cameraData.filter((camera) => camera.status === false).length
        );
      })
      .catch((error) => {
        console.error("Error fetching camera counts:", error);
      });
  }, []);

  // Hotspot locations
  const hotspots = [
    { name: "CM House", position: [28.6139, 77.209] },
    { name: "President House", position: [28.6128, 77.2297] },
    { name: "PM House", position: [28.6128, 77.2289] },
  ];


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
                backgroundColor: "#5F6F65",
                borderRadius: "12px",
                width: "100%",
                padding: "3px",
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
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <AnalyticsIcon sx={{ color: "yellow" }} />
                    <Typography variant="subtitle1" color="white">
                      Video Analytics
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ color: "#00cc00" }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ marginTop: "10px", fontWeight: "bold", color: "white" }}
                >
                  {totalanalytics}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#00cc00",
                    cursor: "pointer",
                  }}
                  onClick={() => handleNavigation("/alertstable")}
                >
                  View Details
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={4} md={4} sm={6} xs={12}>
            <Card
              sx={{
                backgroundColor: "#405D72",
                borderRadius: "12px",
                width: "100%",
                padding: "3px",
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
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <DirectionsCarFilledIcon sx={{ color: "white" }} />
                    <Typography variant="subtitle1" color="white">
                      ANPR
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ color: "#00cc00" }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ marginTop: "10px", fontWeight: "bold", color: "white" }}
                >
                  {activeCameras}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#00cc00",
                    cursor: "pointer",
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
                backgroundColor: "#538392",
                borderRadius: "12px",
                width: "100%",
                padding: "3px",
                height:"134px"
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
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <AddAlertIcon sx={{ color: "red" }} />
                    <Typography variant="subtitle1" color="white">
                      Total Alerts
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ color: "#00cc00" }} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                  }}
                >
                  <div className="m-0 p-0">
                    <Box
                      sx={{
                        width: "100%",
                        height: "30px",
                        backgroundColor: "yellow",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "black",
                        cursor: "pointer",
                        padding: "0px 10px"
                      }}
                      onClick={() => handleNavigation("/alertstable", { Status: "Basic" })}
                    > B </Box>
                    <p className="text-center">{basic}</p>
                  </div>

                  <div >
                    <Box
                      sx={{
                        width: "100%",
                        height: "30px",
                        backgroundColor: "orange",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "black",
                        cursor: "pointer",
                        padding: "10px"
                      }}
                      onClick={() => handleNavigation("/alertstable", { Status: "Critical" })}
                    >C</Box>
                    <p className="text-center">{cretical}</p></div>
                  <div style={{ height: "30px" }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "30px",
                        backgroundColor: "red",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "black",
                        cursor: "pointer",
                        padding: "10px"
                      }}
                      onClick={() => handleNavigation("/alertstable", { Status: "Sevier" })}
                    >S</Box>
                    <p className="text-center">{sevier}</p></div>
                </Box>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
        {/* second grid */}
        <Grid container spacing={2}>
          <Grid item lg={4} md={4} sm={6} xs={12}>
            <Card
              sx={{
                backgroundColor: "#5F6F65",
                borderRadius: "12px",
                width: "100%",
                padding: "3px",
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
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <CameraAltIcon sx={{ color: "yellow" }} />
                    <Typography variant="subtitle1" color="white">
                      Total Camera
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ color: "#00cc00" }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ marginTop: "10px", fontWeight: "bold", color: "white" }}
                >
                  {totalCameras}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#00cc00",
                    cursor: "pointer",
                  }}
                  onClick={() => handleNavigation("/all-camera", { Status: "All" })}
                >
                  View Details
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={4} md={4} sm={6} xs={12}>
            <Card
              sx={{
                backgroundColor: "#405D72",
                borderRadius: "12px",
                width: "100%",
                padding: "3px",
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
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <LinkedCameraIcon sx={{ color: "white" }} />
                    <Typography variant="subtitle1" color="white">
                      Active Camera
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ color: "#00cc00" }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ marginTop: "10px", fontWeight: "bold", color: "white" }}
                >
                  {activeCameras}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#00cc00",
                    cursor: "pointer",
                  }}
                  onClick={() => handleNavigation("/all-camera", { Status: "Active" })}
                >
                  View Details
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={4} md={4} sm={6} xs={12}>
            <Card
              sx={{
                backgroundColor: "#538392",
                borderRadius: "12px",
                width: "100%",
                padding: "3px",
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
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <NoPhotographyIcon sx={{ color: "red" }} />
                    <Typography variant="subtitle1" color="white">
                      Inactive Camera
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ color: "#00cc00" }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ marginTop: "10px", fontWeight: "bold", color: "white" }}
                >
                  {inactiveCameras}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#00cc00",
                    cursor: "pointer",
                  }}
                  onClick={() => handleNavigation("/all-camera", { Status: "Inactive" })}
                >
                  View Details
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>


        <Grid container spacing={3}>
          {/* Weekly Data Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                padding: 2,
                backgroundColor: "#2F3645",
                color: "white",
                marginTop: "20px",
                borderRadius: "30px", // Set border-radius
              }}
            >
              <Typography variant="h6" gutterBottom>
                Camera Alert
              </Typography>
              <Box>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="0 0" stroke="#333" />
                    <XAxis dataKey="day" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "transparent",
                        border: "none",
                        boxShadow: "none",
                        color: "#fff", // Optional: set text color to ensure readability on dark backgrounds
                      }}
                      cursor={false} // Optional: removes the hover cursor effect
                    />
                    <Bar
                      dataKey="value"
                      fill="rgba(128, 175, 129, 0.6)"
                      radius={[30, 30, 0, 0]} // Rounded corners for bars (only top corners here)
                      style={{ stroke: "#fff", strokeWidth: 0 }} // Thin border
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          {/* Camera Streaming Chart */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                padding: 2,
                backgroundColor: "#344C64",
                color: "white",
                marginTop: "20px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Camera Streaming
              </Typography>
              <Box>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={streamingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="time" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#82ca9d"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Alert Notifications Table */}
        {/* <Grid container spacing={3} style={{ marginTop: "30px" }}>
          <Grid item xs={12}>
            <Card
              sx={{
                padding: 2,
                backgroundColor: "#1c1c1c",
                color: "white",
                borderRadius: "12px", // Rounded corners
                boxShadow: 3, // Shadow effect
              }}
            >
              <Typography variant="h6" gutterBottom>
                Alert Notifications
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#2c2c2c", // Slightly lighter dark background for contrast
                  color: "white",
                  borderRadius: "8px", // Rounded corners for the table container
                  overflow: "hidden", // Ensures rounded corners are visible
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className="text-white"
                        sx={{ fontWeight: "bold", backgroundColor: "#333" }}
                      >
                        Total Alerts
                      </TableCell>
                      <TableCell
                        className="text-white"
                        sx={{ fontWeight: "bold", backgroundColor: "#333" }}
                      >
                        Critical Alerts
                      </TableCell>
                      <TableCell
                        className="text-white"
                        sx={{ fontWeight: "bold", backgroundColor: "#333" }}
                      >
                        Severe Alerts
                      </TableCell>
                      <TableCell
                        className="text-white"
                        sx={{ fontWeight: "bold", backgroundColor: "#333" }}
                      >
                        Normal Alerts
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-white">50</TableCell>
                      <TableCell className="text-white">10</TableCell>
                      <TableCell className="text-white">15</TableCell>
                      <TableCell className="text-white">25</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid> */}

        {/* Map component */}
        <div style={{ height: "500px", marginTop: "30px" }}>
          <MapContainer
            center={[23, 77]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
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
                        <Typography variant="body2">
                          <strong>Installation Date:</strong>{" "}
                          {camera.installationDate || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Last Service:</strong>{" "}
                          {camera.lastService || "N/A"}
                        </Typography>
                      </div>
                    </Tooltip>
                  </Marker>
                )
            )}
            {hotspots.map((hotspot) => (
              <Marker
                key={hotspot.name}
                position={hotspot.position}
                icon={L.icon({
                  iconUrl: markerIcon,
                  iconRetinaUrl: markerIconRetina,
                  shadowUrl: markerShadow,
                  iconSize: [30, 45],
                  iconAnchor: [15, 45],
                  popupAnchor: [0, -45],
                  shadowSize: [41, 41],
                  className: "hotspot-icon",
                })}
              >
                <Tooltip>
                  <Typography variant="body2">{hotspot.name}</Typography>
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </ContentBox>
    </Fragment>
  );
}
