import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const markers = [
  { id: 1, position: [28.6139, 77.209], label: 'New Delhi' },
  { id: 2, position: [19.076, 72.8777], label: 'Mumbai' },
  { id: 3, position: [13.0827, 80.2707], label: 'Chennai' },
  { id: 4, position: [22.5726, 88.3639], label: 'Kolkata' },
  { id: 5, position: [12.9716, 77.5946], label: 'Bangalore' },
];

const MapComponent = () => {
  return (
    <div className="w-full h-[500px] rounded overflow-hidden shadow">
      <MapContainer
        center={[22.9734, 78.6569]} // Center of India
        zoom={5}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map(marker => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>{marker.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
