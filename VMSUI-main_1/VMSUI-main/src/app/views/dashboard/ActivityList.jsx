import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Typography } from "@mui/material";

const alertTypeIcons = {
  person: "👤",
  chair: "🪑",
  phone: "📱",
  table: "🪑🖥️",
  car: "🚗",
};

// Sample static data
const staticActivities = [
  { alert_type: "person", pilot: "Gate 1", date: "2025-04-14", start_time: "10:00:00" },
  { alert_type: "car", pilot: "Entrance", date: "2025-04-14", start_time: "10:05:00" },
  { alert_type: "phone", pilot: "Lobby", date: "2025-04-14", start_time: "10:10:00" },
  { alert_type: "table", pilot: "Office", date: "2025-04-14", start_time: "10:15:00" },
  { alert_type: "chair", pilot: "Backyard", date: "2025-04-14", start_time: "10:20:00" },
  { alert_type: "person", pilot: "Exit", date: "2025-04-14", start_time: "10:25:00" },
  { alert_type: "car", pilot: "Main Gate", date: "2025-04-14", start_time: "10:30:00" },
];

const ActivityList = () => {
  return (
    <Card className="shadow-sm border rounded  me-4" style={{ height: "287px" }}>
      <Card.Body className="d-flex flex-column p-1" style={{ height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Recent Activities
        </Typography>

        <div
          style={{
            overflowY: "auto",
            flexGrow: 1,
            // Hides the scrollbar when there's overflow
            scrollbarWidth: "none", /* For Firefox */
            msOverflowStyle: "none", /* For Internet Explorer */
          }}
        >
          <ListGroup style={{ border: "none" }}>
            {staticActivities.map((activity, index) => (
              <ListGroupItem
                key={index}
                className="d-flex align-items-center gap-1"
                style={{
                  backgroundColor: "#fff", // Light background
                  color: "#333", // Dark text for readability
                  marginBottom: "3px",
                  border: "none", // Removed border
                  borderRadius: "8px",
                }}
              >
                <span>{alertTypeIcons[activity.alert_type] || "⚠️"}</span>
                <Typography variant="body2">
                  {activity.alert_type} at {activity.pilot} | {activity.date} {activity.start_time}
                </Typography>
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ActivityList;
