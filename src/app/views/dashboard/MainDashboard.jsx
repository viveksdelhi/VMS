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
  ResponsiveContainer,
} from "recharts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import LinkedCameraIcon from "@mui/icons-material/LinkedCamera";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import Fireworks from "Diwali";
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
  const [cameras, setCameras] = useState([]);

  //alerts data
  const [tableData, setTableData] = useState([]);
  const totalanalytics = tableData.length
  const basic = tableData.filter(data => data.alertStatus === "B").length
  const sevier = tableData.filter(data => data.alertStatus === "S").length
  const cretical = tableData.filter(data => data.alertStatus === "C").length
  
  const [showFireworks, setShowFireworks] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFireworks(false); // Hide the fireworks after 5 seconds
    }, 1/2 * 60 * 1000);

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);
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
      <ContentBox className="analytics" >
        {/* first grid */}
        <Grid container spacing={2} className="pb-4">
          <Grid item lg={4} md={4} sm={6} xs={12}>
            <Card
              sx={{
                backgroundColor: "rgba(76, 175, 80, 0.2)",// Light gray background
                borderLeft: "5px solid #4caf50", // Green left border
                borderRadius: "5px", // Slightly rounded corners
                width: "100%",
                boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important",
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
                  <Box
                    sx={{ display: "flex", alignItems: "center" }}
                  >
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
                  <Counter target={totalanalytics}/>
                    {/* {totalanalytics} */}
                  </Typography>
                  <AnalyticsIcon sx={{ color: "#000", fontSize: "50px" }} /> {/* Larger icon */}
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
                  onClick={() => handleNavigation("/dashboard")}
                >
                  View Details
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item lg={4} md={4} sm={6} xs={12}>
            <Card
              sx={{
                backgroundColor: "rgba(12, 173, 152, 0.2)",// Light gray background
                borderLeft: "5px solid #0cad98", // Green left border
                borderRadius: "5px", // Slightly rounded corners
                width: "100%",
                boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important",
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
                  <Box
                    sx={{ display: "flex", alignItems: "center" }}
                  >
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
                    <Counter target={totalanalytics}/>
                  </Typography>
                  <DirectionsCarFilledIcon sx={{ color: "#000", fontSize: "50px" }} />
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
                backgroundColor: "rgba(15, 65, 122, 0.2)",// Light gray background
                borderLeft: "5px solid #0f417a", // Green left border
                borderRadius: "5px", // Slightly rounded corners
                width: "100%",
                boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important",
                maxWidth: "100%", // Set a maximum width for a smaller card
                height: "134px"
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
                    <Typography variant="subtitle1" color="green">
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
                    <p className="text-center bg-warning" 
                    onClick={() => handleNavigation("/alertstable", { Status: "Basic" })}
                    style={{
                      cursor:"pointer",
                      padding: "8px 14px", borderRadius: "50%",
                      boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                    }}>B
                      {/* {basic} */}
                      </p>
                  </div>
                  <div className="m-0 p-0">
                    <p className="text-center"
                    onClick={() => handleNavigation("/alertstable", { Status: "Critical" })}
                     style={{
                      cursor:"pointer",
                      padding: "8px 14px", borderRadius: "50%",
                      background:"orange",
                      boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                    }}>C
                      {/* {cretical} */}
                      </p>
                  </div>
                  <div className="m-0 p-0">
                    <p className="text-center bg-danger"
                    onClick={() => handleNavigation("/alertstable", { Status: "Sevier" })}
                    style={{
                      cursor:"pointer",
                      padding: "8px 14px", borderRadius: "50%",
                      boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                    }}>S
                      {/* {sevier} */}
                      </p>
                  </div>
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
                backgroundColor: "rgba(156, 173, 26, 0.2)",// Light gray background
                borderLeft: "5px solid #9cad1a", // Green left border
                borderRadius: "5px", // Slightly rounded corners
                width: "100%",
                boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important",
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
                  <Box
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Typography variant="subtitle1" color="green">
                      Total Camera
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
                    <Counter target={totalCameras}/>
                  </Typography>
                  <CameraAltIcon sx={{ color: "#000", fontSize: "50px" }} />
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
                backgroundColor: "rgba(76, 175, 80, 0.2)",// Light gray background
                borderLeft: "5px solid #4caf50", // Green left border
                borderRadius: "5px", // Slightly rounded corners
                width: "100%",
                boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important",
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
                  <Box
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Typography variant="subtitle1" color="green">
                      Active Camera
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
                    <Counter target={activeCameras}/>
                  </Typography>
                  <CameraAltIcon sx={{ color: "#000", fontSize: "50px" }} />
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
                backgroundColor: "rgba(209, 55, 13, 0.2)",// Light gray background
                borderLeft: "5px solid #d1370d", // Green left border
                borderRadius: "5px", // Slightly rounded corners
                width: "100%",
                boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important",
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
                  <Box
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Typography variant="subtitle1" color="green">
                      Inactive Camera
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
                    <Counter target={inactiveCameras}/>
                  </Typography>
                  <CameraAltIcon sx={{ color: "#000", fontSize: "50px" }} />
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
                  onClick={() => handleNavigation("/all-camera", { Status: "Inactive" })}
                >
                  View Details
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* <Grid item lg={4} md={4} sm={6} xs={12}>
            <Card
              sx={{
                backgroundColor: "#538392",

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
          </Grid> */}

        </Grid>


        <Grid container spacing={3} className="mt-1">
          {/* Weekly Data Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                padding: 1,
                backgroundColor: "white",
                color: "white",
              }}
            >
              {/* <Typography variant="h6" gutterBottom>
                Camera Alert
              </Typography> */}
              <Box className="border-nome ">
                <ResponsiveContainer width="100%" height={200}>
                <iframe src="https://vmsgrafana.ajeevi.in/d-solo/fe2c25g1ki7swb/vms?from=1730205356749&to=1730205656751&timezone=browser&orgId=1&panelId=4&theme=light&__feature.dashboardSceneSolo" width="450" height="200" frameborder="0"></iframe>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          {/* Camera Streaming Chart */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                padding: 1,
                backgroundColor: "white",
                color: "white",
              }}
            >
              {/* <Typography variant="h6" gutterBottom>
                Camera Streaming
              </Typography> */}
              <Box>
                <ResponsiveContainer width="100%" height={200}>
                <iframe src="https://vmsgrafana.ajeevi.in/d-solo/fe2c25g1ki7swb/vms?from=now&to=now-5h&timezone=browser&orgId=1&panelId=2&theme=light&__feature.dashboardSceneSolo" width="450" height="200" frameborder="0"></iframe>                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                padding: 1,
                backgroundColor: "white",
                color: "white",
              }}
            >
              {/* <Typography variant="h6" gutterBottom>
                Camera Alert
              </Typography> */}
              <Box className="border-nome ">
                <ResponsiveContainer width="100%" height={200}>
                <iframe src="https://vmsgrafana.ajeevi.in/d-solo/fe2c25g1ki7swb/vms?from=1730205356749&to=1730205656751&timezone=browser&orgId=1&panelId=3&theme=light&__feature.dashboardSceneSolo" width="450" height="200" frameborder="0"></iframe>                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                padding: 1,
                backgroundColor: "white",
                color: "white",
              }}
            >
              {/* <Typography variant="h6" gutterBottom>
                Camera Alert
              </Typography> */}
              <Box className="border-nome ">
                <ResponsiveContainer width="100%" height={200}>
                <iframe src="https://vmsgrafana.ajeevi.in/d-solo/fe2c25g1ki7swb/vms?from=1730205356749&to=1730205656751&timezone=browser&orgId=1&panelId=1&theme=light&__feature.dashboardSceneSolo" width="450" height="200" frameborder="0"></iframe>                  </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>


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
      {/* {showFireworks && <Fireworks />} */}
    </Fragment>
  );
}
