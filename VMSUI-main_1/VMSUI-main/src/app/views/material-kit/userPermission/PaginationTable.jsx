import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { API, token } from "serverConnection";

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

export default function PaginationTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [subscribers, setSubscribers] = useState([]);
  const [newEntry, setNewEntry] = useState({ username: "", cameraname: "" });
  const [errors, setErrors] = useState({ username: false, cameraname: false });

  // State for storing user and camera options fetched from API
  const [userOptions, setUserOptions] = useState([]);
  const [cameraNameOptions, setCameraNameOptions] = useState([]);

  // State for new toggle buttons
  const [snapshot, setSnapshot] = useState(false);
  const [recording, setRecording] = useState(false);
  const [tracking, setTracking] = useState(false);

  // Edit dialog state
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editSubscriber, setEditSubscriber] = useState(null);

  useEffect(() => {
    fetchCameraPermissionData();
  }, []);
    // Fetch the data when the component mounts
    const fetchCameraPermissionData = async () => {
      try {
        const response = await axios.get(
          `${API}/api/UserCameraPermission/GetAll`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );

        // Assuming the API returns a list of user-camera permissions
        const permissions = response.data;

        // Extracting users and camera names from the nested objects
        const users = permissions.map((permission) => permission.user.username);
        const cameras = permissions.map((permission) => permission.camera.name);

        setUserOptions(users);
        setCameraNameOptions(cameras);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // const handleStatusToggle = (index, field) => {
  //   setSubscribers((prevSubscribers) =>
  //     prevSubscribers.map((subscriber, i) => {
  //       if (i === index) {
  //         if (field === "status") {
  //           return {
  //             ...subscriber,
  //             status: subscriber.status === "open" ? "close" : "open",
  //           };
  //         } else {
  //           return { ...subscriber, [field]: !subscriber[field] };
  //         }
  //       }
  //       return subscriber;
  //     })
  //   );
  // };
  const handleStatusToggle = (index) => {
    const cameraToUpdate = subscribers[index];
    const updatedStatus = !cameraToUpdate.status; // Toggle the status

    // Optimistically update local state
    const updatedSubscribers = subscribers.map((subscriber, i) => 
      i === index ? { ...subscriber, status: updatedStatus } : subscriber
    );
    setSubscribers(updatedSubscribers);

    // Prepare the payload with necessary fields like ID and status
    const payload = {
      id: cameraToUpdate.id,
      status: updatedStatus,
    };

    // Send the status update to the API
    axios
      .put(
        `${API}/api/UserCameraPermission/update-status`,
        payload, // Send the proper payload to the API
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }, 
        }
      )
      .then(() => {
        console.log("Status updated successfully");
        fetchCameraPermissionData();
      })
      .catch((error) => {
        console.error(
          "Error updating status:",
          error.response?.data || error.message
        );
        // Revert local state on error
        setSubscribers(subscribers);
      });
  };

  const validateForm = () => {
    const newErrors = {
      username: newEntry.username === "",
      cameraname: newEntry.cameraname === "",
    };
    setErrors(newErrors);
    return !newErrors.username && !newErrors.cameraname;
  };

  const handleAddEntry = () => {
    if (!validateForm()) {
      return;
    }

    // Generate a unique serial number for the new entry
    const newSno = (subscribers.length + 1).toString();

    // Add the new entry to the subscribers list
    const newSubscriber = {
      sno: newSno,
      user: newEntry.username,
      cameraname: newEntry.cameraname,
      status: "close",
      snapshot,
      recording,
      tracking,
    };

    setSubscribers([...subscribers, newSubscriber]);

    // Clear the form and toggle buttons
    setNewEntry({ username: "", cameraname: "" });
    setSnapshot(false);
    setRecording(false);
    setTracking(false);
  };

  const handleDelete = (index) => {
    setSubscribers((prevSubscribers) =>
      prevSubscribers.filter((_, i) => i !== index)
    );
  };

  const handleEditClick = (subscriber, index) => {
    setEditSubscriber({ ...subscriber, index });
    setOpenEditDialog(true);
  };

  const handleEditSave = () => {
    if (editSubscriber) {
      const { index, ...updatedSubscriber } = editSubscriber;
      setSubscribers((prevSubscribers) =>
        prevSubscribers.map((subscriber, i) =>
          i === index ? updatedSubscriber : subscriber
        )
      );
      setOpenEditDialog(false);
    }
  };

  return (
    <Box width="100%" overflow="auto">
      {/* Add Entry Form */}
      <Box display="flex" alignItems="center" mb={2} mt={1}>
        {/* Form Fields */}
        <FormControl
          variant="outlined"
          size="small"
          sx={{ mr: 2, width: "300px" }}
          error={errors.username}
        >
          <InputLabel>User</InputLabel>
          <Select
            label="User"
            value={newEntry.username}
            onChange={(e) =>
              setNewEntry({ ...newEntry, username: e.target.value })
            }
          >
            {userOptions.map((user, index) => (
              <MenuItem key={index} value={user}>
                {user}
              </MenuItem>
            ))}
          </Select>
          {errors.username && <FormHelperText>User is required</FormHelperText>}
        </FormControl>
        <FormControl
          variant="outlined"
          size="small"
          sx={{ mr: 2, width: "300px" }}
          error={errors.cameraname}
        >
          <InputLabel>Camera Name</InputLabel>
          <Select
            label="Camera Name"
            value={newEntry.cameraname}
            onChange={(e) =>
              setNewEntry({ ...newEntry, cameraname: e.target.value })
            }
          >
            {cameraNameOptions.map((camera, index) => (
              <MenuItem key={index} value={camera}>
                {camera}
              </MenuItem>
            ))}
          </Select>
          {errors.cameraname && (
            <FormHelperText>Camera Name is required</FormHelperText>
          )}
        </FormControl>
        {/* Toggle Buttons */}
        <Box display="flex" alignItems="center" mr={2}>
          <FormControl size="small" sx={{ mr: 2 }}>
            <Switch
              checked={snapshot}
              onChange={() => setSnapshot((prev) => !prev)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "orange",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "orange",
                },
              }}
            />
            Snapshot
          </FormControl>
          <FormControl size="small" sx={{ mr: 2 }}>
            <Switch
              checked={recording}
              onChange={() => setRecording((prev) => !prev)}
            />
            Recording
          </FormControl>
          <FormControl size="small" sx={{ mr: 2 }}>
            <Switch
              checked={tracking}
              onChange={() => setTracking((prev) => !prev)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "green",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "green",
                },
              }}
            />
            Tracking
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" onClick={handleAddEntry}>
          Submit
        </Button>
      </Box>

      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left">Sno.</TableCell>
            <TableCell align="left">User Name</TableCell>
            <TableCell align="left">Camera Name</TableCell>
            <TableCell align="left">Snapshot</TableCell>
            <TableCell align="left">Recording</TableCell>
            <TableCell align="left">Tracking</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscribers
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((subscriber, index) => (
              <TableRow key={index}>
                <TableCell align="left">{subscriber.sno}</TableCell>
                <TableCell align="left">{subscriber.user}</TableCell>
                <TableCell align="left">{subscriber.cameraname}</TableCell>
                <TableCell align="left">
                  <Switch
                    checked={subscriber.snapshot}
                    onChange={() => handleStatusToggle(index, "snapshot")}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "orange",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "orange",
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="left">
                  <Switch
                    checked={subscriber.recording}
                    onChange={() => handleStatusToggle(index, "recording")}
                  />
                </TableCell>
                <TableCell align="left">
                  <Switch
                    checked={subscriber.tracking}
                    onChange={() => handleStatusToggle(index, "tracking")}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "green",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "green",
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Switch
                    checked={subscriber.status}
                    onChange={() => handleStatusToggle(index)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleEditClick(subscriber, index)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>

      <TablePagination
        component="div"
        page={page}
        rowsPerPage={rowsPerPage}
        count={subscribers.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Subscriber</DialogTitle>
        <DialogContent>
          <TextField
            label="User Name"
            fullWidth
            value={editSubscriber?.user || ""}
            onChange={(e) =>
              setEditSubscriber({
                ...editSubscriber,
                user: e.target.value,
              })
            }
            margin="normal"
          />
          <TextField
            label="Camera Name"
            fullWidth
            value={editSubscriber?.cameraname || ""}
            onChange={(e) =>
              setEditSubscriber({
                ...editSubscriber,
                cameraname: e.target.value,
              })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
