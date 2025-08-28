import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from 'react-bootstrap';
import { Box, Typography } from '@mui/material';

const CameraStatusChart = () => {
  // Sample data
  const activeCameras = 70;    // Active cameras
  const inactiveCameras = 20;  // Inactive cameras
  const totalCameras = activeCameras + inactiveCameras;

  const chartOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Active', 'Inactive'],
    colors: ['#4caf50', '#f44336'],  // Green for active, Red for inactive
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} cameras`,  // Tooltip shows number of cameras
      },
    },
  };

  const chartSeries = [activeCameras, inactiveCameras]; // Series for active and inactive

  return (
    <Card className="shadow-sm rounded ms-4">
      <Card.Body>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Camera Status
          </Typography>
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            height={187}
          />
          <Typography variant="body2" color="textSecondary" className="mt-2">
            Total Cameras: {totalCameras}
          </Typography>
        </Box>
      </Card.Body>
    </Card>
  );
};

export default CameraStatusChart;
