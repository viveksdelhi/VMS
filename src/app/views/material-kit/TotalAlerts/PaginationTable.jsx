import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Container } from "react-bootstrap";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { API, detection, token } from "serverConnection";

function PaginationTable() {
  const [tableData, setTableData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  const location=useLocation()
  const state = location.state?.Status || ""; // Empty if no state passed
  console.log(state)

  // Fetch table data
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get(`${API}/api/CameraAlert/GetAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let filterData=response.data
        console.log(filterData)
        if(state==="Basic"){ 
          filterData=filterData.filter(data=>data.alertStatus==="B")
        }
        else if(state==="Sevier"){
            filterData=filterData.filter(data=>data.alertStatus==="S")
          }
        else if(state==="Critical"){
            filterData=filterData.filter(data=>data.alertStatus==="C")
          }
        setTableData(filterData);
      } catch (error) {
        console.error("Error fetching camera data:", error);
      }
    };
    
    fetchTableData();
  }, []);


  

  // Calculate paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  // Handle image modal visibility
  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => setShowImageModal(false);

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

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page on page size change
  };

  return (
    <Container className="mt-4">
      {/* Table for Camera Details */}
      <TableContainer component={Paper} className="mb-4">
        <Table>
          <TableHead>
            <TableRow >
              <TableCell>S.No.</TableCell>
              <TableCell>Object Count</TableCell>
              <TableCell>Alert Type</TableCell>
              <TableCell>Object Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((data, index) => (
              <TableRow key={data.id}>
                <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                <TableCell>{data.objectCount}</TableCell>
                <TableCell>{data.alertStatus}</TableCell>
                <TableCell>{data.objectName}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleImageClick(data.framePath)}
                    color="primary"
                    size="small"
                  >
                    <PhotoCamera />
                  </IconButton>
                </TableCell>
                <TableCell>
                  {new Date(data.regDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="d-flex justify-content-end align-items-center mb-4">
        <div className="d-flex align-items-center">
          {/* Pagination Controls */}
          <Button 
            variant="primary" 
            onClick={handlePreviousPage} 
            disabled={currentPage === 1}
            className="me-2"
          >
            Previous
          </Button>
          <div className="me-3">
            Page {currentPage} of {totalPages}
          </div>
          <Button 
            variant="primary" 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>

        {/* Items per Page Select Box */}
        <div className="ms-3">
          <label htmlFor="itemsPerPage" className="me-2">Show: </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Modal for Viewing Images */}
      <Modal show={showImageModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={`${detection}/${modalImageUrl}`}
            alt="Modal"
            className="img-fluid"
            style={{ borderRadius: "5px", maxHeight: "500px", width: "100%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PaginationTable;
