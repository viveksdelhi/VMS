import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import {
  token,
  API,
  detection,
  ANPRAPI,
  CREDIT_ID,
  userId,
} from "serverConnection";

// Mapping for display names
const displayNames = {
  recording: "Recording",
  snapshot: "Snapshot",
  anpr: "ANPR",
  personDetection: "Analytics",
  bikeDetection: "Bike",
  animalDetection: "Animal",
  fireDetection: "Fire",
  smokeDetection: "Smoke",
  umbrellaDetection: "Umbrella",
  briefcaseDetection: "Briefcase",
  maskDetection: "Mask",
  garbageDetection: "Garbage",
  weaponDetection: "Weapon",
  wrongDetection: "Wrong Direction",
  queueDetection: "Queue",
};

// Define which detection types you want to show
const visibleKeys = [
  "recording",
  "anpr",
  "personDetection",
];

export const ObjectDetection = ({
  cameraId,
  cameraIP,
  publicUrl,
  cameraName,
}) => {
  const [open, setOpen] = useState(false);
  const [objectData, setObjectData] = useState([]);
  const [selectedDetections, setSelectedDetections] = useState({});

  useEffect(() => {
    // Fetch data from API when the component mounts or cameraId changes
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/api/CameraAlertStatus/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.results;
        // Filter data based on the cameraId
        const selectedCamera = data.find((item) => item.cameraId === cameraId);
        
        if (selectedCamera) {
          setSelectedDetections(selectedCamera); // Set the state to the specific camera data
        }

        // Get object list (for example, for camera objects or object tracking)
        const response2 = await axios.get(
          `${API}/api/CameraIPList/?cameraIP=${cameraIP}`
        );
        setObjectData(response2.data);
      } catch (error) {
        console.error("Error fetching detection settings:", error);
      }
    };

    fetchData();
  }, [cameraId, cameraIP]);

  const handleIconClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedDetections((prevState) => ({
      ...prevState,
      [name]: checked ? 1 : 0, // 1 for checked, 0 for unchecked
    }));
  };

  const postData = {
    objectlist: objectData.objectList,
    camera_id: cameraId,
    url: publicUrl,
    camera_ip: cameraIP,
    user_id: userId,
    credit_id: CREDIT_ID,
    running: String(selectedDetections.personDetection),
  };

  const postData2 = {
    cameraId: cameraId,
    rtspUrl: publicUrl,
    objectList: objectData.objectList,
    cameraIP: cameraIP,
    status: selectedDetections.personDetection,
    userid: userId,
  };

  const postData3 = {
    camera_id: cameraId,
    url: publicUrl,
    running: String(selectedDetections.anpr),
    user_id: userId,
    credit_id: CREDIT_ID,
  };

  const postData4 = {
    cameraId: cameraId,
    cameraName: cameraName,
    url: publicUrl,
    status: selectedDetections.anpr,
    userid: userId,
  };

  const handleSave = async () => {
    const payload = {
      id: selectedDetections.id,
      recording: selectedDetections.recording || 0, // Default to 0 if not present
      anpr: selectedDetections.anpr || 0,
      snapshot: selectedDetections.snapshot || 0,
      personDetection: selectedDetections.personDetection || 0,
      fireDetection: selectedDetections.fireDetection || 0,
      animalDetection: selectedDetections.animalDetection || 0,
      bikeDetection: selectedDetections.bikeDetection || 0,
      maskDetection: selectedDetections.maskDetection || 0,
      umbrelaDetection: selectedDetections.umbrellaDetection || 0,
      brifecaseDetection: selectedDetections.briefcaseDetection || 0,
      garbageDetection: selectedDetections.garbageDetection || 0,
      weaponDetection: selectedDetections.weaponDetection || 0,
      wrongDetection: selectedDetections.wrongDetection || 0,
      queueDetection: selectedDetections.queueDetection || 0,
      smokeDetection: selectedDetections.smokeDetection || 0,
      status: selectedDetections.status || 0,
      cameraId: cameraId,
      userid: userId,
    };

    try {
      const response = await axios.put(
        `${API}/api/CameraAlertStatus/${selectedDetections.id}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOpen(false); // Close the dialog on success
      // Send other related API requests
      await axios.post(`${detection}/CameraDetails`, { cameras: [postData] });
      await axios.post(`${API}/api/VideoAnalytic/`, postData2);
      await axios.post(`${ANPRAPI}/anprStartByQueue`, { cameras: [postData3] });
      await axios.post(`${API}/api/ANPRStatus/`, postData4);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <Box>
      <IconButton
        aria-label="detection"
        color="primary"
        onClick={handleIconClick}
      >
        <VisibilityIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Tracking Object</DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
          <FormGroup>
            {visibleKeys.map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={selectedDetections[key] === 1} // Check if the detection is enabled (1)
                    onChange={handleCheckboxChange}
                    name={key}
                    disabled={key === "recording"} // Disable the checkbox if it's 'recording'
                  />
                }
                label={displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControlLabel,
//   Checkbox,
//   FormGroup,
// } from '@mui/material';
// import VisibilityIcon from '@mui/icons-material/Visibility';

// export const ObjectDetection = () => {
//   const [open, setOpen] = useState(false);
//   const [selectedDetections, setSelectedDetections] = useState({
//     recording: false,
//     snapshot: false,
//     anpr: false,
//     person: false,
//     bike: false,
//     animal: false,
//     fire: false,
//     smoke: false,
//     umbrella: false,
//     briefcase: false,
//     mask: false,
//     garbage: false,
//     weapon: false,
//     wrongdirection: false,
//     queue: false,
//   });

//   const handleIconClick = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleCheckboxChange = (event) => {
//     setSelectedDetections(prevState => ({
//       ...prevState,
//       [event.target.name]: event.target.checked,
//     }));
//   };

//   const handleSave = async () => {
//     console.log('Selected Detections:', selectedDetections);
//     setOpen(false);
//   };

//   return (
//     <Box>
//       <IconButton
//         aria-label="detection"
//         color="primary"
//         onClick={handleIconClick}
//       >
//         <VisibilityIcon />
//       </IconButton>

//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Tracking Object</DialogTitle>
//         <DialogContent sx={{ width: '400px' }}>
//           <FormGroup>
//             {Object.keys(selectedDetections).map((key) => (
//               <FormControlLabel
//                 key={key}
//                 control={
//                   <Checkbox
//                     checked={selectedDetections[key]}
//                     onChange={handleCheckboxChange}
//                     name={key}
//                   />
//                 }
//                 label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
//               />
//             ))}
//           </FormGroup>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button onClick={handleSave} color="primary">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };
