// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, ListGroup, Table, Modal, Button, Form } from "react-bootstrap";
// import Hls from "hls.js";
// import { PlayCircleOutline, StopCircle, PhotoCamera } from "@mui/icons-material";
// import IconButton from "@mui/material/IconButton";
// import { ANPRAPI, API, RTSPAPI, token } from "serverConnection";

// function Anpr() {
//   const [cameraList, setCameraList] = useState([]);
//   const [selectedCamera, setSelectedCamera] = useState(null);
//   const [videoUrl, setVideoUrl] = useState("");
//   const [tableData, setTableData] = useState([]);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [modalImageUrl, setModalImageUrl] = useState("");
//   const [videoPlaying, setVideoPlaying] = useState(false);

//    // Pagination state
//    const [currentPage, setCurrentPage] = useState(1);
//    const [itemsPerPage, setItemsPerPage] = useState(10);
//    const [totalItems, setTotalItems] = useState(0);

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


//   useEffect(()=>{
//     const fetchdata2=(async()=>{
//        const response = await axios.get(`${API}/api/CameraTrackingData/Pagination?pageNumber=${currentPage}&pageSize=${itemsPerPage}`)
//        setTableData(response.data.cameraTrackingData)
//        setTotalItems(response.data.totalCount)

//     })
    
//     fetchdata2()
//   },[])

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

//     try {
//       const response = await axios.get(`${API}/api/CameraTrackingData/GetAll`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const allCameraData = response.data;

//       const filteredCameraData = allCameraData.filter(
//         (data) => data.cameraId === camera.cameraId
//       );

//       setTableData(filteredCameraData.length > 0 ? filteredCameraData : []);
//     } catch (error) {
//       console.error("Error fetching camera data:", error);
//     }

//     if (camera === selectedCamera) {
//       handleVideoToggle();
//     } else {
//       setVideoUrl(`${RTSPAPI}/${camera.cameraId}/index.m3u8`);
//       setVideoPlaying(true);
//     }
//   };

//   const handleVideoToggle = () => {
//     const videoElement = document.getElementById("camera-video");

//     if (videoPlaying) {
//       axios.get(`${ANPRAPI}/stop/?path=${selectedCamera.camera.rtspurl}&id=${selectedCamera.cameraId}`)
//         .then((res) => {
//           console.log("Stop response:", res);
//         })
//         .catch((error) => {
//           console.error("Error stopping video:", error.message || error);
//         });
//       videoElement.pause();
//       setVideoPlaying(false);
//     } else {
//       axios.get(`${ANPRAPI}/start/?path=${selectedCamera.camera.rtspurl}&id=${selectedCamera.cameraId}`)
//         .then((res) => {
//           console.log("Start response:", res);
//         })
//         .catch((error) => {
//           console.error("Error starting video:", error.message || error);
//         });

//       videoElement.play();
//       setVideoPlaying(true);
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
//   const currentData = tableData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(tableData.length / itemsPerPage);

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
//       <div className="row">
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
//   <Card className="shadow-sm bg-dark m-0 p-0" style={{ height: "260px" }}>
//     <Card.Header className="text-light text-center" as="h5">Vehicle Detection</Card.Header>
//     <Card.Body className="text-center m-0 p-0" style={{ height: "100%", padding: 0 }}>
//       {selectedCamera ? (
//         <div style={{ width: "100%", height: "100%" }}>
//           <video
//             id="camera-video"
//             autoPlay
//             muted
//             style={{ width: "100%", height: "80%", borderRadius: "5px" }}
//           />
//         </div>
//       ) : (
//         <p className="text-danger">Select a camera to view the feed</p>
//       )}
//     </Card.Body>
//   </Card>
// </div>


//         <div className="col-md-3 col-3">
//           <Card className="shadow-sm bg-dark" style={{ height: "260px" }}>
//             <Card.Header className="text-light text-center" as="h5">Vehicle Details</Card.Header>
//             <Card.Body style={{ height: "300px", overflowY: "auto", msOverflowStyle: "none", scrollbarWidth: "none", padding: "0 1rem" }}>
//               {selectedCamera && tableData.length > 0 ? (
//                 <div>
//                   <img
//                     src={`${ANPRAPI}/${tableData[0].vichelImage}`}
//                     alt="Vehicle"
//                     className="img-fluid"
//                     style={{ borderRadius: "5px" }}
//                   />
//                   <img
//                     src={`${ANPRAPI}/${tableData[0].noPlateImage}`}
//                     alt="Vehicle"
//                     className="img-fluid"
//                     style={{ borderRadius: "5px" }}
//                   />
//                 </div>
//               ) : (
//                 <p className="text-danger">Select a camera to view details</p>
//               )}
//             </Card.Body>
//           </Card>
//         </div>
//       </div>

