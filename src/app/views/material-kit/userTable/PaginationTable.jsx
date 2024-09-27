import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,//
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { API, token } from "serverConnection";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": {
      "& th": { paddingLeft: 0, paddingRight: 0, cursor: "pointer" },
    },
  },
  "& tbody": {
    "& tr": {
      "& td": { paddingLeft: 0, textTransform: "capitalize" },
    },
  },
}));

export default function PaginationTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    mobileNo: "",
    username: "",
    roleId: "",
    password: "",
  });

  //Pagination start
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
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

  // Fetch users data using Axios with token
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/api/User/Pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users);
      setSearchResults(response.data.users); // Initialize search results with fetched users
      setTotalPages(Math.ceil(response.data.totalCount/pageSize));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  },  [pageNumber,pageSize]);


  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleStatusToggle = (index) => {
    const usersToUpdate = users[index];
    const updatedStatus = !usersToUpdate.status; // Toggle the status
  
    // Optimistically update local state
    const updatedUsers = users.map((user, i) =>
      i === index ? { ...user, status: updatedStatus } : user
    );
    setUsers(updatedUsers);
  
    // Prepare the payload with necessary fields like ID and status
    const payload = {
      id: usersToUpdate.id,
      status: updatedStatus,
    };
  
    // Send the status update to the API
    axios
      .put(
        `${API}/api/User/update-status`, // Ensure correct endpoint
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        console.log("Status updated successfully");
        fetchUsers();
      })
      .catch((error) => {
        console.error(
          "Error updating status:",
          error.response?.data || error.message
        );
        // Revert local state on error
        setUsers(users);
      });
  };
  

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditData({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      mobileNo: user.mobileNo || "", // Optional
      username: user.username,
      roleId: user.roleId,
      status: user.status,
      password: user.password,
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`${API}/api/User`, editData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpenDialog(false);
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...user, ...editData } : user
      );
      setUsers(updatedUsers);
      setSearchResults(updatedUsers); // Update search results too
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSearch = () => {
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.emailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
    setPage(0);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API}/api/User/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      setSearchResults(updatedUsers); // Update search results too
      setOpenDeleteDialog(false); // Close delete dialog
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  // Sorting logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...searchResults].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setSearchResults(sortedData);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("User Data", 10, 10);

    searchResults.forEach((user, index) => {
      doc.text(`${index + 1}. ${user.firstName} ${user.lastName}`, 10, 20 + index * 10);
    });

    doc.save("user_data.pdf");
  };

  const handleDownloadDOCX = () => {
    // Create a new document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "User Data",
                  bold: true,
                }),
              ],
            }),
            ...searchResults.map((user, index) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. ${user.firstName} ${user.lastName}`,
                  }),
                ],
              })
            ),
          ],
        },
      ],
    });
  
    // Pack the document and save it
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "user_data.docx");
    }).catch((error) => {
      console.error("Error generating DOCX file:", error);
    });
  };
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(searchResults);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User Data");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "user_data.xlsx");
  };

  return (
    <Box width="100%" overflow="auto">
      {/* Search and Download buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
        <Box display="flex" alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: "100%" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box display="flex" gap={1}>
          <Button variant="contained" onClick={handleDownloadPDF}>
            PDF
          </Button>
          <Button variant="contained" onClick={handleDownloadDOCX}>
            DOCX
          </Button>
          <Button variant="contained" onClick={handleDownloadExcel}>
            Excel
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left">S.No.</TableCell>
            <TableCell align="left" onClick={() => handleSort("firstName")}>Name</TableCell>
            <TableCell align="center" onClick={() => handleSort("emailId")}>Email</TableCell>
            <TableCell align="center" onClick={() => handleSort("username")}>Username</TableCell>
            <TableCell align="center" onClick={() => handleSort("status")}>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (

            <TableRow key={user.id}>
              <TableCell align="left">{index + 1}</TableCell>
              <TableCell align="left">{user.firstName} {user.lastName}</TableCell>
              <TableCell align="center">{user.emailId}</TableCell>
              <TableCell align="center">{user.username}</TableCell>
              <TableCell align="center">
                <Switch
                  checked={user.status}
                  onChange={() => handleStatusToggle(index)}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleEditClick(user)}><EditIcon /></IconButton>
                <IconButton onClick={() => handleDeleteClick(user)}><DeleteIcon /></IconButton>
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
          Page {pageNumber} of {totalPages}
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

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            value={editData.firstName}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            value={editData.lastName}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="emailId"
            label="Email ID"
            type="email"
            fullWidth
            variant="standard"
            value={editData.emailId}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="mobileNo"
            label="Mobile Number"
            type="text"
            fullWidth
            variant="standard"
            value={editData.mobileNo}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={editData.username}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="roleId"
            label="Role ID"
            type="text"
            fullWidth
            variant="standard"
            value={editData.roleId}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={editData.password}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateUser}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
