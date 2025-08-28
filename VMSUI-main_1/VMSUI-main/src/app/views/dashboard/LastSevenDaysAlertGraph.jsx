import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card } from "react-bootstrap";
import { Box, Typography } from "@mui/material";

const LastSevenDaysAlertGraph = () => {
  const staticAlertData = [
    { date: "2025-04-07", count: 5 },
    { date: "2025-04-08", count: 8 },
    { date: "2025-04-09", count: 3 },
    { date: "2025-04-10", count: 7 },
    { date: "2025-04-11", count: 10 },
    { date: "2025-04-12", count: 4 },
    { date: "2025-04-13", count: 6 },
  ];

  const dates = staticAlertData.map((item) => item.date);
  const counts = staticAlertData.map((item) => item.count);

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 500,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: "30%",
      },
    },
    xaxis: {
      categories: dates,
      labels: {
        rotate: -45,
      },
    },
    yaxis: {
      title: {
        text: "Alerts",
      },
    },
    title: {
      align: "center",
      margin: 10,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
      },
    },
    colors: ["#4caf50"],
    tooltip: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "50%",
            },
          },
        },
      },
    ],
  });

  const [chartSeries, setChartSeries] = useState([
    {
      name: "Alerts",
      data: counts,
    },
  ]);

  return (
    <Card className="shadow-sm rounded" style={{ height: "100%", minHeight: "270px" }}>
      <Card.Body style={{ height: "100%" }}>
        <Box display="flex" flexDirection="column" alignItems="center" height="100%">
          <Typography variant="h6" gutterBottom>
            Last 7 Days (Alert)
          </Typography>
          <Box width="100%" height="100%">
            <ReactApexChart
              className="p-0 m-0"
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height="100%" // Let it grow inside the box
            />
          </Box>
        </Box>
      </Card.Body>
    </Card>
  );
};

export default LastSevenDaysAlertGraph;
