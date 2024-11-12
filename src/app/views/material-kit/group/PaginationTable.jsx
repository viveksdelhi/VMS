import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell, //bst
  TableHead,
  TablePagination,
  Switch,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Typography,
  Select,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from "axios";
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
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({ name: false, description: false });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

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

  // Fetch Data from API
  const getApiData = () => {
    axios
      .get(`${API}/api/Group/Pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSubscribers(
          response.data.groups.map((subscriber) => ({
            ...subscriber,
            status: Boolean(subscriber.status), // Ensure status is a boolean
          }))
        );
        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
      })
      .catch((error) => {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      });
  };

  useEffect(() => {
    getApiData();
  }, [pageNumber, pageSize]);

  // Add or Edit Category
  const handleAddOrEditCategory = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (editIndex !== null) {
      handleEditCategory();
    } else {
      handleAddCategory();
    }
  };

  // Add a New Category
  const handleAddCategory = () => {
    axios
      .post(`${API}/api/Group`, newCategory, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSubscribers([...subscribers, response.data]);
        setNewCategory({ name: "", description: "" });
      })
      .catch((error) => {
        console.error(
          "Error adding category:",
          error.response?.data || error.message
        );
      });
  };

  // Edit an Existing Category
  const handleEditCategory = () => {
    // const categoryToEdit = subscribers[editIndex];

    axios
      .put(
        `${API}/api/Group/`,
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const updatedSubscribers = subscribers.map((subscriber, i) =>
          i === editIndex ? response.data : subscriber
        );
        setSubscribers(updatedSubscribers);
        setNewCategory({ name: "", description: "" });
        setEditIndex(null);
        getApiData();
      })
      .catch((error) => {
        console.error(
          "Error updating category:",
          error.response?.data || error.message
        );
      });
  };

  // Validate Form
  const validateForm = () => {
    const newErrors = {
      name: newCategory.name === "",
      description: newCategory.description === "",
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.description;
  };

  // Delete a Category
  const handleDeleteCategory = async () => {
    const categoryToDelete = subscribers[deleteIndex];

    try {
      await axios.delete(`${API}/api/Group/${categoryToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // On success, update the state and UI
      setSubscribers(subscribers.filter((_, i) => i !== deleteIndex));
      setOpenDeleteDialog(false);
      setDeleteIndex(null);
    } catch (error) {
      console.error(
        "Error deleting category:",
        error.response?.data || error.message
      );
    }
  };


  // Handle Page Change
  // const handlePageChange = (event, newPage) => {
  //   setPage(newPage);
  // };

  // // Handle Rows Per Page Change
  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  // Toggle Status
  const handleStatusToggle = (index) => {
    const subscriberToUpdate = subscribers[index];
    const updatedStatus = !subscriberToUpdate.status; // Toggle the status

    // Optimistically update local state
    const updatedSubscribers = subscribers.map((subscriber, i) =>
      i === index ? { ...subscriber, status: updatedStatus } : subscriber
    );
    setSubscribers(updatedSubscribers);

    // Prepare the payload with necessary fields like ID and status
    const payload = {
      id: subscriberToUpdate.id,
      status: updatedStatus,
    };

    // Send the status update to the API
    axios
      .put(
        `${API}/api/Group/update-status`,
        payload, // Send the proper payload to the API
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        console.log("Status updated successfully");
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


  const handleEdit = (index, id) => {
    setEditIndex(index);
    const subscriberToEdit = subscribers[index];
    setNewCategory({
      name: subscriberToEdit.name,
      description: subscriberToEdit.description,
      id: id,
    });
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleDeleteCancel = () => {

    setOpenDeleteDialog(false);
    setDeleteIndex(null);
  };

  return (
    <Box width="100%" overflow="auto">
      <form onSubmit={handleAddOrEditCategory}>
        <Box display="flex" alignItems="center" mb={2} mt={1}>
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            sx={{
              mr: 2,
              width: "41%",
              borderRadius: "30px", // Add border-radius here
              '& .MuiOutlinedInput-root': {
                borderRadius: "30px", // Ensure the inner input has the same border-radius
              },
            }}
            error={errors.name}
            helperText={errors.name ? "Name is required" : ""}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            size="small"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            sx={{
              mr: 2,
              width: "41%",
              borderRadius: "30px", // Add border-radius here
              '& .MuiOutlinedInput-root': {
                borderRadius: "30px", // Ensure the inner input has the same border-radius
              },
            }}
            error={errors.description}
            helperText={errors.description ? "Description is required" : ""}
            required
          />
          <Button variant="contained" color="primary" type="submit"
           sx={{ ml: 1 ,borderRadius:"30px",background:"#4A628A"}}>
            {editIndex !== null ? "Edit Hotspot" : "Add Hotspot"}
          </Button>
        </Box>
      </form>

      <StyledTable>
        <TableHead style={{ background: '#4A628A' }} >
          <TableRow>
            <TableCell className="text-center text-light" style={{ borderTopLeftRadius: '10px', overflow: 'hidden' }} >S.No.</TableCell>
            <TableCell className="text-light" align="left">Name</TableCell>
            <TableCell className="text-light" align="left">Description</TableCell>
            {/* <TableCell align="center">Status</TableCell> */}
            <TableCell className="text-light text-center" style={{ borderTopRightRadius: '10px', overflow: 'hidden' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {subscribers
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((subscriber, index) => (
              <TableRow key={subscriber.id}>
                <TableCell className="text-center" align="left">{index + 1}</TableCell>
                <TableCell align="left">{subscriber.name}</TableCell>
                <TableCell align="left">{subscriber.description}</TableCell>
                {/* <TableCell align="center">
                  <Switch
                    checked={subscriber.status}
                    onChange={() =>
                      handleStatusToggle(page * rowsPerPage + index, subscriber.status)
                    }
                  />
                </TableCell> */}
                <TableCell className="text-center">
                  <IconButton
                    onClick={() =>
                      handleEdit(page * rowsPerPage + index, subscriber.id)
                    }
                  >
                    <EditIcon sx={{ color: '#7AB2D3' }} />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handleDeleteClick(page * rowsPerPage + index)
                    }
                  >
                    <DeleteOutlineIcon sx={{ color: '#F95454' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>

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
          className="p-0"
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

      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>
          {"Are you sure you want to delete this category?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCategory} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
