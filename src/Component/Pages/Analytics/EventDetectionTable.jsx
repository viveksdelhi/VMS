import React, { useState } from 'react';
import AnalyticsTable from './AnalyticsData';

const CAMERA_LIST = [
  { id: 1, name: 'Camera 1' },
  { id: 2, name: 'Camera 2' },
  { id: 3, name: 'Camera 3' },
];

const EVENT_OPTIONS_MAP = {
  'tripwire': ['Person', 'Bicycle', 'Car', 'Dog'],
  'trespass': ['Person', 'Animal', 'Bag'],
  'camera-tampering': ['Camera Covered', 'Camera Moved'],
  'loitering-detection': ['Person', 'Group', 'Unknown Object'],
  'tailgating-detection': ['Person', 'Vehicle'],
  'left-object-detection': ['Bag', 'Box', 'Suitcase', 'Laptop'],
  'missing-object-detection': ['Laptop', 'Chair', 'TV', 'Artwork'],
  'continuous-auto-ptz-tracking': ['Person', 'Car'],
  'ptz-handoff': ['Person'],
  'ptz-preset-position-analytics': ['Vehicle', 'Bicycle', 'Bus'],
  'crowding-detection': ['Person', 'Group', 'Children'],
  'crowd-counting': ['Person', 'Children', 'Adult'],
  'crowd-flow-detection': ['Person', 'Bicycle', 'Group'],
  'video-smoke-detection': ['Smoke', 'Fire', 'Steam'],
  'video-fire-detection': ['Fire', 'Flame', 'Smoke'],
  'slip-fall-detection': ['Person'],
};

const EVENT_LABELS = {
  'tripwire': 'Tripwire',
  'trespass': 'Trespass',
  'camera-tampering': 'Camera Tampering',
  'loitering-detection': 'Loitering Detection',
  'tailgating-detection': 'Tailgating Detection',
  'left-object-detection': 'Left Object Detection',
  'missing-object-detection': 'Missing Object Detection',
  'continuous-auto-ptz-tracking': 'Continuous Auto PTZ Tracking',
  'ptz-handoff': 'PTZ Handoff',
  'ptz-preset-position-analytics': 'PTZ Pre-set Position Analytics',
  'crowding-detection': 'Crowding Detection',
  'crowd-counting': 'Crowd Counting',
  'crowd-flow-detection': 'Crowd Flow Detection',
  'video-smoke-detection': 'Video Smoke Detection',
  'video-fire-detection': 'Video Fire Detection',
  'slip-fall-detection': 'Slip & Fall Detection',
};

const getEventOptions = (eventType) => {
  return EVENT_OPTIONS_MAP[eventType] || ['Person', 'Vehicle', 'Bag'];
};

