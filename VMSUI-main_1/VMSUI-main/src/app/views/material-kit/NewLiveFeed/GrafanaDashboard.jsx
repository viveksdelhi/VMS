// GrafanaDashboard.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const GrafanaDashboard = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Grafana Dashboard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <iframe
          src="https://your-grafana-url/d/your-dashboard-id?orgId=1&kiosk"
          width="100%"
          height="600px"
          frameBorder="0"
          title="Grafana Dashboard"
        ></iframe>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GrafanaDashboard;
