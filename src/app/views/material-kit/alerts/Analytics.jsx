import React, { useState, useEffect } from "react";
import axios from "axios";
import {Modal, Button, Badge } from "react-bootstrap";
import { API, detection, token } from "serverConnection";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, TableSortLabel } from '@mui/material';
import Dropdown from 'react-bootstrap/Dropdown';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function Analytics() {
  const [cameraList, setCameraList] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get(`${API}/api/CameraAlertStatus/GetAll`);
        const cameras = response.data.filter(cam => cam.personDetection === true);
        setCameraList(cameras);
      } catch (error) {
        console.error("Error fetching camera list:", error);
      }
    };

    fetchCameras();
  }, []);


  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const cameraId = selectedCamera ? selectedCamera.camera.id : "";
        const response = await axios.get(
          `${API}/api/CameraAlert/Pagination?pageNumber=${currentPage}&pageSize=${itemsPerPage}&cameraId=${cameraId}&orderBy=desc&orderType=desc`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const allCameraData = response.data.cameraAlertStatuses;
        setTableData(allCameraData);
        const totalCount = response.data.totalCount;
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } catch (error) {
        console.error("Error fetching camera data:", error);
      }
    };

    fetchTableData();
  }, [selectedCamera, currentPage, itemsPerPage]);

  //sorting data

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc"; // If currently sorted ascending, change to descending
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      const aValue = a[orderBy], bValue = b[orderBy];

      if (aValue == null || bValue == null) return 0;

      // Handle numerical comparison for numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      // Use localeCompare for strings, or convert to string for mixed types
      return (aValue.toString()).localeCompare(bValue.toString()) * (order === "asc" ? 1 : -1);
    });
  };
  const sortedResults = sortData([...tableData]);
  //sorting end

  // Handle camera selection and reset to first page
  const handleCameraClick = camera => {
    setSelectedCamera(camera?camera:"");
    setCurrentPage(1); // Reset to first page when camera is selected
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handleItemsPerPageChange = event => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page on page size change
  };

  // Handle image modal
  const handleImageClick = imageUrl => {
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => setShowImageModal(false);

  // Excel download function
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      tableData.map((data, index) => ({
        "S.No.": index + 1 + (currentPage - 1) * itemsPerPage,
        "No. of object": data.objectCount,
        "Alert Type": data.alertStatus,
        "Object Name": data.objectName,
        "Date & Time": data.regDate.slice(0, 10).replace(/-/g, "/") + " - " + data.regDate.slice(11, 16),
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "Camera Data");
    XLSX.writeFile(wb, "camera_data.xlsx");
  };

  // PDF download function
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["S.No.", "No. of object", "Alert Type", "Object Name", "Date & Time"];
    const tableRows = tableData.map((data, index) => [
      index + 1 + (currentPage - 1) * itemsPerPage,
      data.objectCount,
      data.alertStatus,
      data.objectName,
      data.regDate.slice(0, 10).replace(/-/g, "/") + " - " + data.regDate.slice(11, 16),
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("camera_data.pdf");
  };

  // alert status type 
  const getAlertStatus = (alertStatus) => {
    if (alertStatus === 'B') {
      return 'Basic';
    }
    else if (alertStatus === 'C') {
      return 'Critical';
    }
    else if (alertStatus === 'S') {
      return 'Severe';
    }
    return null; // Or return something else when the condition is false
  };

  return (
    <div className="container-fluid mt-1">
      {/* Export Buttons */}

      <div className="d-flex justify-content-between align-items-center">
        {/* Camera Dropdown */}
        <Badge pill bg="" style={{ backgroundColor: '#4A628A', color: 'white' }}>
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
            style={{ maxHeight: '200px', overflowY: 'auto' }}
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

        {/* Download Buttons */}

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
            <TableHead style={{ background: '#4A628A' }}>
              <TableRow>
                <TableCell className="text-center text-light" style={{ borderTopLeftRadius: '10px', overflow: 'hidden' }}>S.No.</TableCell>
                <TableCell style={{ color: '#fff' }}>
                <TableSortLabel
                className="text-light"
                active={orderBy === "objectCount"}
                direction={orderBy === "objectCount" ? order : "asc"}
                onClick={() => handleSort("objectCount")}>No. of object</TableSortLabel>
                </TableCell>
                <TableCell style={{ color: '#fff' }}>
                <TableSortLabel
                className="text-light"
                active={orderBy === "objectName"}
                direction={orderBy === "objectName" ? order : "asc"}
                onClick={() => handleSort("objectName")}>Object Name</TableSortLabel>
                </TableCell>
                <TableCell style={{ color: '#fff' }}>
                <TableSortLabel
                className="text-light"
                active={orderBy === "alertStatus"}
                direction={orderBy === "alertStatus" ? order : "asc"}
                onClick={() => handleSort("alertStatus")}>Alert Type</TableSortLabel>
                </TableCell>
                <TableCell style={{ color: '#fff' }}>
                <TableSortLabel
                className="text-light"
                active={orderBy === "regDate"}
                direction={orderBy === "regDate" ? order : "asc"}
                onClick={() => handleSort("regDate")}>Date & Time</TableSortLabel>
                </TableCell>
                <TableCell className="text-center text-light" style={{ borderTopRightRadius: '10px', overflow: 'hidden' }}>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedResults.map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell className="text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                  <TableCell>{data.objectCount}</TableCell>
                  <TableCell>{data.objectName}</TableCell>
                  <TableCell>{getAlertStatus(data.alertStatus)}</TableCell>
                  <TableCell>
                    {data.regDate.slice(0, 10).replace(/-/g, "/")}- {data.regDate.slice(11, 16)}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center', padding: '8px', width: '100px' }}>
                    <IconButton
                      onClick={() => handleImageClick(`${data.framePath}`)}
                      color="primary"
                      size="small"
                      style={{ padding: 0 }}
                    >
                      <img
                        src={`${detection}/${data.framePath}`}
                        alt="Modal"
                        style={{
                          borderRadius: '5px',
                          maxHeight: '50px',
                          width: '100%',
                        }}
                      />
                    </IconButton>
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
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="form-select p-1 m-0 bg-light text-dark border-light"
            style={{ width: "60px" }}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>



      {/* Modal for Image */}
      <Modal show={showImageModal} onHide={handleCloseModal} centered>
        <Modal.Header className="m-0 p-2" closeButton style={{ border: "none" }}>
          <Modal.Title className="text-center w-100 m-0 p-0" style={{ fontWeight: "bold" }}>
            Image Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center m-0 p-2">
          <img
            src={`${detection}/${modalImageUrl}`}
            alt="Modal"
            style={{
              borderRadius: "15px",
              maxHeight: "350px",
              width: "100%",
              objectFit: "cover",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            }}
          />
        </Modal.Body>
        <Modal.Footer className="m-0 p-2" style={{ border: "none", justifyContent: "end" }}>
          <Button
            onClick={handleCloseModal}
            style={{
              backgroundColor: "gray",
              border: "none",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "5px",
              fontWeight: "bold",
              boxShadow: "0px 4px 10px rgba(255, 90, 95, 0.5)",
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Analytics;
