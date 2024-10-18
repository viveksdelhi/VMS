import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Modal,
  Button,
} from "react-bootstrap";


import AnalyticsList from '../object/AnalyticsList';

import Hls from "hls.js";
import axios from "axios";
import {
  API,
  LiveFeedUrl,
  StreamAPI,
  detection,
  ANPRAPI,
} from "serverConnection";
import { ObjectDetection } from "../object/ObjectDetection";
import { Analytics, CameraAlt, LocationOn } from '@mui/icons-material'; 
import nocamera from "../../../../assets/Image/ajimg/notcamera.png";
const VideoGrid = () => {
  const [gridSize, setGridSize] = useState(2);
  const [videoUrls, setVideoUrls] = useState([]);
  const [cameraData, setCameraData] = useState([]);
  const [allcamera,setAllcamera]=useState([])
  
  


  const fetchDatas = async () => {
    try {
      console.log("Fetching all camera data...");
      const response = await axios.get(`${API}/api/Camera/GetAll`);
      const cameras = response.data;
      setAllcamera(response.data)
      // console.log("All cameras data fetched:", cameras);

      
      const payloads = [];

      // Array of promises to fetch status for each camera
      // const statusPromises = cameras.map(async (camera) => {
      //   try {
      //     // Fetch alert status for the camera
      //     const statusResponse = await axios.get(
      //       `${API}/api/CameraAlertStatus/CameraAlert/${camera.id}`
      //     );
      //     const alertStatus = statusResponse.data;
      //     // console.log(`Alert status for camera ${camera.id}:`, alertStatus);

      //     // If person detection is true, prepare payload
      //     // if (alertStatus.personDetection == true || alertStatus.personDetection == false) {
      //     //   // console.log(`Preparing payload for camera ${camera.id}`);
      //     //   console.log(`person`, alertStatus.personDetection);

      //     //   // Prepare payload with correct types
      //     //   const payload = {
      //     //     camera_id: parseInt(camera.id, 10), // Ensure camera_id is an integer
      //     //     url: camera.rtspurl,
      //     //     camera_ip: camera.cameraIP,
      //     //     running: "true"
      //     //     // running: alertStatus.personDetection.toString()
      //     //     // camera_name: camera.name,
      //     //     // location_name: camera.location,
      //     //     // latitude: parseFloat(camera.latitude), // Ensure latitude is a float
      //     //     // longitude: parseFloat(camera.longitude), // Ensure longitude is a float
      //     //     // area_id: parseInt(camera.groupId, 10), // Ensure area_id is an integer
              
      //     //   };

      //     //   // Add the payload to the array
      //     //   payloads.push(payload2);
      //     // }
         

      //   } catch (statusError) {
      //     console.error(
      //       `Error fetching alert status for camera ${camera.id}:`,
      //       statusError
      //     );
      //   }
      // });
      // await Promise.all(statusPromises);


      
      // if (payloads.length > 0) {
      //   // Post the accumulated payloads in a single request
      //   console.log("Posting all payloads to detection2 API");
      //   await axios.post(`${detection}/details`, { cameras: payloads }, {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });
      //   console.log("All payloads posted successfully ", { cameras: payloads });
      // } else {
      //   console.log("No payloads to post");
      // }

    } catch (fetchError) {
      console.error("Error fetching camera data:", fetchError);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch camera data
        const response = await axios.get(`${API}/api/Camera/GetAll`);
        const data = response.data;
        const updatedUrls = data.map(
          (camera) => `${LiveFeedUrl}/${camera.id}/index.m3u8`
        );

        // Start streaming for each camera
        const postRequests = data.map((camera) =>
          axios
            .post(`${StreamAPI} `, {
              id: camera.id,
              name: camera.name,
              rtspUrl: camera.rtspurl,
            })
            .catch((error) => {
              console.error(
                `Error starting stream for camera ${camera.id}:`,
                error
              );
            })
        );
        await Promise.all(postRequests);

        setCameraData(data);
        setVideoUrls(updatedUrls);
      } catch (error) {
        console.error("Error fetching or posting data:", error);
      }
    };

    fetchData();
    fetchDatas();
  }, []);

  // useEffect(() => {
  //   const fetchData2 = async () => {
  //     try {
  //       // Fetch camera data
  //       const response = await axios.get(`${API}/api/Camera/CMR`);
  //       const data = response.data;

  //       // Handle recording, person, and ANPR status
  //       const recordingRequests = data.map(async (camera) => {
  //         try {
  //           // Fetch alert status
  //           const responseStatus = await axios.get(
  //             `${API}/api/CameraAlertStatus/CameraAlert/${camera.id}`
  //           );
  //           const alertStatus = responseStatus.data;

  //           // Handle ANPR status
  //           if (alertStatus.anpr) {
  //             console.log("ANPR Started");
  //             try {
  //               await axios.get(
  //                 `${ANPRAPI}/start/?path=${camera.rtspurl}&id=${camera.id}`
  //               );
  //             } catch (anprError) {
  //               console.error(
  //                 `Error starting ANPR for camera ${camera.id}:`,
  //                 anprError
  //               );
  //             }
  //           } else {
  //             console.log("ANPR Stop");
  //             try {
  //               await axios.get(
  //                 `${ANPRAPI}/stop/?path=${camera.rtspurl}&id=${camera.id}`
  //               );
  //             } catch (anprError) {
  //               console.error(
  //                 `Error stopping ANPR for camera ${camera.id}:`,
  //                 anprError
  //               );
  //             }
  //           }

  //           // Handle recording status
  //           // if (alertStatus.recording) {
  //           //   console.log("Recording started");
  //           //   await axios.post(`${StreamAPI}/api/Video/start-loop-recording`, {
  //           //     id: camera.id,
  //           //     name: camera.name,
  //           //     rtspUrl: camera.rtspurl,
  //           //     duration: 900,
  //           //   });
  //           // } else {
  //           //   console.log("Recording Stopped");
  //           //   await axios.get(
  //           //     `${StreamAPI}/api/Video/stop-loop-recording?CameraId=${camera.id}`
  //           //   );
  //           // }

  //           // // Handle person status
  //           // if (alertStatus.personDetection) {
  //           //   console.log("Started Analytics");
  //           //   await axios.get(`${detection}/video_feed?camera_id=${camera.id}&path=${camera.rtspurl}`);
  //           // } else {
  //           //   console.log("Analytics Stopped");
  //           //   await axios.get(`${detection}/stop_feed?camera_id=${camera.id}&path=${camera.rtspurl}`);
  //           // }
  //         } catch (error) {
  //           console.error(`Error handling camera ${camera.id} status:`, error);
  //         }
  //       });

  //       await Promise.all(recordingRequests);
  //     } catch (error) {
  //       console.error("Error fetching or posting data:", error);
  //     }
  //   };

  //   fetchData2();
  // }, []);

 
  const handleSelect = (eventKey) => setGridSize(Number(eventKey));

  const renderGrid = () => {
    const rows = [];
    const cellHeight = 100 / gridSize; // Percentage height for each cell

    for (let i = 0; i < gridSize; i++) {
      const cols = [];
      for (let j = 0; j < gridSize; j++) {
        const videoIndex = i * gridSize + j;

        if (videoIndex < videoUrls.length) {
          const url = videoUrls[videoIndex];
          const camera = cameraData[videoIndex];
          const allcameradata = allcamera[videoIndex];

          cols.push(
            <Col
              key={j}
              className="p-0 m-0"
              style={{
                height: `${cellHeight}vh`,
                border: "1px solid #ccc", // Border style for each grid cell
                boxSizing: "border-box", // Ensure border is included in element's width/height
                padding: "0",
                margin: "0",
              }}
            >
              <VideoPlayer
                key={videoIndex}
                url={url}
                camera={camera}
                allcameradata={allcameradata}
                style={{ height: "100%" }}
              />
            </Col>
          );
        } else {
          cols.push(
            <Col
              key={j}
              className="p-0 m-0"
              style={{
                border: "1px solid #ccc", // Border style for empty cells
                boxSizing: "border-box", // Ensure border is included in element's width/height
                padding: "0",
                margin: "0",
              }}
            >
              <div
                className="p-0 m-0"
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "black",
                }}
              >
                <img
                  src={nocamera}
                  alt="not camera"
                  height="100%"
                  width="100%"
                />
              </div>
            </Col>
          );
        }
      }
      rows.push(
        <Row className="p-0 m-0" key={i}>
          {cols}
        </Row>
      );
    }
    return rows;
  };

  return (
    <Container className="bg-dark row" style={{ maxWidth: "100%" }}>
      <DropdownButton
        id="dropdown-basic-button"
        title={`Grid: ${gridSize}x${gridSize}`}
        onSelect={handleSelect}
        className="mb-3 col-1"
      >
        <Dropdown.Item eventKey="2">2x2</Dropdown.Item>
        <Dropdown.Item eventKey="3">3x3</Dropdown.Item>
        <Dropdown.Item eventKey="4">4x4</Dropdown.Item>
        <Dropdown.Item eventKey="5">5x5</Dropdown.Item>
        {/* <Dropdown.Item eventKey="6">6x6</Dropdown.Item>
        <Dropdown.Item eventKey="7">7x7</Dropdown.Item>
        <Dropdown.Item eventKey="8">8x8</Dropdown.Item> */}
      </DropdownButton>
      <DropdownButton
        id="dropdown-basic-button"
        title="Unit Type"
        className="mb-3 ms-3 col-1"
      >
        <Dropdown.Item >Distiller</Dropdown.Item>
        <Dropdown.Item >Warehouse</Dropdown.Item>
      </DropdownButton>
      <DropdownButton
        id="dropdown-basic-button"
        title="Unit Name"
        className="mb-3 ms-3 col-1"
      >
        <Dropdown.Item >Distiller</Dropdown.Item>
        <Dropdown.Item >Warehouse</Dropdown.Item>
      </DropdownButton>
      {renderGrid()}
    </Container>
  );
};

