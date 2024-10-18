// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, ListGroup, Table, Modal, Button } from "react-bootstrap";
// import { PlayCircleOutline, StopCircle, PhotoCamera } from "@mui/icons-material";
// import IconButton from "@mui/material/IconButton";
// import { API,detection, token } from "serverConnection";

// function Alerts() {
//   const [cameraList, setCameraList] = useState([]);
//   const [selectedCamera, setSelectedCamera] = useState(null);
//   const [videoUrl, setVideoUrl] = useState("");
//   const [videoPlaying, setVideoPlaying] = useState(false);
//   const [tableData, setTableData] = useState([]);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [modalImageUrl, setModalImageUrl] = useState("");



//   useEffect(() => {
//     const fetchCameras = async () => {
//       try {
//         const response = await axios.get(`${API}/api/CameraAlertStatus/GetAll`);
//         const cameras = response.data.filter(cam => cam.personDetection === true);
//         setCameraList(cameras);
//       } catch (error) {
//         console.error("Error fetching camera list:", error);
//       }
//     };

//     fetchCameras();
//   }, []);
//   //Total data by default
//   useEffect(() => {
//     const fetchTableData2 = async () => {
//         try {
//           const response = await axios.get(`${API}/api/CameraAlert/GetAll`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           const allCameraData = response.data;
//           console.log(allCameraData)

//           setTableData(allCameraData);

//         } catch (error) {
//           console.error("Error fetching camera data:", error);
//         }
//       }
//       fetchTableData2(); // Fetch data immediately when video is stopped or switched

//   }, []);


//   useEffect(() => {
//     const fetchTableData = async () => {
//       if (selectedCamera) {
//         try {
//           const response = await axios.get(`${API}/api/CameraAlert/GetAll`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           const allCameraData = response.data;
//           console.log(allCameraData,"hihidc")
//           const filteredCameraData = allCameraData.filter(
//             (data) => data.cameraId === selectedCamera.cameraId
//           );
//           setTableData(filteredCameraData.length > 0 ? filteredCameraData : []);
//         } catch (error) {
//           console.error("Error fetching camera data:", error);
//         }
//       }
//     };

//     if (videoPlaying) {
//       // Fetch data every 5 seconds while the video is playing
//       const intervalId = setInterval(fetchTableData, 2000);
//       return () => clearInterval(intervalId); // Clean up on unmount or when video stops
//     } else {
//       fetchTableData(); // Fetch data immediately when video is stopped or switched
//     }
//   }, [selectedCamera, videoPlaying]);

//   const handleCameraClick = (camera) => {
//     setSelectedCamera(camera);
//     if (videoPlaying && camera === selectedCamera) {
//       // If the same camera is selected, toggle video playback
//       handleVideoToggle(camera);
//     } else {
//       // Start or switch video feed
//       setVideoUrl(`${detection}/video_feed?camera_id=${camera.camera.id}`);
//       setVideoPlaying(true);
//     }
//   };

//   const handleVideoToggle = (camera) => {
//     if (videoPlaying) {
//       // Stop video by updating the URL to `stop_feed`
//       // setVideoUrl(`${detection}/stop_feed?camera_id=${camera.camera.id}&crowd=2&path=${selectedCamera?.camera.rtspurl}`);
//       setVideoUrl("");
//       setVideoPlaying(false);
//     } else {
//       // Start video
//       setVideoUrl(`${detection}/video_feed?camera_id=${camera.camera.id}`); 
//       setVideoPlaying(true);
//     }
//   };

//   const handleImageClick = (imageUrl) => {
//     setModalImageUrl(imageUrl);
//     setShowImageModal(true);
//   };

//   const handleCloseModal = () => setShowImageModal(false);

//   return (
//     <div className="container mt-4">
//       <div className="row">
//         {/* Camera List */}
//         <div className="col-md-3 col-3">
//           <Card className="shadow-sm bg-dark text-light" style={{ height: "220px" }}>
//             <Card.Header className="text-center" as="h5">
//               Camera
//             </Card.Header>
//             <Card.Body
//               className="p-0 bg-dark text-light"
//               style={{
//                 height: "300px",
//                 overflowY: "auto",
//                 msOverflowStyle: "none",
//                 scrollbarWidth: "none",
//               }}
//             >
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
//                         <StopCircle/>
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