//       <div className="mt-4">
//         <Table striped bordered hover variant="dark">
//           <thead>
//             <tr>
//               <th>S.No.</th>
//               <th>Camera Name</th>
//               <th>Vehicle Image</th>
//               <th>No. Plate Image</th>
//               <th>Vehicle No</th>
//               <th>Date and Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentData.map((data, index) => (
//               <tr key={data.id}>
//                 <td>{index + 1 + indexOfFirstItem}</td>
//                 <td>{data.camera.name}</td>
//                 <td className="text-center">
//                   <IconButton
//                     onClick={() => handleImageClick(`${ANPRAPI}/${data.vichelImage.replace(/\\/g, '/')}`)}
//                     color="primary"
//                     className="ms-2"
//                     size="small"
//                   >
//                     <PhotoCamera />
//                   </IconButton>
//                 </td>
//                 <td className="text-center">
//                   <IconButton
//                     onClick={() => handleImageClick(`${ANPRAPI}/${data.noPlateImage.replace(/\\/g, '/')}`)}
//                     color="primary"
//                     className="ms-2"
//                     size="small"
//                   >
//                     <PhotoCamera />
//                   </IconButton>
//                 </td>
//                 <td>{data.vichelNo}</td>
//                 <td>
//                   {data.regDate.slice(0, 10).replace(/-/g, "-")}
//                   {` ${data.regDate.slice(11, 19)}`}
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
//         <div>
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
//             alt=""
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
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, ListGroup, Table, Modal, Button, Form } from "react-bootstrap";
import Hls from "hls.js";
import { PlayCircleOutline, StopCircle, PhotoCamera } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { ANPRAPI, API, LiveFeedUrl  } from "serverConnection";

