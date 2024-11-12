import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
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
} from "@mui/material";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import { IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { API, token } from "serverConnection";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
// import { ObjectDetection } from "../../object/ObjectDetection";
import { useNavigate } from "react-router-dom";
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

  const location = useLocation();
  const state = location.state || {}; // Default to an empty object if no state is present
  const status = state.Status; // Ensure the property name matches what was passed

  // console.log(status)
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get(`${API}/api/Camera/Pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let filteredData = response.data.cameras;
        console.log(filteredData);
  
        if (status === "Active") {
          filteredData = filteredData.filter(camera => camera.status === true);
        } else if (status === "Inactive") {
          filteredData = filteredData.filter(camera => camera.status === false);
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
        const response = await fetch('/api/cameras'); // Replace with your API endpoint
        const data = await response.json();
        let filteredData = data.cameras;

        // Apply status-based filtering
        if (status === "Active") {
          filteredData = data.cameras.filter(camera => camera.status === "Active");
        } else {
          // Handle other statuses or default to all cameras
          filteredData = data.cameras;
        }

        // Set the filtered data
        setCameras(filteredData);
      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
    };

    fetchData();
  }, [status]); // Refetch data if status changes

  useEffect(() => {
    // Dynamic search filtering
    const filtered = cameras.filter(
      (camera) =>
        camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camera.cameraIP.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camera.groupId.toString().includes(searchQuery.toString()) ||
        camera.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
    setPage(0); // Reset page when search results change
  }, [searchQuery, cameras]); // Refilter when searchQuery or cameras change


  const fetchCameras = async () => {
    try {
      const response = await axios.get(`${API}/api/Camera/Pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let filteredData = response.data.cameras
      console.log(filteredData)
      if (status === "All") {
        filteredData = filteredData
      }
      else if (status === "Active") {
        filteredData = filteredData.filter(camera => camera.status === true)

      }
      else if (status === "Inactive") {
        filteredData = filteredData.filter(camera => camera.status === false)

      }
      else {
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
    if (currentCamera) {
      try {
        await axios.delete(`${API}/api/Camera/${currentCamera.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCameras((prevCameras) =>
          prevCameras.filter((cam) => cam.id !== currentCamera.id)
        );
        setSearchResults((prevSearchResults) =>
          prevSearchResults.filter((cam) => cam.id !== currentCamera.id)
        );
        setDeleteDialogOpen(false);
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
    const worksheet = XLSX.utils.json_to_sheet(searchResults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cameras");
    XLSX.writeFile(workbook, "cameras.xlsx");
  };


  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Camera List", 14, 16);

    const tableColumn = [
      "S.No.",
      "Name",
      "Camera IP",
      "Group ID",
      "Area",
      "Brand",
      "MAC Address",
      "Manufacture Date",
      "Last Live",
      "Location",
      "Status",
    ];
    const tableRows = searchResults.map((camera) => [
      camera.id,
      camera.name,
      camera.cameraIP,
      camera.groupId,
      camera.area,
      camera.brand,
      camera.macAddress,
      camera.manufacture,
      camera.lastLive,
      camera.location,
      camera.status,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("cameras.pdf");
  };

  return (
    <Box sx={{backgroundColor:"white"}} width="100%" overflow="auto">
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
              borderRadius: '30px',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '30px',
                '& input': {
                  padding: '10px', // Set padding to 0px
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
            sx={{ ml: 1 ,borderRadius:"30px",background:"#4A628A"}}
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
      <TableHead style={{background:'#4A628A'}} >
  <TableRow >
    <TableCell className="text-center text-light" style={{ borderTopLeftRadius: '10px', overflow: 'hidden' }} >S.No.</TableCell>
    <TableCell className="text-light" >Camera Name</TableCell>
    <TableCell className="text-light" >Camera IP</TableCell>
    <TableCell className="text-light" >Group ID</TableCell>
    <TableCell className="text-light" >Area</TableCell>
    <TableCell className="text-light" >Model</TableCell>
    <TableCell className="text-light" >MAC Address</TableCell>
    <TableCell className="text-light" >Make</TableCell>
    <TableCell className="text-light" >Location</TableCell>
    <TableCell className="text-light"  style={{borderTopRightRadius: '10px', overflow: 'hidden' }}>Actions</TableCell>
  </TableRow>
</TableHead>

        <TableBody>
          {searchResults
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((camera, index) => (
              <TableRow key={camera.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>
                  {camera.name}
                </TableCell>
                <TableCell>{camera.cameraIP}</TableCell>
                <TableCell>{camera.groupId}</TableCell>
                <TableCell>{camera.area}</TableCell>
                <TableCell>{camera.brand}</TableCell>
                <TableCell>{camera.macAddress}</TableCell>
                <TableCell>{camera.manufacture}</TableCell>
                <TableCell>
                  <LocationOnIcon sx={{ color: 'green', mr: 0.5 }} />
                  {camera.location}
                </TableCell>
                <TableCell>
                <IconButton onClick={() => handleEditClick(camera)}>
                  <EditIcon sx={{ color: '#7AB2D3' }} />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(camera)}>
                  <DeleteOutlineIcon sx={{ color: '#F95454' }} />
                </IconButton>
              </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>
      {/* <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={searchResults.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}

      {/* Pagination start */}

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

      {/* Pagination end */}

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
              <TextField
                label="NVR ID"
                name="nvrId"
                value={formValues.nvrId}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Group ID"
                name="groupId"
                value={formValues.groupId}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
            </div>
            <div className="col-6">
              <TextField
                label="RTSP URL"
                name="rtspurl"
                value={formValues.rtspurl}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
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
              <TextField
                label="Area"
                name="area"
                value={formValues.area}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Brand"
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
                label="Manufacture Date"
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
    </Box>
  );
}
