import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AnalyticsTable from './AnalyticsData';
import { useCustomEvents } from '../../../contexts/CustomEventContext';

const CustomEventReportPage = ({ customEventId }) => {
  // Get customEventId from props or URL params as fallback
  const urlParams = useParams();
  const eventId = customEventId || urlParams.customEventId;
  const { customEvents, removeCustomEvent } = useCustomEvents();
  
  const [popupOpen, setPopupOpen] = useState(false);
  const [activeCamera, setActiveCamera] = useState(null);
  const [cameraSelections, setCameraSelections] = useState({});
  const [payloadList, setPayloadList] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Find the custom event by ID
  const customEvent = customEvents.find(event => event.id === parseInt(eventId));
  
  if (!customEvent) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Custom Event Not Found</h2>
          <p className="text-gray-600">The requested custom event could not be found.</p>
          <p className="text-sm text-gray-500 mt-2">Looking for ID: {eventId}</p>
          <p className="text-sm text-gray-500">Available events: {customEvents.map(e => `${e.name} (${e.id})`).join(', ')}</p>
        </div>
      </div>
    );
  }

  const CAMERA_LIST = [
    { id: 1, name: 'Camera 1' },
    { id: 2, name: 'Camera 2' },
    { id: 3, name: 'Camera 3' },
  ];

  // Get event options based on custom event conditions
  const getEventOptions = () => {
    const uniqueObjects = [...new Set(customEvent.conditions.map(c => c.object))];
    return uniqueObjects;
  };

  const eventOptions = getEventOptions();

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

  // Delete custom event
  const handleDeleteEvent = () => {
    removeCustomEvent(parseInt(eventId));
    // Redirect to analytics page after deletion
    window.location.href = '/analytics';
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#9357c9]">
          {customEvent.name} Events
        </h2>
        <div className="flex items-center space-x-3">
          {/* <button 
            onClick={() => setPopupOpen(true)} 
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
          >
            + Create Event Report
          </button> */}
          <button 
            onClick={() => setShowDeleteConfirm(true)} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Delete Event
          </button>
        </div>
      </div>

      {/* Custom Event Conditions Display */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">Custom Event Conditions</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {customEvent.conditions.map((condition, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {condition.object} {condition.operator} {condition.threshold}
              </span>
              {index < customEvent.conditions.length - 1 && (
                <span className="text-purple-600 font-bold">AND</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3">
          <span className="text-sm text-purple-600 font-medium">Assigned Cameras: </span>
          <span className="text-sm text-gray-700">
            {customEvent.cameras.map(camId => 
              CAMERA_LIST.find(c => c.id === camId)?.name || `Camera ${camId}`
            ).join(', ')}
          </span>
        </div>
      </div>

      <AnalyticsTable />
      
      {/* Custom Event Detection Payload */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <h3 className="text-xl font-bold text-purple-800 mb-4">Custom Event Detection Payload</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Conditions */}
          <div className="bg-white p-4 rounded-lg border border-purple-100">
            <h4 className="text-lg font-semibold text-purple-700 mb-3">Detection Conditions</h4>
            <div className="space-y-2">
              {customEvent.conditions.map((condition, index) => (
                <div key={index} className="flex items-center justify-between bg-purple-50 p-3 rounded border border-purple-100">
                  <div className="flex items-center space-x-3">
                    <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                      {condition.object}
                    </span>
                    <span className="text-purple-600 font-bold">{condition.operator}</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                      {condition.threshold}
                    </span>
                  </div>
                  {index < customEvent.conditions.length - 1 && (
                    <span className="text-purple-500 font-bold text-sm">AND</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Camera Assignments */}
          <div className="bg-white p-4 rounded-lg border border-purple-100">
            <h4 className="text-lg font-semibold text-purple-700 mb-3">Assigned Cameras</h4>
            <div className="space-y-2">
              {customEvent.cameras.map(camId => (
                <div key={camId} className="flex items-center space-x-2 bg-blue-50 p-3 rounded border border-blue-100">
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    Camera {camId}
                  </span>
                  <span className="text-blue-600 text-sm">
                    {CAMERA_LIST.find(c => c.id === camId)?.name || `Camera ${camId}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scheduling Information */}
        {customEvent.scheduling && (
          <div className="mt-6 bg-white p-4 rounded-lg border border-purple-100">
            <h4 className="text-lg font-semibold text-purple-700 mb-3">Event Scheduling</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Range */}
              {customEvent.scheduling.dateRange.startDate || customEvent.scheduling.dateRange.endDate ? (
                <div className="bg-green-50 p-3 rounded border border-green-100">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Date Range</h5>
                  <p className="text-sm text-green-700">
                    {customEvent.scheduling.dateRange.startDate || 'No start date'} to {customEvent.scheduling.dateRange.endDate || 'No end date'}
                  </p>
                </div>
              ) : null}

              {/* Specific Days */}
              {customEvent.scheduling.specificDays.length > 0 && (
                <div className="bg-blue-50 p-3 rounded border border-blue-100">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Active Days</h5>
                  <p className="text-sm text-blue-700">
                    {customEvent.scheduling.specificDays.join(', ')}
                  </p>
                </div>
              )}

              {/* Time Range */}
              {customEvent.scheduling.timeRange.startTime || customEvent.scheduling.timeRange.endTime ? (
                <div className="bg-orange-50 p-3 rounded border border-orange-100">
                  <h5 className="text-sm font-medium text-orange-800 mb-2">Time Range</h5>
                  <p className="text-sm text-orange-700">
                    {customEvent.scheduling.timeRange.startTime || 'No start time'} to {customEvent.scheduling.timeRange.endTime || 'No end time'}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* JSON Payload */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-purple-700 mb-3">Detection Payload (JSON)</h4>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`{
  "eventId": ${customEvent.id},
  "eventName": "${customEvent.name}",
  "conditions": [
${customEvent.conditions.map(c => `    {
      "object": "${c.object}",
      "operator": "${c.operator}",
      "threshold": ${c.threshold}
    }`).join(',\n')}
  ],
  "cameras": [${customEvent.cameras.join(', ')}],
  "scheduling": ${customEvent.scheduling ? JSON.stringify(customEvent.scheduling, null, 2) : 'null'}
}`}
            </pre>
          </div>
        </div>
      </div>
      
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
                    <button 
                      type="button" 
                      onClick={() => handleCameraFocus(cam.id)} 
                      style={{ 
                        padding: 10, 
                        width: '100%', 
                        borderRadius: 7, 
                        background: activeCamera === cam.id ? '#e4d6fa' : '#faf6ff', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: '#3d2672', 
                        fontWeight: activeCamera === cam.id ? '700' : '500', 
                        textAlign:'left' 
                      }}
                    >
                      {cam.name}
                    </button>
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
                      <input 
                        type="checkbox" 
                        value={opt} 
                        checked={selectedEvents.includes(opt)} 
                        onChange={() => handleCheckbox(opt)} 
                        style={{ marginRight: 8 }} 
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              
              <div style={{ marginTop: 24, display: 'flex', gap: 18, justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setPopupOpen(false)} 
                  style={{ padding: '7px 22px', borderRadius: 6, background: '#f6f6f6', border: 'none' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit} 
                  style={{ 
                    padding: '7px 22px', 
                    borderRadius: 6, 
                    background: '#9864db', 
                    color: 'white', 
                    border: 'none', 
                    fontWeight: 500, 
                    opacity: Object.values(cameraSelections).some(arr => arr.length) ? 1 : 0.5 
                  }} 
                  disabled={!Object.values(cameraSelections).some(arr => arr.length)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
       <div style={{ position: 'fixed', left: 65, top: 0, width: 'calc(100vw - 65px)', height: '100vh', zIndex: 99999, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #9164d966', padding: 32, minWidth: 600, maxWidth: '80vw' }}>
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Custom Event</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>"{customEvent.name}"</strong>? 
              This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomEventReportPage;