const VideoPlayer = ({ url, camera, style ,allcameradata}) => {


  

  const videoRef = useRef(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [showModal, setShowModal] = useState(false);

  const handleShow2 = () => setShowModal(true);
  const handleClose2 = () => setShowModal(false);

  // snapshot handle
  const handleSnapshot = (videoRef) => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/png"); // Convert to base64
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `snapshot-${Date.now()}.png`; // Download the snapshot
      link.click();
    }
  };
  //end

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  useEffect(() => { 
    const videoElement = videoRef.current;

    if (Hls.isSupported() && videoElement) {
      const hls = new Hls();

      hls.loadSource(url);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.muted = true;
      });

      return () => {
        hls.destroy();
      };
    } else if (videoElement) {
      videoElement.src = url;
      videoElement.muted = true;
      videoElement.play().catch((error) => {
        console.error("Error attempting to play:", error);
      });
    }
  }, [url]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "100%",
        height: "100%",
        marginBottom: "3px",
        ...style, // Apply dynamic height here
      }}
    >
      <video
        ref={videoRef}
        className="p-0 m-0 bg-dark "
        preload="auto"
        width="100%"
        height="100%"
        autoPlay
        onClick={handleFullScreen}
      />
      <div
        style={{
          color: "red",
          display: "inline",
          position: "absolute",
          bottom: "10px",
          left: "10px",
        }}
      >
        {camera.id}-{camera.name}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "skyblue",
            cursor: "pointer",
            fontSize: "20px",
            padding: "4px 7px",
            borderRadius: "5px",
          }}
        >
          {/* Replace the Open button with Analytics icon */}
          <Button className="bg-dark border-light" onClick={handleShow2}>
            <Analytics /> {/* This is the analytics icon */}
          </Button>
          {/* Render the Analytics List Modal */}
           {/* {console.log(allcameradata,"hghgfhgf")} */}
          <AnalyticsList show={showModal} handleClose={handleClose2} cameraIP={allcameradata.cameraIP} cameraId={camera.id} publicUrl={camera.rtspurl} />
        </div>

        <div
          style={{
            color: "skyblue",
            cursor: "pointer",
            fontSize: "20px",
            padding: "4px 7px",
            borderRadius: "5px",
          }}
        >
          <Button
            className="bg-dark border-light"
            onClick={() => handleSnapshot(videoRef)}
          >
            <CameraAlt /> {/* Camera icon */}
          </Button>
        </div>

        <div
          style={{
            color: "skyblue",
            cursor: "pointer",
            marginLeft: "10px",
            fontSize: "20px",
            border: "1px solid white",
            padding: "4px 7px",
            borderRadius: "5px",
          }}
        >
          <LocationOn onClick={handleShow} /> {/* Location icon */}
        </div>

        <div
          style={{
            color: "skyblue",
            cursor: "pointer",
            marginLeft: "10px",
            fontSize: "20px",
            border: "1px solid white",
            borderRadius: "5px",
          }}
        >
          <ObjectDetection cameraId={camera.id}cameraIP={allcameradata.cameraIP}publicUrl={camera.rtspurl}/>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Map Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${camera.latitude},${camera.longitude}&hl=es;z=12&output=embed`}
            title="Google Maps Location"
          ></iframe>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VideoGrid;

