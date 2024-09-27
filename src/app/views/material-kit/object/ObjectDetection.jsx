import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { token,API } from 'serverConnection';

// Mapping for display names
const displayNames = {
  recording: 'Recording',
  snapshot: 'Snapshot',
  anpr: 'ANPR',
  personDetection: 'Analytics',
  bikeDetection: 'Bike',
  animalDetection: 'Animal',
  fireDetection: 'Fire',
  smokeDetection: 'Smoke',
  umbrellaDetection: 'Umbrella',
  briefcaseDetection: 'Briefcase',
  maskDetection: 'Mask',
  garbageDetection: 'Garbage',
  weaponDetection: 'Weapon',
  wrongDetection: 'Wrong Direction',
  queueDetection: 'Queue',
};

// Define which detection types you want to show
const visibleKeys = [
  'recording',
  // 'snapshot',
  'anpr',
  'personDetection',
  // 'bikeDetection',
  // 'fireDetection',
  // 'smokeDetection',
  // 'animalDetection',
  // 'umbrellaDetection',
  // 'briefcaseDetection',
  // 'maskDetection',
  // 'garbageDetection',
  // 'weaponDetection',
  // 'wrongDetection',
  // 'queueDetection',
];

export const ObjectDetection = ({ cameraId, id }) => {
  const [open, setOpen] = useState(false);
  const [selectedDetections, setSelectedDetections] = useState({
    recording: false,
    snapshot: false,
    anpr: false,
    personDetection: false,
    bikeDetection: false,
    animalDetection: false,
    fireDetection: false,
    smokeDetection: false,
    umbrellaDetection: false,
    briefcaseDetection: false,
    maskDetection: false,
    garbageDetection: false,
    weaponDetection: false,
    wrongDetection: false,
    queueDetection: false,
  });

  useEffect(() => {
    // Fetch data from API when the component mounts or cameraId changes
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/api/CameraAlertStatus/CameraAlert/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setSelectedDetections(data);
        // console.log(data, "ihjabdhbahdbsdadadqadqdq")

      } catch (error) {
        console.error('Error fetching detection settings:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleIconClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCheckboxChange = (event) => {
    setSelectedDetections(prevState => ({
      ...prevState,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleSave = async () => {
    const payload = {
      id,
      cameraId,
      ...selectedDetections,
    };

    console.log('Camera ID:', cameraId);
    console.log('Payload:', payload);

    try {
      await axios.put(`${API}/api/CameraAlertStatus`, payload, {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setOpen(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      // Consider adding user feedback here
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
        <DialogContent sx={{ width: '400px' }}>
          <FormGroup>
            {visibleKeys.map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={selectedDetections[key]}
                    onChange={handleCheckboxChange}
                    name={key}
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
