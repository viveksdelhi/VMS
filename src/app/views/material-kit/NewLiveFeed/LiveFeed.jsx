import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Modal,
  Button,
  Spinner,
} from "react-bootstrap";
import AnalyticsList from "../object/AnalyticsList";
import Hls from "hls.js";
import axios from "axios";
import { API, LiveFeedUrl, StreamAPI } from "serverConnection";
import { ObjectDetection } from "../object/ObjectDetection";
import { Analytics, CameraAlt, LocationOn } from "@mui/icons-material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import nocamera from "../../../../assets/Image/ajimg/notcamera.png";
import styled from "styled-components";

const VideoGrid = () => {
  const [gridSize, setGridSize] = useState(2);
  const [videoUrls, setVideoUrls] = useState([]);
  const [cameraData, setCameraData] = useState([]);
  const [allcamera, setAllcamera] = useState([]);
  const [cellHeight, setCellHeight] = useState(82 / gridSize); // Initialize cellHeight with useState

  const divRef = useRef(null);

  const fetchDatas = async () => {
    try {
      console.log("Fetching all camera data...");
      const response = await axios.get(`${API}/api/Camera/GetAll`);
      const cameras = response.data;
      setAllcamera(cameras);
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
          (camera) => `${LiveFeedUrl}/${camera.name}/stream.m3u8`
        );

        // Start streaming for each camera
        const postRequests = data.map((camera) =>
          axios
            .post(`${StreamAPI}/api/Video/start-stream-new`, {
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

  useEffect(() => {
    // Update cell height whenever gridSize changes
    setCellHeight(82 / gridSize);
  }, [gridSize]);

  const handleSelect = (eventKey) => setGridSize(Number(eventKey));

  // Function to render the video grid
  const renderGrid = () => {
    const rows = [];
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
                height: `${cellHeight}vh`, // Dynamic cell height based on state
                border: "1px solid #ccc",
                boxSizing: "border-box",
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
                <VideoPlayer
                  key={videoIndex}
                  url={url}
                  camera={camera}
                  allcameradata={allcameradata}
                />
              </div>
            </Col>
          );
        } else {
          cols.push(
            <Col
              key={j}
              className="p-0 m-0"
              style={{
                height: `${cellHeight}vh`,
                border: "1px solid #ccc",
                boxSizing: "border-box",
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
                  alt="no camera"
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

  // Function to trigger full screen mode and update cell height
  const openFullScreen = () => {
    setCellHeight(100 / gridSize); // Update cell height to full screen mode

    if (divRef.current.requestFullscreen) {
      divRef.current.requestFullscreen();
    } else if (divRef.current.mozRequestFullScreen) {
      // Firefox
      divRef.current.mozRequestFullScreen();
    } else if (divRef.current.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      divRef.current.webkitRequestFullscreen();
    } else if (divRef.current.msRequestFullscreen) {
      // IE/Edge
      divRef.current.msRequestFullscreen();
    }
  };

  const Container = styled.div`
    background-color: #343a40; /* Bootstrap dark color */
    position: relative;
    max-width: 100%;
  `;

  const InnerContainer = styled.div`
    background-color: #343235; /* Bootstrap warning color */
  `;

  const FullscreenButton = styled.button`
    position: absolute;
    top: 12px;
    right: 15px;
    z-index: 1000;
    background-color: white;
    border: none;
    cursor: pointer;
    border-radius: 10px;
  `;

  const StyledDropdownMenu = styled(Dropdown.Menu)`
    background-color: white; /* Change this to your desired background color */
    border: 1px solid ##4a628a; /* Optional: customize border */

    /* Optional: change text color */
    color: #4a628a;

    /* Optional: hover effect */
    & .dropdown-item:hover {
      background-color: #4A626 A; /* Change hover color */
    }
  `;
  return (
    <Container>
      <InnerContainer className="container-fluid">
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle
            id="dropdown-basic-button"
            className="mt-2 mb-2 col-1 p-1"
            style={{ backgroundColor: "white", color: "black", border: "none" }}
          >
            {`Grid: ${gridSize}x${gridSize}`}
          </Dropdown.Toggle>
          <StyledDropdownMenu>
            <Dropdown.Item eventKey="2">2x2</Dropdown.Item>
            <Dropdown.Item eventKey="3">3x3</Dropdown.Item>
            <Dropdown.Item eventKey="4">4x4</Dropdown.Item>
          </StyledDropdownMenu>
        </Dropdown>
        <FullscreenButton
          onClick={openFullScreen}
          aria-label="Open Fullscreen"
          title="Full Screen"
        >
          <FullscreenIcon style={{ fontSize: "28px" }} />
        </FullscreenButton>
      </InnerContainer>

      <div ref={divRef}>{renderGrid()}</div>
    </Container>
  );
};

const VideoPlayer = ({ url, camera, style, allcameradata }) => {
  const videoRef = useRef(null);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [videoStatus, setVideoStatus] = useState("loading"); // Track video status ("loading", "valid", "error")

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShow2 = () => setShowModal(true);
  const handleClose2 = () => setShowModal(false);

  // Snapshot handle with shutter effect
  const handleSnapshot = (videoRef) => {
    // Get the video element
    if (videoRef.current) {
      const video = videoRef.current;

      // Create a shutter overlay element
      const shutter = document.createElement("div");
      shutter.style.position = "absolute";
      shutter.style.top = 0;
      shutter.style.left = 0;
      shutter.style.width = "100%";
      shutter.style.height = "100%";
      shutter.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black
      shutter.style.zIndex = 10; // Ensure it's above the video
      shutter.style.transition = "opacity 0.2s"; // Smooth fade-out effect
      shutter.style.opacity = 0;

      // Append the shutter overlay to the body (or the container of the video)
      document.body.appendChild(shutter);

      // Trigger the shutter effect by fading in and out quickly
      setTimeout(() => {
        shutter.style.opacity = 1; // Show the shutter
      }, 10);

      // After a short delay, hide the shutter and capture the snapshot
      setTimeout(() => {
        shutter.style.opacity = 0; // Hide the shutter
        // Wait until the shutter is fully hidden before capturing the snapshot
        setTimeout(() => {
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

          // Clean up by removing the shutter overlay
          document.body.removeChild(shutter);
        }, 200); // Wait a bit for the shutter to disappear before capturing the image
      }, 500); // Delay for shutter effect duration
    }
  };

  // Fullscreen handle
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

  //add loader
  useEffect(() => {
    const validateUrl = async () => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        setVideoStatus(response.status === 200 ? "valid" : "error");
      } catch (error) {
        console.error("Error checking URL status:", error);
        setVideoStatus("error");
      }
    };

    validateUrl();
  }, [url]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoStatus === "valid" && videoElement) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.muted = true;
        });
        return () => {
          hls.destroy();
        };
      } else {
        videoElement.src = url;
        videoElement.muted = true;
        videoElement.play().catch((error) => {
          console.error("Error attempting to play:", error);
        });
      }
    }
  }, [url, videoStatus]);

  return (
    <div
      className="hover-container"
      style={{
        position: "relative",
        display: "inline-block",
        width: "100%",
        height: "100%",
        marginBottom: "3px",
        ...style,
      }}
    >
      {/* Loader while the video is loading */}
      {videoStatus === "loading" && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "20px",
            zIndex: 10,
          }}
        >
          <Spinner animation="border" variant="light" />
        </div>
      )}

      {/* Video Element */}
      {videoStatus === "valid" && (
        <video
          ref={videoRef}
          className="p-0 m-0 bg-dark"
          preload="auto"
          width="100%"
          height="100%"
          autoPlay
          onClick={handleFullScreen}
        />
      )}

      {/* Error Message if URL is invalid */}
      {videoStatus === "error" && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "20px",
            zIndex: 10,
          }}
        >
          <Spinner animation="border" variant="light" />
        </div>
      )}

      {/* Camera ID and Name */}
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

      <style>
        {`
          .hover-container {
            position: relative;
          }
          .hover-visible {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
          }
          .hover-container:hover .hover-visible {
            opacity: 1;
          }
        `}
      </style>
      {videoStatus === "valid" && (
        <>
          <div
            style={{
              position: "absolute",
              top: "2px",
              right: "10px",
              display: "flex",
            }}
          >
            <div className=" text-light">REC</div>
            <Spinner
              animation="grow"
              variant="danger"
              role="status"
              style={{
                width: "10px",
                height: "10px",
                margin: "5px 0px 0px 5px",
              }} // Set the width and height here
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
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
              className="hover-visible"
              style={{
                color: "skyblue",
                cursor: "pointer",
                fontSize: "20px",
                padding: "4px 7px",
                borderRadius: "5px",
              }}
            >
              <Button className="bg-dark border-light" onClick={handleShow2}>
                <Analytics />
              </Button>
              <AnalyticsList
                show={showModal}
                handleClose={handleClose2}
                cameraIP={allcameradata.cameraIP}
                cameraId={camera.id}
                publicUrl={camera.rtspurl}
              />
            </div>

            <div
              className="hover-visible"
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
                <CameraAlt />
              </Button>
            </div>

            <div
              className="hover-visible"
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
              <LocationOn onClick={handleShow} />
            </div>

            <div
              className="hover-visible"
              style={{
                color: "skyblue",
                cursor: "pointer",
                marginLeft: "10px",
                fontSize: "20px",
                border: "1px solid white",
                borderRadius: "5px",
              }}
            >
              <ObjectDetection
                cameraId={camera.id}
                cameraIP={allcameradata.cameraIP}
                publicUrl={camera.rtspurl}
                cameraName={camera.name}
              />
            </div>
          </div>
        </>
      )}

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Map Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            width="100%"
            height="450"
            style={{ border: "0" }}
            loading="lazy"
            allowFullScreen
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
              camera.longitude - 0.01
            },${camera.latitude - 0.01},${camera.longitude + 0.01},${
              camera.latitude + 0.01
            }&layer=mapnik&marker=${camera.latitude},${camera.longitude}`}
            title="OpenStreetMap Location with Marker"
          />
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