//         {/* Video Feed */}
//         <div className="col-md-6 col-6">
//           <Card className="shadow-sm bg-dark m-0 p-0" style={{ height: "220px" }}>
//             <Card.Header className="text-light text-center" as="h5">
//               Event & Object Detection
//             </Card.Header>
//             <Card.Body className="text-center m-0 p-0" style={{ height: "300px", padding: 0 }}>
//               {selectedCamera ? (
//                 <div style={{ width: "100%", height: "100%" }}>
//                   <img
//                     id="camera-image"
//                     src={videoUrl}
//                     alt="Camera Feed"
//                     style={{
//                       width: "100%",
//                       height: "175px",
//                       borderRadius: "5px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//               ) : (
//                 <p className="text-danger">Select a camera to view the feed</p>
//               )}
//             </Card.Body>
//           </Card>
//         </div>

//         {/* Vehicle Details */}
//         <div className="col-md-3 col-3">
//           <Card className="shadow-sm bg-dark" style={{ height: "220px" }}>
//             <Card.Header className="text-light text-center" as="h5">
//               Object Details
//             </Card.Header>
//             <Card.Body
//               style={{
//                 height: "300px",
//                 overflowY: "auto",
//                 msOverflowStyle: "none",
//                 scrollbarWidth: "none",
//                 padding: "0 1rem",
//               }}
//             >
//               {selectedCamera && tableData.length > 0 ? (
//                 <div>
//                   <img
//                     src={`${detection}/${tableData[0].framePath}`}
//                     alt="Vehicle"
//                     className="img-fluid"
//                     style={{ borderRadius: "5px" }}
//                   />
//                   <div className="text-light text-center">
//                     {tableData[0].object_name}
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-danger">Not Found</p>
//               )}
//             </Card.Body>
//           </Card>
//         </div>
//       </div>

//       {/* Table Below All Camera Details */}
//       <div className="mt-4">
//         {console.log(tableData,"get data")}
//         <Table striped bordered hover variant="dark">
//           <thead>
//             <tr>
//               <th>S.No.</th>
//               <th>Object Count</th>
//               <th>Alert Type</th>
//               <th>Object Name</th>
//               <th>Image</th>
//               <th>Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.map((data, index) => (
//               <tr key={data.id}>
//                 <td>{index + 1}</td>
//                 <td>{data.objectCount}</td>
//                 <td>{data.alertStatus}</td>
//                 <td>{data.objectName}</td>
//                 <td className="text-center">
//                   <IconButton
//                     onClick={() => handleImageClick(`${data.framePath}`)}
//                     color="primary"
//                     className="ms-2"
//                     size="small"
//                   >
//                     <PhotoCamera />
//                   </IconButton>
//                 </td>
//                 <td>
//                   {data.regDate.slice(0, 10).replace(/-/g, "/")}
//                   {` ${data.regDate.slice(11, 19)}`}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       {/* Modal for Viewing Images */}
// <Modal show={showImageModal} onHide={handleCloseModal} size="lg">
//   <Modal.Header closeButton>
//     <Modal.Title>Image Preview</Modal.Title>
//   </Modal.Header>
//   <Modal.Body>
//     <img
//       src={`${detection}/${modalImageUrl}`}
//       alt="Modal"
//       className="img-fluid"
//       style={{ borderRadius: "5px", maxHeight: "500px", width: "100%" }}
//     />
//   </Modal.Body>
//   <Modal.Footer>
//     <Button variant="secondary" onClick={handleCloseModal}>
//       Close
//     </Button>
//   </Modal.Footer>
// </Modal>
//     </div>
//   );
// }

// export default Alerts;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, ListGroup, Table, Modal, Button } from "react-bootstrap";
import { PlayCircleOutline, StopCircle, PhotoCamera } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { API, detection, token } from "serverConnection";