const EventReportPage = ({ eventType }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  // Add a state for custom event popup
  const [activeCamera, setActiveCamera] = useState(CAMERA_LIST[0].id); // First camera active by default
  // { cameraId: [arr] }
  const [cameraSelections, setCameraSelections] = useState({});
  const [payloadList, setPayloadList] = useState([]);

  const eventOptions = getEventOptions(eventType);
  const eventLabel = EVENT_LABELS[eventType] || (eventType.charAt(0).toUpperCase() + eventType.slice(1).replace(/-/g, ' '));

  // Click to focus a camera
  const handleCameraFocus = (camId) => {
    setActiveCamera(camId);
  };

  // Edit ONLY the active camera's event array
  const handleCheckbox = (event) => {
    setCameraSelections(prev => {
      const prevArr = prev[activeCamera] || [];
      const updatedArr = prevArr.includes(event)
        ? prevArr.filter(e => e !== event)
        : [...prevArr, event];
      return { ...prev, [activeCamera]: updatedArr };
    });
  };

  // SUBMIT: Only cameras with nonempty arrays in payload
  const handleSubmit = () => {
    const payload = Object.entries(cameraSelections)
      .filter(([_, arr]) => arr.length)
      .map(([id, arr]) => ({ cameraId: Number(id), eventselect: arr }));
    setPayloadList(payload);
    setPopupOpen(false);
  };

  const livePayload = Object.entries(cameraSelections)
    .filter(([_, arr]) => arr.length)
    .map(([id, arr]) => ({ cameraId: Number(id), eventselect: arr }));

  // The events for camera in focus
  const selectedEvents = cameraSelections[activeCamera] || [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#9357c9]">
          {eventLabel} Events
        </h2>
        {/* <button onClick={() => setPopupOpen(true)} style={{ background: '#9864db', color: 'white', borderRadius: 6, border: 'none', padding: '8px 20px', fontWeight: 500 }}>
          + Create Event Report
        </button> */}
      </div>
      <AnalyticsTable />
      <div style={{marginTop:18, marginBottom:6}}>
        <h5 className="text-[15px] font-medium mb-2 text-[#b17ef3]">Payload preview (all cameras with any selections)</h5>
        <pre className="bg-[#f4f3fa] text-sm rounded px-4 py-3 border border-[#ece5fa] text-[#402d57]">
          {JSON.stringify(livePayload, null, 2)}
        </pre>
      </div>
      <div style={{marginTop:12}}>
        <h5 className="text-[15px] font-medium mb-2 text-[#9465db]">Submitted payloads</h5>
        <pre className="bg-[#f4f3fa] text-sm rounded px-4 py-3 border border-[#e1defa] text-[#402d57]">
          {JSON.stringify(payloadList, null, 2)}
        </pre>
      </div>
      {popupOpen && (
        <div style={{ position: 'fixed', left: 65, top: 0, width: 'calc(100vw - 65px)', height: '100vh', zIndex: 99999, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', minWidth: 800, minHeight: 440, width: '64vw', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #9164d966', overflow: 'hidden' }}>
            {/* Camera list */}
            <div style={{ width: 240, background: '#f5f2fa', borderRight: '1px solid #eee', padding: 24 }}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>Cameras</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {CAMERA_LIST.map(cam => (
                  <li key={cam.id} style={{marginBottom:2}}>
                    <button type="button" onClick={() => handleCameraFocus(cam.id)} style={{ padding: 10, width: '100%', borderRadius: 7, background: activeCamera === cam.id ? '#e4d6fa' : '#faf6ff', border: 'none', cursor: 'pointer', color: '#3d2672', fontWeight: activeCamera === cam.id ? '700' : '500', textAlign:'left' }}>{cam.name}</button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Event checkboxes per camera */}
            <div style={{ flex: 1, padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 10 }}>
                  {activeCamera ? `Select Events/Objects for ${CAMERA_LIST.find(c => c.id === activeCamera)?.name}` : 'Select a camera to configure events'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  {activeCamera && eventOptions.map(opt => (
                    <label key={opt} style={{ padding: 7, borderRadius: 5, background: '#f4f8fe', border: '1px solid #e6e6fa', minWidth: 120, cursor: 'pointer', fontSize: 14 }}>
                      <input type="checkbox" value={opt} checked={selectedEvents.includes(opt)} onChange={() => handleCheckbox(opt)} style={{ marginRight: 8 }} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 24, display: 'flex', gap: 18, justifyContent: 'flex-end' }}>
                <button onClick={() => setPopupOpen(false)} style={{ padding: '7px 22px', borderRadius: 6, background: '#f6f6f6', border: 'none' }}>Cancel</button>
                <button onClick={handleSubmit} style={{ padding: '7px 22px', borderRadius: 6, background: '#9864db', color: 'white', border: 'none', fontWeight: 500, opacity: Object.values(cameraSelections).some(arr => arr.length) ? 1 : 0.5 }} disabled={!Object.values(cameraSelections).some(arr => arr.length)}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventReportPage;
