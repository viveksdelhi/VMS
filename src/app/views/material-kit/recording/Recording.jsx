import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { API, token, VideoAPI } from "serverConnection";
import moment from "moment";
import mediaImage from "../../../../assets/Image/ajimg/media.jpg"; // Import the image
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { number } from "prop-types";

const Recording = () => {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  //pagination ===========================
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPageNumber(1);
  };
  //==========================================
  //video modal
  // State for video modal
  const [videoModalShow, setVideoModalShow] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleCloseVideoModal = () => {
    setVideoModalShow(false);
    setVideoUrl("");
  };

  const handleShowVideoModal = (url) => {
    setVideoUrl(url);
    setVideoModalShow(true);
  };
  //

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get(`${API}/api/Camera/GetAll`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCameras(response.data);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras();
  }, []);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (selectedCamera) {
        try {
          const response = await axios.get(
            `${API}/api/CameraRecord/Pagination?pageNumber=${pageNumber}&pageSize=${pageSize}&cameraId=${selectedCamera.id}`,
          );
          setRecordings(response.data.cameraAlertStatuses);
          setTotalPages(Math.ceil(response.data.totalCount / pageSize));
        } catch (error) {
          console.error("Error fetching recordings:", error);
        }
      }
    };

    fetchRecordings();
  }, [selectedCamera, pageNumber, pageSize]);

  const navigate = useNavigate(); //
  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
    // navigate(`/recording/${camera.id}`);//
  };

  const handleBackClick = () => {
    setSelectedCamera(null);
    setFromDate("")
    setToDate("")
  };

  const handleDelete = async (recordingId) => {
    try {
      await axios.delete(`${API}/api/CameraRecord/${recordingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecordings(
        recordings.filter((recording) => recording.id !== recordingId)
      );
    } catch (error) {
      console.error("Error deleting recording:", error);
    }
  };

  // const handleDeleteAll = async () => {
  //   try {
  //     await axios.delete(`${API}/api/CameraRecord/Clear/${selectedCamera.id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setRecordings([]);
  //   } catch (error) {
  //     console.error("Error deleting all recordings:", error);
  //   }
  // };

  const handleDownload = (recording) => {
    const downloadUrl = `${VideoAPI}/${recording.recordPath}`;

    const newWindow = window.open(downloadUrl, "_blank");

    if (newWindow) {
      newWindow.onload = () => {
        const link = newWindow.document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", recording.recordPath.slice(41));
        newWindow.document.body.appendChild(link);
        link.click();
        newWindow.document.body.removeChild(link);
      };
    }
  };
  // search and date wise fiter
  const filteredRecordings = recordings.filter(recording => {
    const recordDate = new Date(recording.regDate);
    const searchQueryLower = searchQuery.toLowerCase();
    const fromDateValid = fromDate ? new Date(fromDate) : null;
    const toDateValid = toDate ? new Date(toDate) : null;

    const searchMatch = [
      recording.title?.toLowerCase().includes(searchQueryLower),
      recording.id?.toString().includes(searchQuery),
      recording.recordPath?.toLowerCase().includes(searchQueryLower)
    ].some(Boolean);

    const dateMatch =
      (!fromDateValid || recordDate >= fromDateValid) &&
      (!toDateValid || recordDate <= toDateValid);

    return searchMatch && dateMatch;
  });

  // Filtering cameras based on search query
  const filteredCameras = cameras.filter((camera) =>
    camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camera.id.toString().includes(searchQuery)
  );
  //************************************************** */



  return (
    <div>
      {selectedCamera ? (
        <>
          <div>
            <IconButton onClick={handleBackClick} sx={{ mb: 2 }}>
              <ArrowBackIcon />
            </IconButton>

            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
              <Box>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ mr: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                From Date
                <TextField
                  type="datetime-local"
                  variant="outlined"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  sx={{ mr: 2, ml: 1 }}
                />
                To Date
                <TextField
                  type="datetime-local"
                  variant="outlined"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  sx={{ mr: 2, ml: 1 }}
                />
              </Box>
              {/* <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAll}
              sx={{ alignSelf: "center" }}
            >
              Clear All
            </Button> */}
            </Box>

            <Grid container spacing={3} sx={{ justifyContent: "center" }}>
              {filteredRecordings.map((recording) => (
                <>
                  <Grid item xs={12} sm={6} md={4} key={recording.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                            {recording.title}
                          </Typography>
                          {/* <Box sx={{ position: 'relative' }}>
                        <a href={`${VideoAPI}/${recording.recordPath}`} >
                          <img 
                            width="200px" 
                            height="150px" 
                            src={mediaImage} 
                            alt="Media Thumbnail" 
                            onClick={handleShow}
                          />
                        </a>
                      </Box> */}
                          <Box sx={{ position: "relative" }}>
                            <img
                              width="200px"
                              height="150px"
                              src={mediaImage}
                              alt="Media Thumbnail"
                              onClick={() =>
                                handleShowVideoModal(
                                  `${VideoAPI}/${recording.recordPath}`
                                )
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {recording.recordPath.slice(4)}
                            <br />
                            {recording.regDate.slice(0, 10).replace(/-/g, "-")}

                            {` ${recording.regDate.slice(11, 16)}`}

                          </Typography>
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              justifyContent: "center",
                              gap: 2,
                            }}
                          >
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDelete(recording.id)}
                              sx={{ color: "red" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              aria-label="download"
                              onClick={() => handleDownload(recording)}
                              sx={{ color: "green" }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </>
              ))}
            </Grid>
          </div>
          <div className="container mt-4">
            <div className="d-flex justify-content-center align-items-center">
              <button
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={pageNumber === 1}
                className="btn btn-primary me-2"
              >
                Previous
              </button>

              <span className="mx-2">
                Page {pageNumber} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={pageNumber === totalPages}
                className="btn btn-primary ms-2"
              >
                Next
              </button>
              <div className="ms-3">
                <select
                  onChange={handlePageSizeChange}
                  value={pageSize}
                  className="form-select w-auto"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>


          </div>
        </>
      ) : (
        <div>
          {/* Search Input Field */}
          <TextField
            label="Search Cameras"
            variant="outlined"
            sx={{ mb: 3, width: '35%', borderRadius: '20%' }}  // Set 50% width and round border
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />


          {/* Camera Grid */}
          <Grid container spacing={3} sx={{ justifyContent: "center", mt: 3 }}>
            {filteredCameras.length > 0 ? (
              filteredCameras.map((camera) => (
                <Grid item xs={12} sm={6} md={4} key={camera.id}>
                  <Card
                    onClick={() => handleCameraClick(camera)}
                    sx={{ cursor: "pointer" }}
                  >
                    <CardContent>
                      <Box sx={{ textAlign: "center" }}>
                        <FolderIcon sx={{ fontSize: 60, color: "#EECD6D" }} />
                        <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                          {camera.id} - {camera.name}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" sx={{ mt: 3 }}>
                No cameras found
              </Typography>
            )}
          </Grid>
        </div>
      )}

      {/*  */}
      {/* Video Modal */}
      <Modal show={videoModalShow} onHide={handleCloseVideoModal} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Recording Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {videoUrl && (
            <video width="100%" height="auto" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVideoModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/*  */}
    </div>
  );
};

export default Recording;

// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
//   Grid,
//   Typography,
//   Box,
//   IconButton,
//   TextField,
//   InputAdornment,
//   Button, // Import Button
// } from "@mui/material";
// import FolderIcon from '@mui/icons-material/Folder';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import DeleteIcon from '@mui/icons-material/Delete';
// import DownloadIcon from '@mui/icons-material/Download';
// import SearchIcon from '@mui/icons-material/Search';
// import axios from 'axios';
// import { API, token, VideoAPI } from "serverConnection";
// import moment from 'moment';

// const Recording = () => {
//   const [cameras, setCameras] = useState([]);
//   const [selectedCamera, setSelectedCamera] = useState(null);
//   const [recordings, setRecordings] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');

//   useEffect(() => {
//     const fetchCameras = async () => {
//       try {
//         const response = await axios.get(`${API}/api/Camera/GetAll`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         });
//         setCameras(response.data);
//       } catch (error) {
//         console.error('Error fetching cameras:', error);
//       }
//     };

//     fetchCameras();
//   }, []);

//   useEffect(() => {
//     const fetchRecordings = async () => {
//       if (selectedCamera) {
//         try {
//           const response = await axios.get(`${API}/api/CameraRecord/Camera-List/${selectedCamera.id}`, {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           setRecordings(response.data);
//         } catch (error) {
//           console.error('Error fetching recordings:', error);
//         }
//       }
//     };

//     fetchRecordings();
//   }, [selectedCamera]);

//   const handleCameraClick = (camera) => {
//     setSelectedCamera(camera);
//   };

//   const handleBackClick = () => {
//     setSelectedCamera(null);
//   };

//   const handleDelete = async (recordingId) => {
//     try {
//       await axios.delete(`${API}/api/CameraRecord/${recordingId}`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       setRecordings(recordings.filter(recording => recording.id !== recordingId));
//     } catch (error) {
//       console.error('Error deleting recording:', error);
//     }
//   };

//   const handleDeleteAll = async () => {
//     try {
//       await axios.delete(`${API}/api/CameraRecord/Clear/${selectedCamera.id}`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       setRecordings([]);
//     } catch (error) {
//       console.error('Error deleting all recordings:', error);
//     }
//   };

//   const handleDownload = (recording) => {
//     const downloadUrl = `${VideoAPI}/${recording.recordPath}`;

//     const newWindow = window.open(downloadUrl, '_blank');

//     if (newWindow) {
//       newWindow.onload = () => {
//         const link = newWindow.document.createElement('a');
//         link.href = downloadUrl;
//         link.setAttribute('download', recording.recordPath.slice(41));
//         newWindow.document.body.appendChild(link);
//         link.click();
//         newWindow.document.body.removeChild(link);
//       };
//     }
//   };

//   const filteredRecordings = recordings.filter(recording => {
//     const recordDate = moment(recording.date);

//     const searchMatch =
//       (recording.title && recording.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       (recording.id && recording.id.toString().includes(searchQuery)) ||
//       (recording.recordPath && recording.recordPath.toLowerCase().includes(searchQuery.toLowerCase()));

//     const dateMatch =
//       (!fromDate || recordDate.isAfter(moment(fromDate))) &&
//       (!toDate || recordDate.isBefore(moment(toDate).endOf('day')));

//     return searchMatch && dateMatch;
//   });

//   return (
//     <div>
//       {selectedCamera ? (
//         <div>
//           <IconButton onClick={handleBackClick} sx={{ mb: 2 }}>
//             <ArrowBackIcon />
//           </IconButton>

//           <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
//             <Box>
//               <TextField
//                 label="Search"
//                 variant="outlined"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 sx={{ mr: 2 }}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               From Date
//               <TextField
//                 type="date"
//                 variant="outlined"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 sx={{ mr: 2, ml: 1 }}
//               />
//               To Date
//               <TextField
//                 type="date"
//                 variant="outlined"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//                 sx={{ mr: 2, ml: 1 }}
//               />
//             </Box>
//             <Button
//               variant="contained"
//               color="error"
//               onClick={handleDeleteAll}
//               sx={{ alignSelf: 'center' }}
//             >
//               Clear All
//             </Button>
//           </Box>

//           <Grid container spacing={3} sx={{ justifyContent: "center" }}>
//             {filteredRecordings.map((recording) => (
//               <Grid item xs={12} sm={6} md={4} key={recording.id}>
//                 <Card>
//                   <CardContent>
//                     <Box sx={{ textAlign: "center" }}>
//                       <Typography variant="h6" component="div" sx={{ mb: 1 }}>
//                         {recording.title}
//                       </Typography>
//                       <Box sx={{ position: 'relative' }}>
//                         <video width="200px" height="150px" controls>
//                           <source src={`${VideoAPI}/${recording.recordPath}`}
//                           type="video/mp4" />
//                         </video>
//                       </Box>
//                       <Typography variant="body2" sx={{ mt: 1 }}>
//                         {recording.recordPath.slice(4)}
//                       </Typography>
//                       <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
//                         <IconButton
//                           aria-label="delete"
//                           onClick={() => handleDelete(recording.id)}
//                           sx={{ color: 'red' }}
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                         <IconButton
//                           aria-label="download"
//                           onClick={() => handleDownload(recording)}
//                           sx={{ color: 'green' }}
//                         >
//                           <DownloadIcon />
//                         </IconButton>
//                       </Box>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </div>
//       ) : (
//         <Grid container spacing={3} sx={{ justifyContent: "center", mt: 3 }}>
//           {cameras.map((camera) => (
//             <Grid item xs={12} sm={6} md={4} key={camera.id}>
//               <Card onClick={() => handleCameraClick(camera)} sx={{ cursor: 'pointer' }}>
//                 <CardContent>
//                   <Box sx={{ textAlign: "center" }}>
//                     <FolderIcon sx={{ fontSize: 60, color: "#EECD6D" }} />
//                     <Typography variant="h6" component="div" sx={{ mt: 1 }}>
//                       {camera.id}-{camera.name}
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </div>
//   );
// };

// export default Recording;
