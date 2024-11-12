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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TableSortLabel,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import { API, token } from "serverConnection";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

// STYLED COMPONENT
export const StyledTable = styled(Table)(() => ({
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
  const [nvrList, setNvrList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedNvr, setSelectedNvr] = useState({
    id: "",
    name: "",
    nvrip: "",
    port: "",
    nvrType: "",
    username: "",
    regDate: "",
  });

  // Pagination state
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

  // Sorting state
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      if (order === "asc") {
        return a[orderBy]?.localeCompare(b[orderBy]);
      } else {
        return b[orderBy]?.localeCompare(a[orderBy]);
      }
    });
  };

  const sortedResults = sortData([...searchResults]);
  const getApi = async () => {
    try {
      const response = await axios.get(`${API}/api/NVR/Pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNvrList(response.data.cameraActivities);
      setSearchResults(response.data.cameraActivities);
      setTotalPages(Math.ceil(response.data.totalCount / pageSize));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    const getAllData = async () => {
      try {
        const response = await axios.get(`${API}/api/NVR/Pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNvrList(response.data.cameraActivities);
        setSearchResults(response.data.cameraActivities);
        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    getApi();
    getAllData();
  },  [pageNumber, pageSize]);

  const handleEditClick = (nvr) => {
    setSelectedNvr(nvr);
    setOpenEditDialog(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedNvr((prevNvr) => ({
      ...prevNvr,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(`${API}/api/NVR`, selectedNvr, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedNvrList = nvrList.map((nvr) =>
        nvr.id === selectedNvr.id ? response.data : nvr
      );
      setNvrList(updatedNvrList);
      setSearchResults(updatedNvrList);
      setOpenEditDialog(false);
      getApi();
    } catch (error) {
      console.error("Failed to update data:", error);
    }
  };

  const handleDeleteClick = (nvr) => {
    setSelectedNvr(nvr);
    setOpenDeleteDialog(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`${API}/api/NVR/${selectedNvr.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedNvrList = nvrList.filter(
        (nvr) => nvr.id !== selectedNvr.id
      );
      setNvrList(updatedNvrList);
      setSearchResults(updatedNvrList);
      setOpenDeleteDialog(false);
    } catch (AxiosError) {
      console.error("Failed to delete data:", AxiosError.response.data.message);
      setOpenDeleteDialog(false);
      alert(AxiosError.response.data.message)
    }
  };

  // const downloadAsExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(searchResults);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "NVRs");
  //   XLSX.writeFile(workbook, "nvr_list.xlsx");
  // };
  const downloadAsExcel = () => {
    // Create a new array with only the needed columns and a serial number
    const filteredResults = searchResults.map((nvr, index) => ({
      "S. No": index + 1,  // Add serial number
      "Name": nvr.Name,
      "Username": nvr.Username,
      "NVR IP": nvr.nvrip,
      "Port": nvr.Port,
      "NVR Type": nvr.nvrType
    }));
  
    // Convert the data to an Excel sheet and download it
    const worksheet = XLSX.utils.json_to_sheet(filteredResults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NVRs");
    XLSX.writeFile(workbook, "nvr_list.xlsx");
  };
  

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.text("NVR List", 14, 16);
  
    const tableColumn = [
      "S. No",
      "Name",
      "Username",
      "NVR IP",
      "Port",
      "NVR Type",
    ];
  
    // Use array index (i) for serial number instead of nvr.index
    const tableRows = searchResults.map((nvr, i) => [
      i + 1, // Serial number starts from 1
      nvr.name,
      nvr.username,
      nvr.nvrip,
      nvr.port,
      nvr.nvrType,
    ]);
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
  
    doc.save("nvr_list.pdf");
  };
  

  const handleSearch = () => {
    const filtered = nvrList.filter((nvr) => {
      const nameMatch = nvr.name.toLowerCase().includes(searchQuery.toLowerCase());
      const nvripMatch = nvr.nvrip.toLowerCase().includes(searchQuery.toLowerCase());
      const portMatch = nvr.port.toString().includes(searchQuery); // Convert port to string
      const nvrTypeMatch = nvr.nvrType.toLowerCase().includes(searchQuery.toLowerCase());
      const usernameMatch = nvr.username.toLowerCase().includes(searchQuery.toLowerCase());

      return nameMatch || nvripMatch || portMatch || nvrTypeMatch || usernameMatch;
    });

    setSearchResults(filtered);
    setPage(0);
  };

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/add-nvr");
  };

  return (
    <Box sx={{backgroundColor:"white"}} width="100%" overflow="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
        <Box display="flex" alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
          />
          <Button
            className="w-100"
            sx={{ ml: 1 ,borderRadius:"30px" ,background:"#4A628A"}}
            variant="contained"
            onClick={handleClick}
          >
            + NVR
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
        <TableHead style={{ background: '#4A628A' }}>
          <TableRow>
            <TableCell className="text-center text-light" style={{ borderTopLeftRadius: '10px', overflow: 'hidden' }}>S.No.</TableCell>
            <TableCell className="text-light">
              <TableSortLabel
                className="text-light"
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleSort("name")}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell className="text-light">
              <TableSortLabel
                className="text-light"
                active={orderBy === "username"}
                direction={orderBy === "username" ? order : "asc"}
                onClick={() => handleSort("username")}
              >
                Username
              </TableSortLabel>
            </TableCell>
            <TableCell className="text-light">
              <TableSortLabel
                className="text-light"
                active={orderBy === "nvrType"}
                direction={orderBy === "nvrType" ? order : "asc"}
                onClick={() => handleSort("nvrType")}
              >
                NVR Type
              </TableSortLabel>
            </TableCell>
            <TableCell className="text-light">
              <TableSortLabel
                className="text-light"
                active={orderBy === "nvrip"}
                direction={orderBy === "nvrip" ? order : "asc"}
                onClick={() => handleSort("nvrip")}
              >
                NVR IP
              </TableSortLabel>
            </TableCell>
            <TableCell className="text-light">
              Port
            </TableCell>
            <TableCell className="text-light" style={{ borderTopRightRadius: '10px', overflow: 'hidden' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((nvr, index) => (
            <TableRow key={nvr.id}>
              <TableCell  className="text-center">{index + 1}</TableCell>
              <TableCell>{nvr.name}</TableCell>
              <TableCell>{nvr.username}</TableCell>
              <TableCell>{nvr.nvrType}</TableCell>
              <TableCell>{nvr.nvrip}</TableCell>
              <TableCell>{nvr.port}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditClick(nvr)}>
                  <EditIcon sx={{ color: '#7AB2D3' }} />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(nvr)}>
                  <DeleteOutlineIcon sx={{ color: '#F95454' }} />
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
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={nvrList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      /> */}

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit NVR</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            name="name"
            value={selectedNvr.name}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Username"
            name="username"
            value={selectedNvr.username}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="NVR IP"
            name="nvrip"
            value={selectedNvr.nvrip}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Port"
            name="port"
            value={selectedNvr.port}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="NVR Type"
            name="nvrType"
            value={selectedNvr.nvrType}
            onChange={handleEditChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete NVR</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedNvr.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteSubmit} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   IconButton,
//   Table,
//   styled,
//   TableRow,
//   TableBody,
//   TableCell,
//   TableHead, //ok
//   TablePagination,
//   Switch,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   InputAdornment,
//   DialogContentText,
//   TableSortLabel,
//   MenuItem,
//   Typography,
//   Select,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import DescriptionIcon from "@mui/icons-material/Description";
// import SearchIcon from "@mui/icons-material/Search";
// import { API, token } from "serverConnection";
// import * as XLSX from "xlsx";
// import { Document, Packer, Paragraph, TextRun } from "docx";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { useNavigate } from "react-router-dom";
// // STYLED COMPONENT
// const StyledTable = styled(Table)(() => ({
//   whiteSpace: "pre",
//   "& thead": {
//     "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
//   },
//   "& tbody": {
//     "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
//   },
// }));

// export default function PaginationTable() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);
//   const [subscribers, setSubscribers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [selectedSubscriber, setSelectedSubscriber] = useState({
//     id: "",
//     name: "",
//     nvrip: "",
//     port: "",
//     nvrType: "",
//     username: "",
//     regDate: "",
//   });

//   //Pagination start
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize, setPageSize] = useState(20);
//   const [totalPages, setTotalPages] = useState(0);

//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) {
//       setPageNumber(newPage);
//     }
//   };

//   const handlePageSizeChange = (e) => {
//     setPageSize(Number(e.target.value));
//     setPageNumber(1);
//   };
//   // Pagination end

//   //sorting columns
//   const [order, setOrder] = useState("asc");
//   const [orderBy, setOrderBy] = useState("");
//   // Handle sorting when a column header is clicked
//   const handleSort = (column) => {
//     const isAsc = orderBy === column && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(column);
//   };

//   // Sorting function: it compares the values in the selected column
//   const sortData = (data) => {
//     return data.sort((a, b) => {
//       if (order === "asc") {
//         return a[orderBy]?.localeCompare(b[orderBy]); // Compare strings alphabetically
//       } else {
//         return b[orderBy]?.localeCompare(a[orderBy]);
//       }
//     });
//   };

//   // Sort the searchResults array
//   const sortedResults = sortData([...searchResults]);

//   //sorting end

//   useEffect(() => {
//     getApi();
//   }, [pageNumber,pageSize]);

//   const getApi = async () => {
//     try {
//       const response = await axios.get(`${API}/api/NVR/Pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setSubscribers(response.data.cameraActivities);
//       setSearchResults(response.data.cameraActivities);
//       setTotalPages(Math.ceil(response.data.totalCount/pageSize));
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//     }
//   };

//   const handleChangePage = (_, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   // Toggle Status
//   const handleStatusToggle = (index) => {
//     const subscriberToUpdate = subscribers[index];
//     const updatedStatus = !subscriberToUpdate.status; // Toggle the status

//     // Optimistically update local state
//     const updatedSubscribers = subscribers.map((subscriber, i) =>
//       i === index ? { ...subscriber, status: updatedStatus } : subscriber
//     );
//     setSubscribers(updatedSubscribers);

//     // Prepare the payload with necessary fields like ID and status
//     const payload = {
//       id: subscriberToUpdate.id,
//       status: updatedStatus,
//     };

//     // Send the status update to the API
//     axios
//       .put(
//         `${API}/api/NVR/update-status`,
//         payload, // Send the proper payload to the API
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )
//       .then(() => {
//         console.log("Status updated successfully");
//         getApi();
//       })
//       .catch((error) => {
//         console.error(
//           "Error updating status:",
//           error.response?.data || error.message
//         );
//         // Revert local state on error
//         setSubscribers(subscribers);
//       });
//   };

//   const handleEditClick = (subscriber) => {
//     setSelectedSubscriber(subscriber);
//     setOpenEditDialog(true);
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedSubscriber((prevSubscriber) => ({
//       ...prevSubscriber,
//       [name]: value,
//     }));
//   };

//   const handleEditSubmit = async () => {
//     try {
//       const response = await axios.put(`${API}/api/NVR`, selectedSubscriber, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const updatedSubscribers = subscribers.map((subscriber) =>
//         subscriber.id === selectedSubscriber.id ? response.data : subscriber
//       );
//       setSubscribers(updatedSubscribers);
//       setSearchResults(updatedSubscribers);
//       setOpenEditDialog(false);
//       getApi();
//     } catch (error) {
//       console.error("Failed to update data:", error);
//     }
//   };

//   // Handle Delete Functionality
//   const handleDeleteClick = (subscriber) => {
//     setSelectedSubscriber(subscriber);
//     setOpenDeleteDialog(true);
//   };

//   const handleDeleteSubmit = async () => {
//     try {
//       await axios.delete(`${API}/api/NVR/${selectedSubscriber.id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       // Remove the subscriber from the state
//       const updatedSubscribers = subscribers.filter(
//         (subscriber) => subscriber.id !== selectedSubscriber.id
//       );
//       setSubscribers(updatedSubscribers);
//       setSearchResults(updatedSubscribers);
//       setOpenDeleteDialog(false);
//     } catch (error) {
//       console.error("Failed to delete data:", error);
//     }
//   };

//   const downloadAsExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(searchResults);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Subscribers");
//     XLSX.writeFile(workbook, "subscribers.xlsx");
//   };

//   const downloadAsDocs = async () => {
//     const doc = new Document({
//       sections: [
//         {
//           children: searchResults.map(
//             (subscriber) =>
//               new Paragraph({
//                 children: [
//                   new TextRun(
//                     `Name: ${subscriber.name}, Username: ${subscriber.username}, NVR IP: ${subscriber.nvrip}, Port: ${subscriber.port}, NVR Type: ${subscriber.nvrType}, Status: ${subscriber.status}`
//                   ),
//                 ],
//               })
//           ),
//         },
//       ],
//     });

//     const blob = await Packer.toBlob(doc);
//     saveAs(blob, "subscribers.docx");
//   };

//   const downloadAsPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Subscribers List", 14, 16);

//     const tableColumn = [
//       "ID",
//       "Name",
//       "Username",
//       "NVR IP",
//       "Port",
//       "NVR Type",
//       "Status",
//     ];
//     const tableRows = searchResults.map((subscriber) => [
//       subscriber.id,
//       subscriber.name,
//       subscriber.username,
//       subscriber.nvrip,
//       subscriber.port,
//       subscriber.nvrType,
//       subscriber.status,
//       subscriber.regDate,
//     ]);

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//     });

//     doc.save("subscribers.pdf");
//   };

//   const handleSearch = () => {
//     const filtered = subscribers.filter((subscriber) => {
//       const nameMatch = subscriber.name
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase());
//       const nvripMatch = subscriber.nvrip
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase());
//       const portMatch = subscriber.port.toString().includes(searchQuery); // Convert port to string
//       const nvrTypeMatch = subscriber.nvrType
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase());
//       const usernameMatch = subscriber.username
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase());

//       return (
//         nameMatch || nvripMatch || portMatch || nvrTypeMatch || usernameMatch
//       );
//     });

//     setSearchResults(filtered);
//     setPage(0);
//   };

//   const navigate = useNavigate();
//   const handleClick = () => {
//     // Replace '/target-path' with the path you want to navigate to
//     navigate("/add-nvr");
//   };

//   return (
//     <Box width="100%" overflow="auto">
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mt={2}
//         mb={2}
//       >
//         <Box display="flex" alignItems="center">
//           <TextField
//             variant="outlined"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{ width: "100%" }}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={handleSearch}>
//                     <SearchIcon />
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Box>
//         <Box>
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ mr: 1 }}
//             onClick={handleClick}
//           >
//             +
//           </Button>
//           <Button
//             variant="contained"
//             onClick={downloadAsExcel}
//             startIcon={<FileDownloadIcon />}
//           >
//             Excel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={downloadAsDocs}
//             startIcon={<DescriptionIcon />}
//             sx={{ mx: 1 }}
//           >
//             Docs
//           </Button>
//           <Button
//             variant="contained"
//             onClick={downloadAsPDF}
//             startIcon={<PictureAsPdfIcon />}
//           >
//             PDF
//           </Button>
//         </Box>
//       </Box>

//       <StyledTable>
//         <TableHead>
//           <TableRow>
//             <TableCell align="left">S.No.</TableCell>
//             <TableCell align="left">
//               <TableSortLabel
//                 active={orderBy === "name"}
//                 direction={orderBy === "name" ? order : "asc"}
//                 onClick={() => handleSort("name")}
//               >
//                 Name
//               </TableSortLabel>
//             </TableCell>
//             <TableCell align="center">
//               <TableSortLabel
//                 active={orderBy === "username"}
//                 direction={orderBy === "username" ? order : "asc"}
//                 onClick={() => handleSort("username")}
//               >
//                 Username
//               </TableSortLabel>
//             </TableCell>

//             <TableCell align="left">NVR IP</TableCell>
//             <TableCell align="center">Port</TableCell>
//             <TableCell align="center">
//               <TableSortLabel
//                 active={orderBy === "nvrType"}
//                 direction={orderBy === "nvrType" ? order : "asc"}
//                 onClick={() => handleSort("nvrType")}
//               >
//                 NVR Type
//               </TableSortLabel>
//             </TableCell>
//             <TableCell align="center">Status</TableCell>
//             <TableCell align="center" style={{ width: "145px" }}>
//               Date & Time
//             </TableCell>
//             <TableCell align="right">Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {sortedResults
//             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//             .map(
//               (
//                 subscriber,
//                 index //sorted columns
//               ) => (
//                 <TableRow key={index}>
//                   <TableCell align="left">{index + 1}</TableCell>
//                   <TableCell align="left">{subscriber.name}</TableCell>
//                   <TableCell align="center">{subscriber.username}</TableCell>
//                   <TableCell align="left">{subscriber.nvrip}</TableCell>
//                   <TableCell align="center">{subscriber.port}</TableCell>
//                   <TableCell align="center">{subscriber.nvrType}</TableCell>
//                   <TableCell align="center">
//                     <Switch
//                       checked={subscriber.status}
//                       onChange={() =>
//                         handleStatusToggle(
//                           page * rowsPerPage + index,
//                           subscriber.status
//                         )
//                       }
//                     />
//                   </TableCell>
//                   <TableCell align="center">
//                     {subscriber.regDate.slice(0, 10).replace(/-/g, "/")}
//                     {` ${subscriber.regDate.slice(11, 19)}`}
//                   </TableCell>
//                   <TableCell align="right">
//                     <IconButton onClick={() => handleEditClick(subscriber)}>
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton onClick={() => handleDeleteClick(subscriber)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               )
//             )}
//         </TableBody>
//       </StyledTable>

//       {/* Pagination start */}

//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "end",
//           mt: 1,
//         }}
//       >
//         <Button
//           variant="contained"
//           onClick={() => handlePageChange(pageNumber - 1)}
//           disabled={pageNumber === 1}
//           sx={{ mr: 0 }}
//         >
//           Previous
//         </Button>

//         <Typography variant="body1" sx={{ mx: 2 }}>
//           Page {pageNumber} of {totalPages}
//         </Typography>

//         <Button
//           variant="contained"
//           onClick={() => handlePageChange(pageNumber + 1)}
//           disabled={pageNumber === totalPages}
//           sx={{ mr: 2 }}
//         >
//           Next
//         </Button>

//         <Select
//           value={pageSize}
//           onChange={handlePageSizeChange}
//           variant="outlined"
//           sx={{ ml: 2 }}
//         >
//           <MenuItem value={5}>5</MenuItem>
//           <MenuItem value={10}>10</MenuItem>
//           <MenuItem value={20}>20</MenuItem>
//           <MenuItem value={50}>50</MenuItem>
//         </Select>

//         {/* <Typography variant="body2" sx={{ ml: 1 }}>
//           items per page
//         </Typography> */}
//       </Box>

//       {/* Pagination end */}

//       {/* Edit Dialog */}
//       {selectedSubscriber && (
//         <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
//           <DialogTitle>Edit Subscriber</DialogTitle>
//           <DialogContent>
//             <TextField
//               margin="dense"
//               label="Name"
//               name="name"
//               fullWidth
//               value={selectedSubscriber.name}
//               onChange={handleEditChange}
//             />
//             <TextField
//               margin="dense"
//               label="NVR IP"
//               name="nvrip"
//               fullWidth
//               value={selectedSubscriber.nvrip}
//               onChange={handleEditChange}
//             />
//             <TextField
//               margin="dense"
//               label="Port"
//               name="port"
//               fullWidth
//               value={selectedSubscriber.port}
//               onChange={handleEditChange}
//             />
//             <TextField
//               margin="dense"
//               label="NVR Type"
//               name="nvrType"
//               fullWidth
//               value={selectedSubscriber.nvrType}
//               onChange={handleEditChange}
//             />
//             <TextField
//               margin="dense"
//               label="Username"
//               name="username"
//               fullWidth
//               value={selectedSubscriber.username}
//               onChange={handleEditChange}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
//             <Button onClick={handleEditSubmit}>Save</Button>
//           </DialogActions>
//         </Dialog>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//       >
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete the selected subscriber?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
//           <Button onClick={handleDeleteSubmit} color="error">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   IconButton,
//   Table,
//   styled,
//   TableRow,
//   TableBody,
//   TableCell,
//   TableHead,//ok
//   TablePagination,
//   Switch,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   InputAdornment,
//   DialogContentText
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import DescriptionIcon from "@mui/icons-material/Description";
// import SearchIcon from "@mui/icons-material/Search";
// import { API, token } from "serverConnection";
// import * as XLSX from "xlsx";
// import { Document, Packer, Paragraph, TextRun } from "docx";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { useNavigate,navigate } from 'react-router-dom';

// // STYLED COMPONENT
// const StyledTable = styled(Table)(() => ({
//   whiteSpace: "pre",
//   "& thead": {
//     "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
//   },
//   "& tbody": {
//     "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
//   }
// }));

// export default function PaginationTable() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);
//   const [subscribers, setSubscribers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [selectedSubscriber, setSelectedSubscriber] = useState({
//     id: "",
//     name: "",
//     nvrip: "",
//     port: "",
//     nvrType: "",
//     username: "",
//   });

//   useEffect(() => {
//     getApi();
//   }, []);

//   const getApi = async () => {
//     try {
//       const response = await axios.get(`${API}/api/NVR/GetAll`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setSubscribers(response.data);
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//     }
//   };

//   const handleChangePage = (_, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   // Toggle Status
//   const handleStatusToggle = (index) => {
//     const subscriberToUpdate = subscribers[index];
//     const updatedStatus = !subscriberToUpdate.status; // Toggle the status

//     // Optimistically update local state
//     const updatedSubscribers = subscribers.map((subscriber, i) =>
//       i === index ? { ...subscriber, status: updatedStatus } : subscriber
//     );
//     setSubscribers(updatedSubscribers);

//     // Prepare the payload with necessary fields like ID and status
//     const payload = {
//       id: subscriberToUpdate.id,
//       status: updatedStatus,
//     };

//     // Send the status update to the API
//     axios
//       .put(
//         `${API}/api/NVR/update-status`,
//         payload, // Send the proper payload to the API
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )
//       .then(() => {
//         console.log("Status updated successfully");
//         getApi();
//       })
//       .catch((error) => {
//         console.error(
//           "Error updating status:",
//           error.response?.data || error.message
//         );
//         // Revert local state on error
//         setSubscribers(subscribers);
//       });
//   };

//   const handleEditClick = (subscriber) => {
//     setSelectedSubscriber(subscriber);
//     setOpenEditDialog(true);
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedSubscriber((prevSubscriber) => ({
//       ...prevSubscriber,
//       [name]: value,
//     }));
//   };

//   const handleEditSubmit = async () => {
//     try {
//       const response = await axios.put(
//         `${API}/api/NVR`,
//         selectedSubscriber,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const updatedSubscribers = subscribers.map((subscriber) =>
//         subscriber.id === selectedSubscriber.id ? response.data : subscriber
//       );
//       setSubscribers(updatedSubscribers);
//       setSearchResults(updatedSubscribers);
//       setOpenEditDialog(false);
//       getApi();
//     } catch (error) {
//       console.error("Failed to update data:", error);
//     }
//   };

//   // Handle Delete Functionality
//   const handleDeleteClick = (subscriber) => {
//     setSelectedSubscriber(subscriber);
//     setOpenDeleteDialog(true);
//   };

//   const handleDeleteSubmit = async () => {
//     try {
//       await axios.delete(`${API}/api/NVR/${selectedSubscriber.id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       // Remove the subscriber from the state
//       const updatedSubscribers = subscribers.filter(
//         (subscriber) => subscriber.id !== selectedSubscriber.id
//       );
//       setSubscribers(updatedSubscribers);
//       setSearchResults(updatedSubscribers);
//       setOpenDeleteDialog(false);
//     } catch (error) {
//       console.error("Failed to delete data:", error);
//     }
//   };

//   const downloadAsExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(searchResults);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Subscribers");
//     XLSX.writeFile(workbook, "subscribers.xlsx");
//   };

//   const downloadAsDocs = async () => {
//     const doc = new Document({
//       sections: [
//         {
//           children: searchResults.map((subscriber) =>
//             new Paragraph({
//               children: [
//                 new TextRun(
//                   `Name: ${subscriber.name}, Username: ${subscriber.username}, NVR IP: ${subscriber.nvrip}, Port: ${subscriber.port}, NVR Type: ${subscriber.nvrType}, Status: ${subscriber.status}`
//                 ),
//               ],
//             })
//           ),
//         },
//       ],
//     });

//     const blob = await Packer.toBlob(doc);
//     saveAs(blob, "subscribers.docx");
//   };

//   const downloadAsPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Subscribers List", 14, 16);

//     const tableColumn = ["ID", "Name", "Username", "NVR IP", "Port", "NVR Type", "Status"];
//     const tableRows = searchResults.map((subscriber) => [
//       subscriber.id,
//       subscriber.name,
//       subscriber.username,
//       subscriber.nvrip,
//       subscriber.port,
//       subscriber.nvrType,
//       subscriber.status,
//     ]);

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//     });

//     doc.save("subscribers.pdf");
//   };

//   const handleSearch = () => {
//     const filtered = subscribers.filter((subscriber) => {
//       const nameMatch = subscriber.name.toLowerCase().includes(searchQuery.toLowerCase());
//       const nvripMatch = subscriber.nvrip.toLowerCase().includes(searchQuery.toLowerCase());
//       const portMatch = subscriber.port.toString().includes(searchQuery); // Convert port to string
//       const nvrTypeMatch = subscriber.nvrType.toLowerCase().includes(searchQuery.toLowerCase());
//       const usernameMatch = subscriber.username.toLowerCase().includes(searchQuery.toLowerCase());

//       return nameMatch || nvripMatch || portMatch || nvrTypeMatch || usernameMatch;
//     });

//     setSearchResults(filtered);
//     setPage(0);
//   };

//   const navigate = useNavigate();
//   const handleClick = () => {
//     // Replace '/target-path' with the path you want to navigate to
//     navigate('/add-nvr');
//   };
//   return (
//     <Box width="100%" overflow="auto">
//       <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
//         <Box display="flex" alignItems="center">
//           <TextField
//             variant="outlined"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{ width: "100%" }}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={handleSearch}>
//                     <SearchIcon />
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Box>
//         <Box>
//         <Button
//               variant="contained"
//               color="primary"
//               sx={{ mr: 1 }}
//               onClick={handleClick}
//             >
//               +
//             </Button>
//           <Button variant="contained" onClick={downloadAsExcel} startIcon={<FileDownloadIcon />}>
//             Excel
//           </Button>
//           <Button variant="contained" onClick={downloadAsDocs} startIcon={<DescriptionIcon />} sx={{ mx: 1 }}>
//             Docs
//           </Button>
//           <Button variant="contained" onClick={downloadAsPDF} startIcon={<PictureAsPdfIcon />}>
//             PDF
//           </Button>
//         </Box>
//       </Box>

//       <StyledTable>
//         <TableHead>
//           <TableRow>
//             <TableCell align="left">S.No.</TableCell>
//             <TableCell align="left">Name</TableCell>
//             <TableCell align="center">Username</TableCell>
//             <TableCell align="left">NVR IP</TableCell>
//             <TableCell align="center">Port</TableCell>
//             <TableCell align="center">NVR Type</TableCell>
//             <TableCell align="center">Status</TableCell>
//             <TableCell align="center" style={{ width: "145px" }}>Date & Time</TableCell>
//             <TableCell align="right">Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {searchResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subscriber, index) => (
//             <TableRow key={index}>
//               <TableCell align="left">{index+1}</TableCell>
//               <TableCell align="left">{subscriber.name}</TableCell>
//               <TableCell align="center">{subscriber.username}</TableCell>
//               <TableCell align="left">{subscriber.nvrip}</TableCell>
//               <TableCell align="center">{subscriber.port}</TableCell>
//               <TableCell align="center">{subscriber.nvrType}</TableCell>
//               <TableCell align="center">
//                 <Switch checked={subscriber.status} onChange={() => handleStatusToggle(page * rowsPerPage + index, subscriber.status)} />
//               </TableCell>
//               <TableCell align="center">{subscriber.datetime}</TableCell>
//               <TableCell align="right">
//                 <IconButton onClick={() => handleEditClick(subscriber)}>
//                   <EditIcon />
//                 </IconButton>
//                 <IconButton onClick={() => handleDeleteClick(subscriber)}>
//                   <DeleteIcon />
//                 </IconButton>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </StyledTable>

//       <TablePagination
//         sx={{ px: 2 }}
//         page={page}
//         component="div"
//         rowsPerPage={rowsPerPage}
//         count={searchResults.length}
//         onPageChange={handleChangePage}
//         rowsPerPageOptions={[5, 10, 25]}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         nextIconButtonProps={{ "aria-label": "Next Page" }}
//         backIconButtonProps={{ "aria-label": "Previous Page" }}
//       />

//       {/* Edit Dialog */}
//       {selectedSubscriber && (
//         <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
//           <DialogTitle>Edit Subscriber</DialogTitle>
//           <DialogContent>
//             <TextField
//               margin="dense"
//               label="Name"
//               name="name"
//               fullWidth
//               value={selectedSubscriber.name}
//               onChange={handleEditChange}
//             />
//             <TextField
//               margin="dense"
//               label="NVR IP"
//               name="nvrip"
//               fullWidth
//               value={selectedSubscriber.nvrip}
//               onChange={handleEditChange}
//             />
//             <TextField
//               margin="dense"
//               label="Port"
//               name="port"
//               fullWidth
//               value={selectedSubscriber.port}
//               onChange={handleEditChange}
//             />
//             <TextField
//               margin="dense"
//               label="NVR Type"
//               name="nvrType"
//               fullWidth
//               value={selectedSubscriber.nvrType}
//               onChange={handleEditChange}
//             />
//             <TextField
//               margin="dense"
//               label="Username"
//               name="username"
//               fullWidth
//               value={selectedSubscriber.username}
//               onChange={handleEditChange}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
//             <Button onClick={handleEditSubmit}>Save</Button>
//           </DialogActions>
//         </Dialog>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete the selected subscriber?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
//           <Button onClick={handleDeleteSubmit} color="error">Delete</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }