import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  Switch,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Typography,
  Select,
  TableSortLabel,
} from "@mui/material";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import { IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { API, detection, Stream, StreamAPI, token } from "serverConnection";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
// import { ObjectDetection } from "../../object/ObjectDetection";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

export default function CameraList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [cameras, setCameras] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete dialog
  const [currentCamera, setCurrentCamera] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    cameraIP: "",
    location: "",
    port: "",
    channelId: "",
    nvrId: "",
    groupId: "",
    area: "",
    brand: "",
    macAddress: "",
    manufacture: "",
    rtspurl: "",
    latitude: "",
    longitude: "",
    lastLive: "",
  });

  //Pagination start
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPageNumber(1);
  };
  // Pagination end

  //map show
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [coordinates, setCoordinates] = useState({ lat: null, long: null });

  const handleShow = (lat, long) => {
    setCoordinates({ lat, long }); // Save the latitude and longitude in state
    setShow(true); // Set show to true, to display something (e.g., a map or modal)
  };

  //map end

  const location = useLocation();
  const state = location.state || {}; // Default to an empty object if no state is present
  const status = state.Status; // Ensure the property name matches what was passed

  // console.log(status)
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get(
          `${API}/api/Camera/Pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let filteredData = response.data.cameras;
        // console.log(filteredData);

        if (status === "Active") {
          filteredData = filteredData.filter(
            (camera) => camera.status === true
          );
        } else if (status === "Inactive") {
          filteredData = filteredData.filter(
            (camera) => camera.status === false
          );
        } else if (status === "All" || !status) {
          // No filtering needed if status is "All" or not defined
          filteredData = filteredData;
        }

        setCameras(filteredData);
        setSearchResults(response.data.cameras);
        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras();
  }, [pageNumber, pageSize, status]);

  const navigate = useNavigate();

  const handleClick = () => {
    // Replace '/target-path' with the path you want to navigate to
    navigate("/add-camera");
  };

  useEffect(() => {
    // Fetch cameras from API or other source
    const fetchData = async () => {
      try {
        const response = await fetch("/api/cameras"); // Replace with your API endpoint
        const data = await response.json();
        let filteredData = data.cameras;

        // Apply status-based filtering
        if (status === "Active") {
          filteredData = data.cameras.filter(
            (camera) => camera.status === "Active"
          );
        } else {
          // Handle other statuses or default to all cameras
          filteredData = data.cameras;
        }

        // Set the filtered data
        setCameras(filteredData);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchData();
  }, [status]); // Refetch data if status changes

  // Sorting state
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc"; // If currently sorted ascending, change to descending
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      const aValue = a[orderBy],
        bValue = b[orderBy];

      if (aValue == null || bValue == null) return 0;

      // Handle numerical comparison for numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      // Use localeCompare for strings, or convert to string for mixed types
      return (
        aValue.toString().localeCompare(bValue.toString()) *
        (order === "asc" ? 1 : -1)
      );
    });
  };
  const sortedResults = sortData([...searchResults]);

  useEffect(() => {
    // Dynamic search filtering
    const filtered = cameras.filter(
      (camera) =>
        camera.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camera.cameraIP?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camera.groupId?.toString().includes(searchQuery.toString()) ||
        camera.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camera.macAddress?.toString().includes(searchQuery.toString()) ||
        camera.make?.toString().includes(searchQuery.toString()) ||
        camera.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
    setPage(0); // Reset page when search results change
  }, [searchQuery, cameras]); // Refilter when searchQuery or cameras change

  const fetchCameras = async () => {
    try {
      const response = await axios.get(
        `${API}/api/Camera/Pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let filteredData = response.data.cameras;
      if (status === "All") {
        filteredData = filteredData;
      } else if (status === "Active") {
        filteredData = filteredData.filter((camera) => camera.status === true);
      } else if (status === "Inactive") {
        filteredData = filteredData.filter((camera) => camera.status === false);
      } else {
        filteredData = filteredData;
      }
      setCameras(filteredData);

      setSearchResults(response.data.cameras);
      setTotalPages(Math.ceil(response.data.totalCount / pageSize));
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  // const handleChangePage = (_, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  const handleStatusToggle = (index) => {
    const cameraToUpdate = cameras[index];
    const updatedStatus = !cameraToUpdate.status; // Toggle the status

    // Optimistically update local state
    const updatedSubscribers = cameras.map((subscriber, i) =>
      i === index ? { ...subscriber, status: updatedStatus } : subscriber
    );
    setCameras(updatedSubscribers);

    // Prepare the payload with necessary fields like ID and status
    const payload = {
      id: cameraToUpdate.id,
      status: updatedStatus,
    };

    // Send the status update to the API
    axios
      .put(
        `${API}/api/Camera/update-status`,
        payload, // Send the proper payload to the API
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        console.log("Status updated successfully");
        fetchCameras();
      })
      .catch((error) => {
        console.error(
          "Error updating status:",
          error.response?.data || error.message
        );
        // Revert local state on error
        setCameras(cameras);
      });
  };

  const handleDeleteClick = (camera) => {
       setCurrentCamera(camera);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const postData = {
      objectlist: [],
      camera_id: currentCamera.id, // Ensure camera_id is an integer
      url: currentCamera.rtspurl,
      camera_ip: currentCamera.cameraIP,
      running: "false",
    };
    if (currentCamera) {
        console.log(currentCamera,"wwwdwdw")
      try {
        await axios.delete(`${API}/api/Camera/${currentCamera.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await axios.post(`${detection}/details`, { cameras: [postData] });
        fetchCameras()
        alert("delete successfully")
        setDeleteDialogOpen(false);
        // await axios.delete(`${Stream}/remove_camera/${currentCamera.name}`, {
        //   // headers: {
        //   //   Authorization: `Bearer ${token}`,
        //   // },
        // });

        await axios.delete(
          `${StreamAPI}/stop_recording/${currentCamera.name}`,
          {
            // headers: {
            //   Authorization: `Bearer ${token}`,
            // },
          }
        );

        // await axios.delete(`${API}/api/Camera/${currentCamera.id}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        setCameras((prevCameras) =>
          prevCameras.filter((cam) => cam.id !== currentCamera.id)
        );
        setSearchResults((prevSearchResults) =>
          prevSearchResults.filter((cam) => cam.id !== currentCamera.id)
        );
        
      } catch (error) {
        console.error("Error deleting camera:", error);
      }
    }
  };

  const handleEditClick = (camera) => {
    setCurrentCamera(camera);
    setFormValues({
      name: camera.name,
      cameraIP: camera.cameraIP,
      location: camera.location,
      port: camera.port,
      channelId: camera.channelId,
      nvrId: camera.nvrId,
      groupId: camera.groupId,
      area: camera.area,
      brand: camera.brand,
      macAddress: camera.macAddress,
      manufacture: camera.manufacture,
      rtspurl: camera.rtspurl,
      latitude: camera.latitude,
      longitude: camera.longitude,
      // status: camera.status,
      lastLive: camera.lastLive,
    });
    setEditDialogOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    if (currentCamera) {
      try {
        const updatedCamera = {
          ...formValues,
          id: currentCamera.id,
          lastLive: new Date().toISOString(),
        };

        await axios.put(`${API}/api/Camera`, updatedCamera, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Updated camera:", updatedCamera);

        setCameras((prevCameras) =>
          prevCameras.map((cam) =>
            cam.id === currentCamera.id ? updatedCamera : cam
          )
        );
        setSearchResults((prevSearchResults) =>
          prevSearchResults.map((cam) =>
            cam.id === currentCamera.id ? updatedCamera : cam
          )
        );
        setEditDialogOpen(false);
      } catch (error) {
        console.error("Error updating camera:", error);
      }
    }
  };

  const downloadAsExcel = () => {
    const formattedResults = searchResults.map((item, index) => ({
      "S.No.": index + 1,
      Name: item.name,
      "Camera IP": item.cameraIp,
      Zone: item.zone,
      Model: item.brand,
      "MAC Address": item.macAddress,
      "Make": item.manufacture,
      Location: item.location,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedResults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cameras");
    XLSX.writeFile(workbook, "cameras.xlsx");
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text("Camera List", 14, 16);

    const tableColumn = [
      "S.No.",
      "Name",
      "Camera IP",
      "Zone",
      "Model",
      "MAC Address",
      "Make",
      "Location",
    ];
    const tableRows = searchResults.map((camera, index) => [
      index,
      camera.name,
      camera.cameraIP,
      camera.groupId,
      camera.brand,
      camera.macAddress,
      camera.manufacture,
      camera.location,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("cameras.pdf");
  };

  return (
    <Box sx={{ backgroundColor: "white" }} width="100%" overflow="auto">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        mb={2}
      >
        <Box display="flex" alignItems="center">
          <TextField
            className="p-0 w-100"
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: "100%",
              borderRadius: "30px",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                "& input": {
                  padding: "10px", // Set padding to 0px
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            className="w-100"
            variant="contained"
            sx={{ ml: 1, borderRadius: "30px", background: "#4A628A" }}
            onClick={handleClick}
          >
            + Camera
          </Button>
        </Box>
        <Box>
          <IconButton onClick={downloadAsExcel} title="Export to Excel">
            <SimCardDownloadIcon className="text-success" />
          </IconButton>
          <IconButton onClick={downloadAsPDF} title="Export to PDF">
            <PictureAsPdfIcon className="text-warning" />
          </IconButton>
        </Box>
      </Box>

      <StyledTable>
        <TableHead style={{ background: "#4A628A" }}>
          <TableRow>
            <TableCell
              className="text-center text-light"
              style={{ borderTopLeftRadius: "10px", overflow: "hidden" }}
            >
              S.No.
            </TableCell>
            <TableCell className="text-light">
              <TableSortLabel
                className="text-light"
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleSort("name")}
              >
                Camera Name
              </TableSortLabel>
            </TableCell>
            <TableCell className="text-light">
              <TableSortLabel
                className="text-light"
                active={orderBy === "cameraIP"}
                direction={orderBy === "cameraIP" ? order : "asc"}
                onClick={() => handleSort("cameraIP")}
              >
                {" "}
                Camera IP
              </TableSortLabel>
            </TableCell>
            <TableCell className="text-light">
              <TableSortLabel
                className="text-light"
                active={orderBy === "groupId"}
                direction={orderBy === "groupId" ? order : "asc"}
                onClick={() => handleSort("groupId")}
              >
                {" "}
                Zone
              </TableSortLabel>
            </TableCell>
            {/* <TableCell
              className="text-light"
            >
              <TableSortLabel 
               className="text-light"
               active={orderBy === "area"}
               direction={orderBy === "area" ? order : "asc"}
               onClick={() => handleSort("area")}> Area
               </TableSortLabel>
            </TableCell> */}
            <TableCell className="text-light">
              <TableSortLabel
                className="text-light"
                active={orderBy === "brand"}
                direction={orderBy === "brand" ? order : "asc"}
                onClick={() => handleSort("brand")}
              >
                {" "}
                Model
              </TableSortLabel>
            </TableCell>
            <TableCell className="text-light">
              <TableSortLabel
                className="text-light"
                active={orderBy === "macAddress"}
                direction={orderBy === "macAddress" ? order : "asc"}
                onClick={() => handleSort("macAddress")}
              >
                {" "}
                MAC Address
              </TableSortLabel>
            </TableCell>
            <TableCell className="text-light">
              <TableSortLabel
                className="text-light"
                active={orderBy === "manufacture"}
                direction={orderBy === "manufacture" ? order : "asc"}
                onClick={() => handleSort("manufacture")}
              >
                {" "}
                Make
              </TableSortLabel>
            </TableCell>
            <TableCell className="text-light">
              <TableSortLabel
                className="text-light"
                active={orderBy === "location"}
                direction={orderBy === "location" ? order : "asc"}
                onClick={() => handleSort("location")}
              >
                {" "}
                Location
              </TableSortLabel>
            </TableCell>
            <TableCell
              className="text-light"
              style={{ borderTopRightRadius: "10px", overflow: "hidden" }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedResults.map((camera, index) => (
            <TableRow key={camera.id}>
              <TableCell className="text-center">
                {(pageNumber - 1) * pageSize + index + 1}
              </TableCell>
              <TableCell>{camera.name}</TableCell>
              <TableCell>{camera.cameraIP}</TableCell>
              <TableCell>{camera.groupId}</TableCell>
              {/* <TableCell>{camera.area}</TableCell> */}
              <TableCell>{camera.brand}</TableCell>
              <TableCell>{camera.macAddress}</TableCell>
              <TableCell>{camera.manufacture}</TableCell>
              <TableCell>
                <LocationOnIcon
                  sx={{ color: "green", mr: 0.5, cursor: "pointer" }}
                  onClick={() => handleShow(camera.latitude, camera.longitude)}
                />
                {camera.location}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditClick(camera)}>
                  <EditIcon sx={{ color: "#7AB2D3" }} />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(camera)}>
                  <DeleteOutlineIcon sx={{ color: "#F95454" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          mt: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
          sx={{ mr: 0 }}
        >
          Previous
        </Button>

        <Typography variant="body1" sx={{ mx: 2 }}>
          Page {pageNumber} of {totalPages || 1}
        </Typography>

        <Button
          variant="contained"
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber === totalPages}
          sx={{ mr: 2 }}
        >
          Next
        </Button>

        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          variant="outlined"
          sx={{ ml: 2 }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>

        {/* <Typography variant="body2" sx={{ ml: 1 }}>
          items per page
        </Typography> */}
      </Box>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Camera</DialogTitle>
        <DialogContent>
          <div className="row">
            <div className="col-6">
              <TextField
                label="Name"
                name="name"
                value={formValues.name}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Camera IP"
                name="cameraIP"
                value={formValues.cameraIP}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Location"
                name="location"
                value={formValues.location}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Port"
                name="port"
                value={formValues.port}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />

              <TextField
                label="Channel ID"
                name="channelId"
                value={formValues.channelId}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
              {/* <TextField
                label="NVR ID"
                name="nvrId"
                value={formValues.nvrId}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              /> */}
              {/* <TextField
                label="Zone ID"
                name="groupId"
                value={formValues.groupId}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              /> */}
              <TextField
                label="Public URL"
                name="rtspurl"
                value={formValues.rtspurl}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className="col-6">
              <TextField
                label="Latitude"
                name="latitude"
                value={formValues.latitude}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Longitude"
                name="longitude"
                value={formValues.longitude}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
              {/* <TextField
                label="Area"
                name="area"
                value={formValues.area}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              /> */}
              <TextField
                label="Model"
                name="brand"
                value={formValues.brand}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="MAC"
                name="macAddress"
                value={formValues.macAddress}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Make"
                name="manufacture"
                value={formValues.manufacture}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleFormSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this camera?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
      {/* map modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Map</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            width="100%"
            height="450"
            style={{ border: "0" }} // Use an object for the style
            loading="lazy"
            allowFullScreen
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
              coordinates.long - 0.01
            },${coordinates.lat - 0.01},${coordinates.long + 0.01},${
              coordinates.lat + 0.01
            }&layer=mapnik&marker=${coordinates.lat},${coordinates.long}`}
            title="OpenStreetMap Location with Marker"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Box>
  );
}
