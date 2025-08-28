import React, { useState } from "react";
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
  Switch
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";

// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
  }
}));

const initialSubscriberList = [
  { sno: "1", name: "john doe", email: "rohit@gmail.com", username: "Rohit", role: "admin", status: "close" },
  { sno: "2", name: "kessy bryan", email: "rohit@gmail.com", username: "Rohit", role: "admin", status: "close" },
  { sno: "3", name: "kessy bryan", email: "rohit@gmail.com", username: "Rohit", role: "admin", status: "close" },
  { sno: "4", name: "james cassegne", email: "rohit@gmail.com", username: "Rohit", role: "admin", status: "close" },
  { sno: "5", name: "lucy brown", email: "rohit@gmail.com", username: "Rohit", role: "admin", status: "close" },
  { sno: "6", name: "lucy brown", email: "rohit@gmail.com", username: "Rohit", role: "admin", status: "close" },
  { sno: "7", name: "lucy brown", email: "rohit@gmail.com", username: "Rohit", role: "admin", status: "close" },
  { sno: "8", name: "lucy brown", email: "rohit@gmail.com", username: "Rohit", role: "admin", status: "close" },
  { sno: "9", name: "lucy brown", email: "rohit@gmail.com", username: "Rohit", role: "admin", status: "close" }
];

export default function PaginationTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [subscribers, setSubscribers] = useState(initialSubscriberList);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleStatusToggle = (index) => {
    setSubscribers((prevSubscribers) =>
      prevSubscribers.map((subscriber, i) =>
        i === index
          ? { ...subscriber, status: subscriber.status === "open" ? "close" : "open" }
          : subscriber
      )
    );
  };

  const downloadAsExcel = () => {
    // Logic for downloading as Excel
    alert("Download as Excel");
  };

  const downloadAsDocs = () => {
    // Logic for downloading as Docs
    alert("Download as Docs");
  };

  const downloadAsPDF = () => {
    // Logic for downloading as PDF
    alert("Download as PDF");
  };

  return (
    <Box width="100%" overflow="auto">
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" onClick={downloadAsExcel} startIcon={<FileDownloadIcon />}>
          Excel
        </Button>
        <Button variant="contained" onClick={downloadAsDocs} startIcon={<DescriptionIcon />} sx={{ mx: 1 }}>
          Docs
        </Button>
        <Button variant="contained" onClick={downloadAsPDF} startIcon={<PictureAsPdfIcon />}>
          PDF
        </Button>
      </Box>

      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left">S.No.</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">UserName</TableCell>
            <TableCell align="center">Role</TableCell>
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
                <TableCell align="left">{subscriber.name}</TableCell>
                <TableCell align="center">{subscriber.email}</TableCell>
                <TableCell align="center">{subscriber.username}</TableCell>
                <TableCell align="center">{subscriber.role}</TableCell>
                <TableCell align="center">
                  <Switch
                    checked={subscriber.status === "open"}
                    onChange={() => handleStatusToggle(index)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => alert("Edit clicked for " + subscriber.name)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => alert("Delete clicked for " + subscriber.name)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>

      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={subscribers.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />
    </Box>
  );
}
