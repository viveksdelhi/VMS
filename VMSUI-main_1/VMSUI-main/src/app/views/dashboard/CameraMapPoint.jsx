import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import './CameraMapPoint.css';
import { API, token, userId } from "serverConnection";

import { Card } from 'react-bootstrap'; // Import Card

// Set default icon
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function CameraMapPoint() {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    const fetchCamerasData = async () => {
      try {
        const response = await axios.get(`${API}/api/Camera/?user_id=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCameras(response.data.results);
      } catch (error) {
        console.error('Error fetching camera data:', error);
      }
    };

    fetchCamerasData();
  }, []);

  return (
    <Card className="shadow-sm rounded mt-4 mx-4">
      <Card.Body>
        <Card.Title className="mb-3">Camera Location Map</Card.Title>
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer center={[28.5355, 77.3910]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {cameras.map((camera) => {
              if (camera.latitude && camera.longitude) {
                return (
                  <Marker
                    key={camera.id}
                    position={[parseFloat(camera.latitude), parseFloat(camera.longitude)]}
                  >
                    <Popup className="custom-popup">
                      <div className="popup-card">
                        <p className="wrap-text"><strong>Camera:</strong> {camera.name}</p>
                        <p><strong>Area:</strong> {camera.area}</p>
                        <p><strong>Location:</strong> {camera.location}</p>
                        <p><strong>Status:</strong> {camera.status === 0 ? 'Active' : 'Inactive'}</p>
                        <p><strong>Last Live:</strong> {new Date(camera.lastLive).toLocaleString()}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>
      </Card.Body>
    </Card>
  );
}
