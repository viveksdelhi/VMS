import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Badge } from "react-bootstrap";
import {
  ANPRAPI,
  API,
  CreditAPI,
  detection,
  token,
  userId,
} from "serverConnection";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Box,
  InputAdornment,
  TableSortLabel,
} from "@mui/material";
import Dropdown from "react-bootstrap/Dropdown";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SearchIcon from "@mui/icons-material/Search";

function Reports() {
  const [cameraList, setCameraList] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  //search
  const [searchQuery, setSearchQuery] = useState("");
  const [locationList, setLocationList] = useState([]);
  const [count, setCount] = useState();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [itemsPerPageCount, setItemsPerPageCount] = useState("10");
  const [totalPages, setTotalPages] = useState(0);
  // const [sortedResults, setSortedResults] = useState();

  const fetchCameras = async () => {
    try {
      const response = await axios.get(`${API}/api/Camera/?user_id=${userId}`);
      // const cameras = response.data.filter(
      //   (cam) => cam.personDetection === true
      // );
      const cameras = [
        ...new Map(
          response.data.results.map((cam) => [cam.name, cam])
        ).values(),
      ];
      const filterCameras = cameras.map((cam) => ({
        camera: cam,
      }));
      const locations = [
        ...new Map(
          response.data.results.map((cam) => [cam.location, cam])
        ).values(),
      ];
      const filterLocation = locations.map((cam) => ({
        camera: cam,
      }));
      setCameraList(filterCameras);
      setLocationList(filterLocation);
    } catch (error) {
      console.error("Error fetching camera list:", error);
    }
  };
  useEffect(() => {
    fetchCameras();
  }, []);

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
      const aValue = getNestedValue(a, orderBy),
        bValue = getNestedValue(b, orderBy);

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

  function getNestedValue(obj, path) {
    return path.split(".").reduce((value, key) => value?.[key], obj);
  }

  const sortedResults = sortData([...tableData]);
  //sorting end

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const cameraId = selectedCamera ? selectedCamera.camera.id : "";
        const pageSize = itemsPerPage === "all" ? 100000 : itemsPerPage;
        const response = await axios.get(
          //   `${CreditAPI}/report/credit_usage/${userId}`,
          `${CreditAPI}/report/credit_usage/${userId}?page=${currentPage}&per_page=${itemsPerPage}&device_id=${cameraId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const allCameraData = response.data.report;
        setTableData(allCameraData);
        const totalCount = response.data.pagination.total_items;
        setCount(totalCount);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } catch (error) {
        console.error("Error fetching camera data:", error);
      }
    };

    fetchTableData();
  }, [selectedCamera, currentPage, itemsPerPage]);

  // Handle camera selection and reset to first page
  const handleCameraClick = (camera) => {
    setSelectedCamera(camera ? camera : "");
    setCurrentPage(1); // Reset to first page when camera is selected
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleItemsPerPageChange = async (event) => {
    try {
      if (event.target.value === "all") {
        setItemsPerPage(Number(count));
      } else {
        setItemsPerPage(Number(event.target.value));
      }
      setCurrentPage(1); // Reset to first page on page size change
    } catch (error) {
      console.error("Error fetching count data:", error);
    }
  };

  // Excel download function
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      tableData.map((data, index) => ({
        "Transaction ID": data.transaction_id,
        "Event Type": data.event_type,
        "Device ID": data.device_id,
        "Event Credit": data.event_credit,
        "Transcation Date & Time":
          data.transaction_date.slice(0, 10).replace(/-/g, "/") +
          " - " +
          data.transaction_date.slice(11, 19),
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "Reports Data");
    XLSX.writeFile(wb, "report_data.xlsx");
  };

  // PDF download function
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Transaction ID",
      "Event Type",
      "Device ID",
      "Event Credit",
      "Transcation Date & Time",
    ];
    const tableRows = tableData.map((data, index) => [
      data.transaction_id,
      data.event_type,
      data.device_id,
      data.event_credit,
      data.transaction_date.slice(0, 10).replace(/-/g, "/") +
        " - " +
        data.transaction_date.slice(11, 19),
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("report_data.pdf");
  };

  return (
    <div className="container-fluid mt-1">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between align-items-center">
          <Badge
            className="me-3"
            pill
            bg=""
            style={{ backgroundColor: "#4A628A", color: "white" }}
          >
            <Dropdown drop="down">
              <Dropdown.Toggle
                id="dropdown-custom-components"
                className="p-0 m-0 border-0 bg-transparent"
              >
                Camera List
              </Dropdown.Toggle>

              {/* Scrollable Dropdown Menu with no hover effect and no padding */}
              <Dropdown.Menu
                className="p-0 m-0"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                <Dropdown.Item
                  onClick={() => handleCameraClick()}
                  className="p-2"
                >
                  All
                </Dropdown.Item>
                {cameraList.map((camera) => (
                  <Dropdown.Item
                    key={camera.camera.id}
                    onClick={() => handleCameraClick(camera)}
                    className="p-2"
                  >
                    {camera.camera.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Badge>
        </div>
        <div className="d-flex">
          <Box>
            <IconButton onClick={exportToExcel} title="Export to Excel">
              <SimCardDownloadIcon className="text-success" />
            </IconButton>
            <IconButton onClick={exportToPDF} title="Export to PDF">
              <PictureAsPdfIcon className="text-warning" />
            </IconButton>
          </Box>
        </div>
      </div>

      <div className="mt-1">
        <TableContainer component={Paper}>
          <Table striped bordered hover variant="dark">
            <TableHead style={{ background: "#4A628A" }}>
              <TableRow>
                <TableCell
                  className="text-center text-light"
                  style={{ borderTopLeftRadius: "10px", overflow: "hidden" }}
                >
                  Transaction ID
                </TableCell>
                <TableCell style={{ color: "#fff" }}>
                  <TableSortLabel
                    className="text-light"
                    active={orderBy === "event_type"}
                    direction={orderBy === "event_type" ? order : "asc"}
                    onClick={() => handleSort("event_type")}
                  >
                    Event Type
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ color: "#fff" }}>
                  <TableSortLabel
                    className="text-light"
                    active={orderBy === "device_id"}
                    direction={orderBy === "device_id" ? order : "asc"}
                    onClick={() => handleSort("device_id")}
                  >
                    Device ID
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ color: "#fff" }}>
                  <TableSortLabel
                    className="text-light"
                    active={orderBy === "event_credit"}
                    direction={orderBy === "event_credit" ? order : "asc"}
                    onClick={() => handleSort("event_credit")}
                  >
                    Event Credit
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ color: "#fff" }}>
                  <TableSortLabel
                    className="text-light"
                    active={orderBy === "transaction_date"}
                    direction={orderBy === "transaction_date" ? order : "asc"}
                    onClick={() => handleSort("transaction_date")}
                  >
                    Transcation Date & Time
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedResults.map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell className="text-center">
                    {data.transaction_id}
                  </TableCell>
                  <TableCell>{data.event_type}</TableCell>
                  <TableCell>{data.device_id}</TableCell>
                  <TableCell>{data.event_credit}</TableCell>
                  <TableCell>
                    {data.transaction_date.slice(0, 10).replace(/-/g, "/")}-{" "}
                    {data.transaction_date.slice(11, 16)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <div className="d-flex justify-content-end align-items-center mb-4">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="me-2 "
          >
            Previous
          </Button>
          <div className="me-2 text-dark">
            Page {currentPage} of {totalPages || 1}
          </div>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="me-2"
          >
            Next
          </Button>
          <select
            id="itemsPerPagecount"
            value={itemsPerPageCount}
            onChange={(e) => {
              setItemsPerPageCount(e.target.value);
              handleItemsPerPageChange(e);
            }}
            className="form-select p-1 m-0 bg-light text-dark border-light"
            style={{ width: "60px" }}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={"all"}>All</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Reports;
