import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, ListGroup, Table, Modal, Button } from "react-bootstrap";
import { PlayCircleOutline, StopCircle, PhotoCamera } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { API,detection, token } from "serverConnection";

function Alerts() {
  const [cameraList, setCameraList] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

   

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
  //Total data by default
  useEffect(() => {
    const fetchTableData2 = async () => {
        try {
          const response = await axios.get(`${API}/api/CameraAlert/GetAll`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const allCameraData = response.data;
          console.log(allCameraData)
         
          setTableData(allCameraData);

        } catch (error) {
          console.error("Error fetching camera data:", error);
        }
      }
      fetchTableData2(); // Fetch data immediately when video is stopped or switched
    
  }, []);


  useEffect(() => {
    const fetchTableData = async () => {
      if (selectedCamera) {
        try {
          const response = await axios.get(`${API}/api/CameraAlert/GetAll`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const allCameraData = response.data;
          console.log(allCameraData,"hihidc")
          const filteredCameraData = allCameraData.filter(
            (data) => data.cameraId === selectedCamera.cameraId
          );
          setTableData(filteredCameraData.length > 0 ? filteredCameraData : []);
        } catch (error) {
          console.error("Error fetching camera data:", error);
        }
      }
    };

    if (videoPlaying) {
      // Fetch data every 5 seconds while the video is playing
      const intervalId = setInterval(fetchTableData, 2000);
      return () => clearInterval(intervalId); // Clean up on unmount or when video stops
    } else {
      fetchTableData(); // Fetch data immediately when video is stopped or switched
    }
  }, [selectedCamera, videoPlaying]);

  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
    if (videoPlaying && camera === selectedCamera) {
      // If the same camera is selected, toggle video playback
      handleVideoToggle(camera);
    } else {
      // Start or switch video feed
      setVideoUrl(`${detection}/video_feed?camera_id=${camera.camera.id}`);
      setVideoPlaying(true);
    }
  };

  const handleVideoToggle = (camera) => {
    if (videoPlaying) {
      // Stop video by updating the URL to `stop_feed`
      // setVideoUrl(`${detection}/stop_feed?camera_id=${camera.camera.id}&crowd=2&path=${selectedCamera?.camera.rtspurl}`);
      setVideoUrl("");
      setVideoPlaying(false);
    } else {
      // Start video
      setVideoUrl(`${detection}/video_feed?camera_id=${camera.camera.id}`); 
      setVideoPlaying(true);
    }
  };

  const handleImageClick = (imageUrl) => {
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
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
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
                        <StopCircle/>
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

        {/* Video Feed */}
        <div className="col-md-6 col-6">
          <Card className="shadow-sm bg-dark m-0 p-0" style={{ height: "220px" }}>
            <Card.Header className="text-light text-center" as="h5">
              Event & Object Detection
            </Card.Header>
            <Card.Body className="text-center m-0 p-0" style={{ height: "300px", padding: 0 }}>
              {selectedCamera ? (
                <div style={{ width: "100%", height: "100%" }}>
                  <img
                    id="camera-image"
                    src={videoUrl}
                    alt="Camera Feed"
                    style={{
                      width: "100%",
                      height: "175px",
                      borderRadius: "5px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <p className="text-danger">Select a camera to view the feed</p>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Vehicle Details */}
        <div className="col-md-3 col-3">
          <Card className="shadow-sm bg-dark" style={{ height: "220px" }}>
            <Card.Header className="text-light text-center" as="h5">
              Object Details
            </Card.Header>
            <Card.Body
              style={{
                height: "300px",
                overflowY: "auto",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                padding: "0 1rem",
              }}
            >
              {selectedCamera && tableData.length > 0 ? (
                <div>
                  <img
                    src={`${detection}/${tableData[0].framePath}`}
                    alt="Vehicle"
                    className="img-fluid"
                    style={{ borderRadius: "5px" }}
                  />
                  <div className="text-light text-center">
                    {tableData[0].object_name}
                  </div>
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
        {console.log(tableData,"get data")}
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Object Count</th>
              <th>Alert Type</th>
              <th>Object Name</th>
              <th>Image</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr key={data.id}>
                <td>{index + 1}</td>
                <td>{data.objectCount}</td>
                <td>{data.alertStatus}</td>
                <td>{data.objectName}</td>
                <td className="text-center">
                  <IconButton
                    onClick={() => handleImageClick(`${data.framePath}`)}
                    color="primary"
                    className="ms-2"
                    size="small"
                  >
                    <PhotoCamera />
                  </IconButton>
                </td>
                <td>
                  {data.regDate.slice(0, 10).replace(/-/g, "/")}
                  {` ${data.regDate.slice(11, 19)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
    </div>
  );
}

export default Alerts;
