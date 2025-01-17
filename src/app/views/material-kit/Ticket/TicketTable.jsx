import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from "@mui/icons-material/Search";
// import { useNavigate } from "react-router-dom";

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

// STATUS CELL COMPONENT
const StatusCell = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "Open":
        return { backgroundColor: "red", color: "white" };
      case "Closed":
        return { backgroundColor: "green", color: "white" };
      case "In Progress":
        return { backgroundColor: "orange", color: "white" };
      default:
        return { backgroundColor: "transparent", color: "black" };
    }
  };

  const { backgroundColor, color } = getStatusStyles(status);

  return (
    <TableCell className="p-0">
      <span style={{
        backgroundColor,
        color,
        padding: "3px 6px",
        borderRadius: "12px", // Added border-radius for rounded corners
        display: "inline-block", // Ensures the span only takes the necessary width
      }}>
        {status}
      </span>
    </TableCell>
  );
};
 

export default function TicketTable() {
  const [ticket, setTicket] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination start
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    // Hardcoded ticket data
    const hardcodedTickets = [
      { id: 1, name: "Alice", title: "Issue with login", asm: "John Doe", so: "SO1", city: "New York", region: "East", zone: "Zone 1", status: "Open", createDate: "2023-01-01", closeDate: "-----" },
      { id: 2, name: "Bob", title: "Need password reset", asm: "Jane Doe", so: "SO2", city: "Los Angeles", region: "West", zone: "Zone 2", status: "Closed", createDate: "2023-02-15", closeDate: "2023-02-16" },
      { id: 3, name: "Charlie", title: "Software bug report", asm: "Jim Doe", so: "SO3", city: "Chicago", region: "Midwest", zone: "Zone 3", status: "Open", createDate: "2023-03-10", closeDate: "-----" },
      { id: 4, name: "Diana", title: "Feedback on new feature", asm: "Jill Doe", so: "SO4", city: "Houston", region: "South", zone: "Zone 4", status: "In Progress", createDate: "2023-04-05", closeDate: "-----" },
      { id: 5, name: "Eve", title: "Billing issue", asm: "Jack Doe", so: "SO5", city: "Phoenix", region: "Southwest", zone: "Zone 5", status: "Closed", createDate: "2023-05-20", closeDate: "2023-05-21" },
    ];

    setTicket(hardcodedTickets);
    setTotalPages(Math.ceil(hardcodedTickets.length / pageSize));
  }, [pageSize]);

  // const navigate = useNavigate();

  const handleClick = () => {
    // navigate("/add-ticket");
  };

  const handleDeleteClick = (id) => {
    // Implement delete logic here
  };

  const handleEditClick = (id) => {
    // Implement edit logic here
  };

  const downloadAsExcel = () => {
    // Implement download as Excel logic here
  };

  const downloadAsPDF = () => {
    // Implement download as PDF logic here
  };

  return (
    <Box sx={{ backgroundColor: "white" }} width="100%" overflow="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
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
                  padding: '10px',
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
            + Ticket
          </Button>
        </Box>
        <Box>
          <IconButton onClick={downloadAsExcel} title="Export to Excel">
            <FileDownloadIcon className="text-success" />
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
            <TableCell className="text-light">Name</TableCell>
            <TableCell className="text-light">Ticket Title</TableCell>
            <TableCell className="text-light">ASM</TableCell>
            <TableCell className="text-light">SO</TableCell>
            <TableCell className="text-light">City</TableCell>
            <TableCell className="text-light">Region</TableCell>
            <TableCell className="text-light">Zone</TableCell>
            <TableCell className="text-light">Status</TableCell>
            <TableCell className="text-light">Create Date</TableCell>
            <TableCell className="text-light">Close Date</TableCell>
            <TableCell className="text-light" style={{ borderTopRightRadius: '10px', overflow: 'hidden' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {ticket.map((ticketItem, index) => (
            <TableRow key={ticketItem.id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{ticketItem.name}</TableCell>
              <TableCell>{ticketItem.title}</TableCell>
              <TableCell>{ticketItem.asm}</TableCell>
              <TableCell>{ticketItem.so}</TableCell>
              <TableCell>{ticketItem.city}</TableCell>
              <TableCell>{ticketItem.region}</TableCell>
              <TableCell>{ticketItem.zone}</TableCell>
              <StatusCell status={ticketItem.status} />
              <TableCell>{ticketItem.createDate}</TableCell>
              <TableCell>{ticketItem.closeDate}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditClick(ticketItem.id)}>
                  <EditIcon sx={{ color: '#7AB2D3' }} />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(ticketItem.id)}>
                  <DeleteOutlineIcon sx={{ color: '#F95454' }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>

      {/* Pagination start */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", mt: 1 }}>
        <Button variant="contained" onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1} sx={{ mr: 0 }}>
          Previous
        </Button>
        <Typography variant="body1" sx={{ mx: 2 }}>
          Page {pageNumber} of {totalPages || 1}
        </Typography>
        <Button variant="contained" onClick={() => handlePageChange(pageNumber + 1)} disabled={pageNumber === totalPages} sx={{ mr: 2 }}>
          Next
        </Button>
        <Select value={pageSize} onChange={handlePageSizeChange} variant="outlined" sx={{ ml: 2 }}>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </Box>
      {/* Pagination end */}
    </Box>
  );
}
