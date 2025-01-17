import React, { useState, useEffect } from "react";
import axios from "axios";
import {Modal, Button, Badge } from "react-bootstrap";
import { ANPRAPI, API, detection, token } from "serverConnection";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, TableSortLabel } from '@mui/material';
import Dropdown from 'react-bootstrap/Dropdown';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function Anpr() {
  const [cameraList, setCameraList] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCameras = async () => {
    try {
      const response = await axios.get(`${API}/api/CameraAlertStatus/GetAll`);
      const cameras = response.data.filter(cam => cam.anpr === true);
      setCameraList(cameras);
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

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const cameraId = selectedCamera ? selectedCamera.camera.id : "";
        const response = await axios.get(
          `${API}/api/NumberPlateReadedData/Pagination?pageNumber=${currentPage}&pageSize=${itemsPerPage}&cameraId=${cameraId}&orderBy=desc&orderType=desc`,
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
        "Camera Name": data.camera.name,
        "Vehicle No": data.text,
        "Date & Time": data.regDate.slice(0, 10).replace(/-/g, "/") + " - " + data.regDate.slice(11, 19),
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "Camera Data");
    XLSX.writeFile(wb, "camera_data.xlsx");
  };

  // PDF download function
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["S.No.", "Camera Name", "Vehicle No","Date & Time"];
    const tableRows = tableData.map((data, index) => [
      index + 1 + (currentPage - 1) * itemsPerPage,
      data.camera.name,
      data.text,
      data.regDate.slice(0, 10).replace(/-/g, "/") + " - " + data.regDate.slice(11, 19),
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("camera_data.pdf");
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
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleSort("name")}>Camera Name</TableSortLabel>
              </TableCell>
                <TableCell style={{ color: '#fff' }}>
                <TableSortLabel
                className="text-light"
                active={orderBy === "text"}
                direction={orderBy === "text" ? order : "asc"}
                onClick={() => handleSort("text")}>Vehicle No</TableSortLabel>
                </TableCell>
                <TableCell style={{ color: '#fff' }}>
                <TableSortLabel
                className="text-light"
                active={orderBy === "regDate"}
                direction={orderBy === "regDate" ? order : "asc"}
                onClick={() => handleSort("regDate")}>Date and Time</TableSortLabel></TableCell>
                <TableCell style={{ color: '#fff',textAlign:"center" }}>Vehicle Image</TableCell>
                <TableCell className="text-center text-light" style={{ borderTopRightRadius: '10px', overflow: 'hidden' }}>No. Plate Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedResults.map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell className="text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                  <TableCell>{data.camera.name}</TableCell>
                  <TableCell>{data.text}</TableCell>
                  <TableCell>
                  {data.regDate.slice(0, 10).replace(/-/g, "-")}{` ${data.regDate.slice(11, 19)}`}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center', padding: '8px', width: '100px' }}>
                  <IconButton
                    onClick={() => handleImageClick(`${ANPRAPI}/${data.framePath.replace(/\\/g, '/')}`)}
                    color="primary"
                    size="small"
                  >
                    <img src={`${ANPRAPI}/${data.framePath}`} alt="no image" height={50} width={110} />
                  </IconButton>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center', padding: '8px', width: '100px' }}>
                  <IconButton
                    onClick={() => handleImageClick(`${ANPRAPI}/${data.platePath.replace(/\\/g, '/')}`)}
                    color="primary"
                    className="ms-2"
                    size="small"
                  >
                     <img src={`${ANPRAPI}/${data.platePath}`} alt=" no image" height={50}  width={110}/>
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
            src={`${modalImageUrl}`}
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

export default Anpr;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, ListGroup, Table, Modal, Button, Form } from "react-bootstrap";
// import Hls from "hls.js";
// import { PlayCircleOutline, StopCircle, PhotoCamera } from "@mui/icons-material";
// import IconButton from "@mui/material/IconButton";
// import { ANPRAPI, API, LiveFeedUrl  } from "serverConnection";

// function Anpr() {
//   const [cameraList, setCameraList] = useState([]);
//   const [selectedCamera, setSelectedCamera] = useState(null);
//   const [videoUrl, setVideoUrl] = useState("");
//   const [tableData, setTableData] = useState([]);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [modalImageUrl, setModalImageUrl] = useState("");
//   const [videoPlaying, setVideoPlaying] = useState(false);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [totalItems, setTotalItems] = useState(0);

//   useEffect(() => {
//     const fetchCameras = async () => {
//       try {
//         const response = await axios.get(`${API}/api/CameraAlertStatus/GetAll`);
//         const cameras = response.data.filter(cam => cam.anpr === true);
//         setCameraList(cameras);
//       } catch (error) {
//         console.error("Error fetching camera list:", error);
//       }
//     };

//     fetchCameras();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const params = {
//           pageNumber: currentPage,
//           pageSize: itemsPerPage,
//           orderBy:"id",
//           orderType:"desc"
//         };
//         if (selectedCamera) {
//           params.cameraId = selectedCamera.cameraId;
//         }

//         const response = await axios.get(`${API}/api/NumberPlateReadedData/Pagination`, { params });
//         setTableData(response.data.cameraAlertStatuses);
//         console.log(response.data.cameraAlertStatuses);
//         setTotalItems(response.data.totalCount);
//       } catch (error) {
//         console.error("Error fetching table data:", error);
//       }
//     };

//     fetchData();
    
//     // Set interval to fetch data every 2 seconds
//     const intervalId = setInterval(() => {
//       fetchData();
//     }, 2000);

//     // Cleanup interval on component unmount
//     return () => clearInterval(intervalId);
//   }, [currentPage, itemsPerPage, selectedCamera]);

//   useEffect(() => {
//     if (videoUrl && Hls.isSupported()) {
//       const videoElement = document.getElementById("camera-video");
//       const hls = new Hls();
//       hls.loadSource(videoUrl);
//       hls.attachMedia(videoElement);
//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         videoElement
//           .play()
//           .catch((error) => console.error("Error attempting to play", error));
//       });

//       return () => {
//         hls.destroy();
//       };
//     } else if (videoUrl) {
//       const videoElement = document.getElementById("camera-video");
//       videoElement.src = videoUrl;
//       videoElement.addEventListener("loadedmetadata", () => {
//         videoElement
//           .play()
//           .catch((error) => console.error("Error attempting to play", error));
//       });

//       return () => {
//         videoElement.removeEventListener("loadedmetadata", () => {});
//       };
//     }
//   }, [videoUrl]);

//   const handleCameraClick = async (camera) => {
//     setSelectedCamera(camera);
//     setCurrentPage(1); // Reset to the first page when camera changes

//     try {
//       const response = await axios.get(`${API}/api/NumberPlateReadedData/Pagination`, {
//         params: {
//           pageNumber: 1, // Ensure starting from the first page
//           pageSize: itemsPerPage,
//           cameraId: camera.cameraId,
//           orderBy:"id",
//           orderType:"desc"
//         }
//       });
//       setTableData(response.data.cameraAlertStatuses);
//       setTotalItems(response.data.totalCount);

//       setVideoUrl(`${LiveFeedUrl }/${camera.cameraId}/index.m3u8`);
//       setVideoPlaying(true);
//     } catch (error) {
//       console.error("Error fetching camera data:", error);
//     }
//   };

//   const handleImageClick = (imageUrl) => {
//     setModalImageUrl(imageUrl);
//     setShowImageModal(true);
//   };

//   const handleCloseModal = () => setShowImageModal(false);

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const handleItemsPerPageChange = (event) => {
//     setItemsPerPage(Number(event.target.value));
//     setCurrentPage(1); // Reset to first page when items per page changes
//   };

//   return (
//     <div className="container mt-4">
//       {/* <div className="row">
//         <div className="col-md-3 col-3">
//           <Card className="shadow-sm bg-dark text-light" style={{ height: "260px" }}>
//             <Card.Header className="text-center" as="h5">Camera</Card.Header>
//             <Card.Body className="p-0 bg-dark text-light" style={{ height: "300px", overflowY: "auto", msOverflowStyle: "none", scrollbarWidth: "none" }}>
//               <ListGroup className="bg-dark text-light">
//                 {cameraList.map((camera) => (
//                   <ListGroup.Item
//                     key={camera.id}
//                     className="bg-dark text-light d-flex justify-content-between align-items-center"
//                     style={{ border: "none", padding: "0px 10px" }}
//                   >
//                     <span style={{ fontSize: "14px" }}>{camera.camera.name}</span>
//                     <IconButton
//                       onClick={() => handleCameraClick(camera)}
//                       color="primary"
//                       className="ms-2"
//                       size="small"
//                     >
//                       {selectedCamera === camera && videoPlaying ? (
//                         <StopCircle />
//                       ) : (
//                         <PlayCircleOutline />
//                       )}
//                     </IconButton>
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </Card.Body>
//           </Card>
//         </div>
//         <div className="col-md-6 col-6">
//           <Card className="shadow-sm bg-dark m-0 p-0" style={{ height: "260px" }}>
//             <Card.Header className="text-light text-center" as="h5">Vehicle Detection</Card.Header>
//             <Card.Body className="text-center m-0 p-0" style={{ height: "100%", padding: 0 }}>
//               {selectedCamera ? (
//                 <div style={{ width: "100%", height: "100%" }}>
//                   <video
//                     id="camera-video"
//                     autoPlay
//                     muted
//                     style={{ width: "100%", height: "80%", borderRadius: "5px" }}
//                   />
//                 </div>
//               ) : (
//                 <p className="text-danger">Select a camera to view the feed</p>
//               )}
//             </Card.Body>
//           </Card>
//         </div>
//         <div className="col-md-3 col-3">
//           <Card className="shadow-sm bg-dark" style={{ height: "260px" }}>
//             <Card.Header className="text-light text-center" as="h5">Vehicle Details</Card.Header>
//             <Card.Body style={{ height: "300px", overflowY: "auto", msOverflowStyle: "none", scrollbarWidth: "none", padding: "0 1rem" }}>
//               {selectedCamera && tableData.length > 0 ? (
//                 <div>
//                   <img
//                     src={`${ANPRAPI}/${tableData[0].vichelImage}`}
//                     alt="Not Found"
//                     className="img-fluid text-light"
//                     style={{ borderRadius: "5px" }}
//                   />
//                   <br />
//                   <img
//                     src={`${ANPRAPI}/${tableData[0].noPlateImage}`}
//                     alt="Not Found"
//                     className="img-fluid text-light"
//                     style={{ borderRadius: "5px" }}
//                   />
//                 </div>
//               ) : (
//                 <p className="text-danger">Select a camera to view details</p>
//               )}
//             </Card.Body>
//           </Card>
//         </div>
//       </div>  */}

//       <div className="mt-4">
//         <Table striped bordered hover variant="dark">
//           <thead>
//             <tr>
//               <th>S.No.</th>
//               <th>Camera Name</th>
//               <th>Vehicle No</th>
//               <th>Date and Time</th>
//               <th>Vehicle Image</th>
//               <th>No. Plate Image</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.map((data, index) => (
//               <tr key={data.id}>
//                 <td>{index + 1 + indexOfFirstItem}</td>
//                 <td>{data.camera.name}</td>
//                 <td>{data.text}</td>
//                 <td>
//                   {data.regDate.slice(0, 10).replace(/-/g, "-")}
//                   {` ${data.regDate.slice(11, 19)}`}
//                 </td>
//                 <td className="text-center m-0 p-0" style={{width:"25px"}}> 
//                   <IconButton
//                     onClick={() => handleImageClick(`${ANPRAPI}/${data.vichelImage.replace(/\\/g, '/')}`)}
//                     color="primary"
//                     size="small"
//                   >
//                     <img src={`${ANPRAPI}/${data.vichelImage}`} alt="no image" height={50} width={110} />
//                   </IconButton>
//                 </td>
//                 <td className="text-center m-0 p-0" style={{width:"25px"}}>
//                   <IconButton
//                     onClick={() => handleImageClick(`${ANPRAPI}/${data.framePath.replace(/\\/g, '/')}`)}
//                     color="primary"
//                     className="ms-2"
//                     size="small"
//                   >
//                      <img src={`${ANPRAPI}/${data.platePath}`} alt=" no image" height={50}  width={110}/>
//                   </IconButton>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       <div className="d-flex justify-content-end align-items-center mt-3">
//         <div className="me-2">
//           <Button
//             variant="secondary"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </Button>
//         </div>
//         <div className="me-2">
//           <Form.Select
//             value={itemsPerPage}
//             onChange={handleItemsPerPageChange}
//             aria-label="Select items per page"
//             style={{ width: "auto" }}
//           >
//             {[10, 25, 50].map(count => (
//               <option key={count} value={count}>
//                 {count}
//               </option>
//             ))}
//           </Form.Select>
//         </div>
//         <div className="me-2">
//           <Button
//             variant="secondary"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </Button>
//         </div>
//       </div>

//       <Modal show={showImageModal} onHide={handleCloseModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Image</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <img
//             src={modalImageUrl}
//             alt="Not Found"
//             className="img-fluid"
//             style={{ width: "100%" }}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default Anpr;