function Alerts() {
  const [cameraList, setCameraList] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch camera list
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

  // Fetch table data for the selected camera and pagination
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

  // Handle camera selection and reset to first page
  const handleCameraClick = camera => {
    setSelectedCamera(camera);
    setCurrentPage(1); // Reset to first page when camera is selected
    if (videoPlaying && camera === selectedCamera) {
      handleVideoToggle(camera); // Toggle video if the same camera is selected
    } else {
      setVideoUrl(`${detection}/video_feed?camera_id=${camera.camera.id}`);
      setVideoPlaying(true);
    }
  };

  const handleVideoToggle = camera => {
    if (videoPlaying) {
      setVideoUrl("");
      setVideoPlaying(false); // Stop video
    } else {
      setVideoUrl(`${detection}/video_feed?camera_id=${camera.camera.id}`);
      setVideoPlaying(true); // Start video
    }
  };

  // Handle image modal
  const handleImageClick = imageUrl => {
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => setShowImageModal(false);

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Camera List */}
        <div className="col-md-3 col-3">
          <Card className="shadow-sm bg-dark text-light" style={{ height: "220px" }}>
            <Card.Header className="text-center" as="h5">
              Camera
            </Card.Header>
            <Card.Body
              className="p-0 bg-dark text-light"
              style={{
                height: "300px",
                overflowY: "auto",
              }}
            >
              <ListGroup className="bg-dark text-light">
                {cameraList.map(camera => (
                  <ListGroup.Item
                    key={camera.id}
                    className="bg-dark text-light d-flex justify-content-between align-items-center"
                    style={{ border: "none", padding: "0px 10px" }}
                  >
                    <span style={{ fontSize: "14px" }}>{camera.camera.name}</span>
                    <IconButton
                      onClick={() => handleCameraClick(camera)}
                      color="primary"
                      className="ms-2"
                      size="small"
                    >
                      {selectedCamera === camera && videoPlaying ? <StopCircle /> : <PlayCircleOutline />}
                    </IconButton>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>

        {/* Video Feed */}
        <div className="col-md-6 col-6">
          <Card className="shadow-sm bg-dark m-0 p-0" style={{ height: "220px" }}>
            <Card.Header className="text-light text-center" as="h5">
              Event & Object Detection
            </Card.Header>
            <Card.Body className="text-center m-0 p-0" style={{ height: "300px" }}>
              {selectedCamera ? (
                <img
                  src={videoUrl}
                  alt="Camera Feed"
                  style={{
                    width: "100%",
                    height: "175px",
                    borderRadius: "5px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <p className="text-danger">Select a camera to view the feed</p>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Object Details */}
        <div className="col-md-3 col-3">
          <Card className="shadow-sm bg-dark" style={{ height: "220px" }}>
            <Card.Header className="text-light text-center" as="h5">
              Object Details
            </Card.Header>
            <Card.Body
              style={{
                height: "300px",
                overflowY: "auto",
                padding: "0 1rem",
              }}
            >
              {selectedCamera && tableData.length > 0 ? (
                <div>
                  <img
                    src={`${detection}/${tableData[0].framePath}`}
                    alt="Object"
                    className="img-fluid"
                    style={{ borderRadius: "5px" }}
                  />
                  <div className="text-light text-center">{tableData[0].object_name}</div>
                </div>
              ) : (
                <p className="text-danger">Not Found</p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Table Below All Camera Details */}
      <div className="mt-4">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Object Count</th>
              <th>Alert Type</th>
              <th>Object Name</th>
              <th>Time</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody className="m-0 p-0">
            {tableData.map((data, index) => (
              <tr key={data.id}>
                {/* Reset S.No. to start from 1 for each page */}
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td>{data.objectCount}</td>
                <td>{data.alertStatus}</td>
                <td>{data.objectName}</td>
                <td>
                  {data.regDate.slice(0, 10).replace(/-/g, "/")}-
                  {data.regDate.slice(11, 16)}
                </td>
                <td className="text-center m-0 p-1" style={{width:"100px"}}>
                  <IconButton
                    onClick={() => handleImageClick(`${data.framePath}`)}
                    color="primary"
                    className="m-0 p-0"
                    size="small"
                  >
                    <img
                      src={`${detection}/${data.framePath}`}
                      alt="Modal"
                      className="img-fluid p-0 m-1"
                      style={{ borderRadius: "5px", maxHeight: "50px", width: "100%" }}
                    />
                  </IconButton>
                </td>

              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination */}
        <div className="d-flex justify-content-end align-items-center mb-4">
          <div className="d-flex align-items-center">
            {/* Pagination Controls */}
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="me-2 bg-success border-success"
            >
              Previous
            </Button>
            <div className="me-2 text-light">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="me-2 bg-success border-success"
            >
              Next
            </Button>
            <label htmlFor="itemsPerPage" className="text-light me-2">
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="form-select p-1 m-0 bg-light text-dark border-light"
              style={{ width: "60px" }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
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

export default Alerts;


