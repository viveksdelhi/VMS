import React from "react";
import { Box, Typography } from '@mui/material';
const UserLicense = () => {
    return (
        <Box
      sx={{
        padding: 2,
        marginY:3,
        marginX: 5, // Adds margin on the left and right sides
        border: '1px solid #334766', // Dark blue border color
        borderRadius: '3px',
        backgroundColor: '#2a3b5f', // Dark blue background color
        color: '#e0e0e0', // Light text color for contrast
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ color: '#ffffff' }} // White color for the heading
      >
      Ajeevi VMS License validity
      </Typography>
      <Typography variant="body1">
This is Ajeevi VMS Demo License Applicable for 30 days. The demo version is 
alowed to add 50 camera, 5 NVR, 5 ANPR cameras. This can also detect 50+ with total object counts of 5000. This demo version is complied with onvif and other camera standered. For any queries connect <a href="https://ajeevi.com/" target="blank" className="text-info">www.ajeevi.com </a>. 
      </Typography>
    </Box>
    );
  };
  
  export default UserLicense;