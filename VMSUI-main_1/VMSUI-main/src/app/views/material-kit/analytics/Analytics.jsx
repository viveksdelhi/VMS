import React, { useState, useEffect } from "react";
import axios from "axios";
import { API, detection, token, userId } from "serverConnection";
// UI Components
import { Modal, Button, Badge, Dropdown } from "react-bootstrap";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Box, TableSortLabel, TextField, InputAdornment
} from "@mui/material";
// Icons
import SearchIcon from "@mui/icons-material/Search";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// Export Utilities
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function Analytics() {
  const [cameraList, setCameraList] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [search, setSearch] = useState("");

  // Pagination state
  const [count, setCount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [ItemsPerPageCount, setItemsPerPageCount] = useState();
  const [totalPages, setTotalPages] = useState(0);

  // const TestingApi = process.env.REACT_APP_API_URL_TESTING;

  useEffect(() => {
    axios.get(`${API}/api/Camera/?user_id=${userId}`)
      .then((response) => {
        const cameras = Array.from(
          new Map(response.data.results.map((cam) => [cam.name, cam])).values()
        );
        setCameraList(cameras.map((cam) => ({ camera: cam })));
      })
      .catch((error) => console.error("Error fetching camera list:", error));
  }, []);

  useEffect(() => {
    const cameraId = selectedCamera?.camera?.id || "";
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API}/api/CameraAlert/?user_id=${userId}&page=${currentPage}&pageSize=${itemsPerPage}${search ? `&search=${search}` : ""}&camera_id=${cameraId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTableData(response.data.results);
        setCount(response.data.count);
        setTotalPages(Math.ceil(response.data.count / itemsPerPage));
      } catch (error) {
        console.error("Error fetching camera data:", error);
      }
    };

    fetchData();
  }, [search, selectedCamera, currentPage, itemsPerPage]);


  //sorting data

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc"; // If currently sorted ascending, change to descending
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortData = (data) => {
    console.log(data);
    return data.sort((a, b) => {
      const aValue = getNestedValue(a, orderBy),
        bValue = getNestedValue(b, orderBy);

      if (aValue == null || bValue == null) return 0;

      // Handle numerical comparison for numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Use localeCompare for strings
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

  // Handle image modal
  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => setShowImageModal(false);

  // alert status type
  const getAlertStatus = (alertStatus) => {
    if (alertStatus === "B") {
      return "Basic";
    } else if (alertStatus === "C") {
      return "Critical";
    } else if (alertStatus === "S") {
      return "Severe";
    }
    return null; // Or return something else when the condition is false
  };

  // Excel download function
 const exportToExcel = () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(
    tableData.map((data, index) => {
      let objectNameParsed;
      try {
        objectNameParsed = JSON.parse(data.objectName.replace(/'/g, '"'));
      } catch (e) {
        objectNameParsed = {};
      }

      const alertType = objectNameParsed.person >= 4 ? "Crowded" : "Normal";

      return {
        "S.No.": index + 1 + (currentPage - 1) * itemsPerPage,
        "Camera Name": data.camera_name,
        "Camera Location": data.camera_location,
        "Alert Type": alertType,
        "Object Name": data.objectName,
        "Date & Time":
          data.regDate.slice(0, 10).replace(/-/g, "/") +
          " - " +
          data.regDate.slice(11, 16),
      };
    })
  );

  XLSX.utils.book_append_sheet(wb, ws, "Analytics Data");
  XLSX.writeFile(wb, "analytics_data.xlsx");
};


  // PDF download function
 const exportToPDF = () => {
  const doc = new jsPDF();
  const tableColumn = ["S.No.", "Camera Name", "Camera Location", "Alert Type", "Object Name", "Date & Time"];

  const tableRows = tableData.map((data, index) => {
    let objectNameParsed;
    try {
      objectNameParsed = JSON.parse(data.objectName.replace(/'/g, '"'));
    } catch (e) {
      objectNameParsed = {};
    }

    const alertType = objectNameParsed.person >= 4 ? "Crowded" : "Normal";

    return [
      index + 1 + (currentPage - 1) * itemsPerPage,
      data.camera_name,
      data.camera_location,
      alertType,
      data.objectName,
      data.regDate.slice(0, 10).replace(/-/g, "/") + " - " + data.regDate.slice(11, 16),
    ];
  });

  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  doc.save("analytics_data.pdf");
};



  return (
    <div className="container-fluid mt-1">
      {/* Header Section: Camera Dropdown, Search Bar, and Export Buttons */}
      <div className="d-flex justify-content-between align-items-center">

        {/* Camera Dropdown */}
        <div className="d-flex align-items-center">
          <Badge className="me-3" pill bg="" style={{ backgroundColor: "#4A628A", color: "white" }}>
            <Dropdown drop="down">
              <Dropdown.Toggle id="dropdown-custom-components" className="p-2 border-0 bg-transparent">
                Camera List
              </Dropdown.Toggle>
              <Dropdown.Menu className="p-0 m-0" style={{ maxHeight: "200px", overflowY: "auto" }}>
                <Dropdown.Item onClick={() => handleCameraClick("")} className="p-2">
                  All
                </Dropdown.Item>
                {cameraList.map((camera) => (
                  <Dropdown.Item key={camera.camera.id} onClick={() => handleCameraClick(camera)} className="p-2">
                    {camera.camera.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Badge>
        </div>

        {/* Search Bar & Export Buttons */}
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              minWidth: "250px",
              borderRadius: "30px",
              transition: "all 0.3s ease",
              "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                "& input": { padding: "10px" },
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

      {/* Table Section */}
      <div className="mt-1">
        <TableContainer component={Paper}>
          <Table striped bordered hover variant="dark">
            <TableHead style={{ background: "#4A628A" }}>
              <TableRow>
                <TableCell className="text-center text-light" style={{ borderTopLeftRadius: "10px" }}>S.No.</TableCell>
                <TableCell className="text-light">
                  <TableSortLabel active={orderBy === "camera.name"} direction={orderBy === "camera.name" ? order : "asc"} onClick={() => handleSort("camera.name")}>
                    Camera Name
                  </TableSortLabel>
                </TableCell>
                <TableCell className="text-light">
                  <TableSortLabel active={orderBy === "camera.location"} direction={orderBy === "camera.location" ? order : "asc"} onClick={() => handleSort("camera.location")}>
                    Camera Location
                  </TableSortLabel>
                </TableCell>
                <TableCell className="text-light">
                  <TableSortLabel active={orderBy === "objectName"} direction={orderBy === "objectName" ? order : "asc"} onClick={() => handleSort("objectName")}>
                    Object Name
                  </TableSortLabel>
                </TableCell>
                <TableCell className="text-light">
                  <TableSortLabel active={orderBy === "alertStatus"} direction={orderBy === "alertStatus" ? order : "asc"} onClick={() => handleSort("alertStatus")}>
                    Alert Type
                  </TableSortLabel>
                </TableCell>
                <TableCell className="text-light">
                  <TableSortLabel active={orderBy === "regDate"} direction={orderBy === "regDate" ? order : "asc"} onClick={() => handleSort("regDate")}>
                    Date & Time
                  </TableSortLabel>
                </TableCell>
                <TableCell className="text-center text-light" style={{ borderTopRightRadius: "10px" }}>Image</TableCell>
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
                  <TableCell>{data.objectName}</TableCell>
                  <TableCell>
                    {JSON.parse(data.objectName.replace(/'/g, '"')).person >= 4 ? (
                      <span className="bg-danger text-white fw-bold px-3 py-1 rounded-pill">
                        Crowded
                      </span>
                    ) : (
                      <span className="bg-secondary text-white fw-bold px-3 py-1 rounded-pill">
                        Normal
                      </span>
                    )}
                  </TableCell>                  {/* <TableCell>{getAlertStatus(data.alertStatus)}</TableCell> */}
                  <TableCell>
                    {data.regDate.slice(0, 10).replace(/-/g, "/")} - {data.regDate.slice(11, 16)}
                  </TableCell>
                  <TableCell className="text-center" style={{ width: "100px" }}>
                    <IconButton onClick={() => handleImageClick(`${data.framePath}`)} color="primary" size="small" style={{ padding: 0 }}>
                      <img src={`${detection}/${data.framePath}`} alt="Preview" style={{ borderRadius: "5px", maxHeight: "50px", width: "100%" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <div className="d-flex justify-content-end align-items-center mb-4">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1} className="me-2">Previous</Button>
          <div className="me-2 text-dark">Page {currentPage} of {totalPages || 1}</div>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages} className="me-2">Next</Button>
          <select
            id="itemsPerPage"
            value={ItemsPerPageCount}
            onChange={(e) => {
              setItemsPerPageCount(e.target.value);
              handleItemsPerPageChange(e);
            }}
            className="form-select p-1 m-0 bg-light text-dark border-light"
            style={{ width: "60px" }}
          >
            {[10, 20, 50, 100, 250].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal show={showImageModal} onHide={handleCloseModal} centered>
        <Modal.Header className="m-0 p-2" closeButton>
          <Modal.Title className="text-center w-100 m-0 p-0" style={{ fontWeight: "bold" }}>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center m-0 p-2">
          <img src={`${detection}/${modalImageUrl}`} alt="Modal" style={{ borderRadius: "15px", maxHeight: "350px", width: "100%", objectFit: "cover", boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" }} />
        </Modal.Body>
        <Modal.Footer className="m-0 p-2" style={{ border: "none", justifyContent: "end" }}>
          <Button onClick={handleCloseModal} style={{ backgroundColor: "gray", border: "none", color: "#fff", padding: "8px 12px", borderRadius: "5px", fontWeight: "bold", boxShadow: "0px 4px 10px rgba(255, 90, 95, 0.5)" }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  );
}

export default Analytics;