function Anpr() {
  const [cameraList, setCameraList] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [tableData, setTableData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get(`${API}/api/CameraAlertStatus/GetAll`);
        const cameras = response.data.filter(cam => cam.anpr === true);
        setCameraList(cameras);
      } catch (error) {
        console.error("Error fetching camera list:", error);
      }
    };

    fetchCameras();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
          orderBy:"id",
          orderType:"desc"
        };
        if (selectedCamera) {
          params.cameraId = selectedCamera.cameraId;
        }

        const response = await axios.get(`${API}/api/DetectionVehicle/Pagination`, { params });
        setTableData(response.data.cameraAlertStatuses);
        console.log(response.data.cameraAlertStatuses);
        setTotalItems(response.data.totalCount);
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };

    fetchData();
    
    // Set interval to fetch data every 2 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentPage, itemsPerPage, selectedCamera]);

  useEffect(() => {
    if (videoUrl && Hls.isSupported()) {
      const videoElement = document.getElementById("camera-video");
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement
          .play()
          .catch((error) => console.error("Error attempting to play", error));
      });

      return () => {
        hls.destroy();
      };
    } else if (videoUrl) {
      const videoElement = document.getElementById("camera-video");
      videoElement.src = videoUrl;
      videoElement.addEventListener("loadedmetadata", () => {
        videoElement
          .play()
          .catch((error) => console.error("Error attempting to play", error));
      });

      return () => {
        videoElement.removeEventListener("loadedmetadata", () => {});
      };
    }
  }, [videoUrl]);

  const handleCameraClick = async (camera) => {
    setSelectedCamera(camera);
    setCurrentPage(1); // Reset to the first page when camera changes

    try {
      const response = await axios.get(`${API}/api/DetectionVehicle/Pagination`, {
        params: {
          pageNumber: 1, // Ensure starting from the first page
          pageSize: itemsPerPage,
          cameraId: camera.cameraId,
          orderBy:"id",
          orderType:"desc"
        }
      });
      setTableData(response.data.cameraAlertStatuses);
      setTotalItems(response.data.totalCount);

      setVideoUrl(`${LiveFeedUrl }/${camera.cameraId}/index.m3u8`);
      setVideoPlaying(true);
    } catch (error) {
      console.error("Error fetching camera data:", error);
    }
  };

  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => setShowImageModal(false);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 col-3">
          <Card className="shadow-sm bg-dark text-light" style={{ height: "260px" }}>
            <Card.Header className="text-center" as="h5">Camera</Card.Header>
            <Card.Body className="p-0 bg-dark text-light" style={{ height: "300px", overflowY: "auto", msOverflowStyle: "none", scrollbarWidth: "none" }}>
              <ListGroup className="bg-dark text-light">
                {cameraList.map((camera) => (
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
                      {selectedCamera === camera && videoPlaying ? (
                        <StopCircle />
                      ) : (
                        <PlayCircleOutline />
                      )}
                    </IconButton>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6 col-6">
          <Card className="shadow-sm bg-dark m-0 p-0" style={{ height: "260px" }}>
            <Card.Header className="text-light text-center" as="h5">Vehicle Detection</Card.Header>
            <Card.Body className="text-center m-0 p-0" style={{ height: "100%", padding: 0 }}>
              {selectedCamera ? (
                <div style={{ width: "100%", height: "100%" }}>
                  <video
                    id="camera-video"
                    autoPlay
                    muted
                    style={{ width: "100%", height: "80%", borderRadius: "5px" }}
                  />
                </div>
              ) : (
                <p className="text-danger">Select a camera to view the feed</p>
              )}
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3 col-3">
          <Card className="shadow-sm bg-dark" style={{ height: "260px" }}>
            <Card.Header className="text-light text-center" as="h5">Vehicle Details</Card.Header>
            <Card.Body style={{ height: "300px", overflowY: "auto", msOverflowStyle: "none", scrollbarWidth: "none", padding: "0 1rem" }}>
              {selectedCamera && tableData.length > 0 ? (
                <div>
                  <img
                    src={`${ANPRAPI}/${tableData[0].vichelImage}`}
                    alt="Not Found"
                    className="img-fluid text-light"
                    style={{ borderRadius: "5px" }}
                  />
                  <br />
                  <img
                    src={`${ANPRAPI}/${tableData[0].noPlateImage}`}
                    alt="Not Found"
                    className="img-fluid text-light"
                    style={{ borderRadius: "5px" }}
                  />
                </div>
              ) : (
                <p className="text-danger">Select a camera to view details</p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div> 

      <div className="mt-4">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Camera Name</th>
              <th>Vehicle No</th>
              <th>Date and Time</th>
              <th>Vehicle Image</th>
              <th>No. Plate Image</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr key={data.id}>
                <td>{index + 1 + indexOfFirstItem}</td>
                <td>{data.camera.name}</td>
                <td>{data.text}</td>
                <td>
                  {data.regDate.slice(0, 10).replace(/-/g, "-")}
                  {` ${data.regDate.slice(11, 19)}`}
                </td>
                <td className="text-center m-0 p-0" style={{width:"25px"}}> 
                  <IconButton
                    onClick={() => handleImageClick(`${ANPRAPI}/${data.vichelImage.replace(/\\/g, '/')}`)}
                    color="primary"
                    size="small"
                  >
                    <img src={`${ANPRAPI}/${data.vichelImage}`} alt="no image" height={50} width={110} />
                  </IconButton>
                </td>
                <td className="text-center m-0 p-0" style={{width:"25px"}}>
                  <IconButton
                    onClick={() => handleImageClick(`${ANPRAPI}/${data.noPlateImage.replace(/\\/g, '/')}`)}
                    color="primary"
                    className="ms-2"
                    size="small"
                  >
                     <img src={`${ANPRAPI}/${data.noPlateImage}`} alt=" no image" height={50}  width={110}/>
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-end align-items-center mt-3">
        <div className="me-2">
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
        </div>
        <div className="me-2">
          <Form.Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            aria-label="Select items per page"
            style={{ width: "auto" }}
          >
            {[10, 25, 50].map(count => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </Form.Select>
        </div>
        <div className="me-2">
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <Modal show={showImageModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={modalImageUrl}
            alt="Not Found"
            className="img-fluid"
            style={{ width: "100%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Anpr;

