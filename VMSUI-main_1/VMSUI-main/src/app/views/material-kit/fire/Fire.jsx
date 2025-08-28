import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Badge } from "react-bootstrap";
import { ANPRAPI, API, token, userId } from "serverConnection";
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

function Fire() {
  const [cameraList, setCameraList] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [count, setCount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [itemsPerPageCount, setItemsPerPageCount] = useState("10");
  const [totalPages, setTotalPages] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get(`${API}/api/Camera/?user_id=${userId}`);
        const cameras = [
          ...new Map(response.data.results.map((cam) => [cam.name, cam])).values(),
        ];
        const filterCameras = cameras.map((cam) => ({ camera: cam }));
        setCameraList(filterCameras);
      } catch (error) {
        console.error("Error fetching camera list:", error);
      }
    };
    fetchCameras();
  }, []);

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const getNestedValue = (obj, path) =>
    path.split(".").reduce((value, key) => value?.[key], obj);

  const sortData = (data) => {
    return data.sort((a, b) => {
      const aValue = getNestedValue(a, orderBy);
      const bValue = getNestedValue(b, orderBy);
      if (aValue == null || bValue == null) return 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      return aValue.toString().localeCompare(bValue.toString()) * (order === "asc" ? 1 : -1);
    });
  };

  const sortedResults = sortData([...tableData]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const cameraId = selectedCamera ? selectedCamera.camera.id : "";
        const response = await axios.get(
          `${API}/api/FireDetection/?user_id=${userId}&page=${currentPage}&pageSize=${itemsPerPage}&search=${searchQuery}&camera_id=${cameraId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTableData(response.data.results);
        setCount(response.data.count);
        setTotalPages(Math.ceil(response.data.count / itemsPerPage));
      } catch (error) {
        console.error("Error fetching fire detection data:", error);
      }
    };
    fetchTableData();
  }, [searchQuery, selectedCamera, currentPage, itemsPerPage]);

  const handleCameraClick = (camera) => {
    setSelectedCamera(camera || null);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleItemsPerPageChange = (e) => {
    const value = e.target.value;
    setItemsPerPageCount(value);
    setItemsPerPage(value === "all" ? Number(count) : Number(value));
    setCurrentPage(1);
  };

  const handleImageClick = (url) => {
    setModalImageUrl(url);
    setShowImageModal(true);
  };

  const handleCloseModal = () => setShowImageModal(false);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      tableData.map((data, index) => ({
        "S.No.": index + 1 + (currentPage - 1) * itemsPerPage,
        "Camera Name": data.camera_name,
        "Camera Location": data.camera_location,
        "Fire Detected": data.fire_detected ? "Yes" : "No",
        "Intensity": data.intensity || "N/A",
        "Date & Time":
          data.regDate.slice(0, 10).replace(/-/g, "/") + " - " + data.regDate.slice(11, 19),
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "Fire Detection Data");
    XLSX.writeFile(wb, "fire_data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "S.No.",
      "Camera Name",
      "Camera Location",
      "Fire Detected",
      "Intensity",
      "Date & Time",
    ];
    const rows = tableData.map((data, index) => [
      index + 1 + (currentPage - 1) * itemsPerPage,
      data.camera_name,
      data.camera_location,
      data.fire_detected ? "Yes" : "No",
      data.intensity || "N/A",
      data.regDate.slice(0, 10).replace(/-/g, "/") + " - " + data.regDate.slice(11, 19),
    ]);
    doc.autoTable(columns, rows, { startY: 20 });
    doc.save("fire_data.pdf");
  };

  return (
    <div className="container-fluid mt-1">
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center">
          <Badge className="me-3" pill bg="" style={{ backgroundColor: "#4A628A", color: "white" }}>
            <Dropdown drop="down">
              <Dropdown.Toggle className="p-0 m-0 border-0 bg-transparent">Camera List</Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                <Dropdown.Item onClick={() => handleCameraClick(null)}>All</Dropdown.Item>
                {cameraList.map((camera) => (
                  <Dropdown.Item key={camera.camera.id} onClick={() => handleCameraClick(camera)}>
                    {camera.camera.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Badge>
        </div>

        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <TextField
            className="p-0"
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: "250px", // Set consistent width
              borderRadius: "30px",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                "& input": {
                  padding: "10px",
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

          {/* Download Buttons */}
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

      <div className="mt-2">
        <TableContainer component={Paper}>
          <Table striped bordered hover variant="dark">
            <TableHead style={{ background: "#4A628A" }}>
              <TableRow>
                <TableCell className="text-light text-center">S.No.</TableCell>
                <TableCell className="text-light">
                  <TableSortLabel
                    active={orderBy === "camera_name"}
                    direction={orderBy === "camera_name" ? order : "asc"}
                    onClick={() => handleSort("camera_name")}
                  >
                    Camera Name
                  </TableSortLabel>
                </TableCell>
                <TableCell className="text-light">Camera Location</TableCell>
                <TableCell className="text-light">Fire Detected</TableCell>
                <TableCell className="text-light">Intensity</TableCell>
                <TableCell className="text-light">Date & Time</TableCell>
                <TableCell className="text-light text-center">Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedResults.map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell className="text-center">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell>{data.camera_name}</TableCell>
                  <TableCell>{data.camera_location}</TableCell>
                  <TableCell>
                    {data.fire_detected ? (
                      <span className="badge bg-danger">Yes</span>
                    ) : (
                      <span className="badge bg-success">No</span>
                    )}
                  </TableCell>
                  <TableCell>{data.intensity || "N/A"}</TableCell>
                  <TableCell>
                    {data.regDate.slice(0, 10).replace(/-/g, "/")} -{" "}
                    {data.regDate.slice(11, 16)}
                  </TableCell>
                  <TableCell className="text-center">
                    <IconButton
                      onClick={() =>
                        handleImageClick(`${ANPRAPI}/${data.framePath.replace(/\\/g, "/")}`)
                      }
                    >
                      <img
                        src={`${ANPRAPI}/${data.framePath}`}
                        alt="frame"
                        height={50}
                        width={110}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="d-flex justify-content-end align-items-center mb-4">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1} className="me-2">
            Previous
          </Button>
          <div className="me-2 text-dark">
            Page {currentPage} of {totalPages || 1}
          </div>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages} className="me-2">
            Next
          </Button>
          <select
            value={itemsPerPageCount}
            onChange={handleItemsPerPageChange}
            className="form-select p-1 m-0 bg-light text-dark border-light"
            style={{ width: "60px" }}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      <Modal show={showImageModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={modalImageUrl}
            alt="Preview"
            style={{
              borderRadius: "15px",
              maxHeight: "350px",
              width: "100%",
              objectFit: "cover",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal} variant="secondary">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Fire;
