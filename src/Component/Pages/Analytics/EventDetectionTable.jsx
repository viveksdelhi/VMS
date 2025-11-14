import React, { useState, useEffect } from 'react';
import AnalyticsTable from './AnalyticsData';
import { getDefaultTriggers, hasDefaultTriggers } from '../../../config/defaultEventTriggers';

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

const getEventOptions = (eventType, eventData) => {
  // If eventData is provided (from API), extract objects from conditions
  if (eventData && eventData.conditions && Array.isArray(eventData.conditions)) {
    return eventData.conditions.map(condition => condition.object);
  }
  // Otherwise, use legacy mapping
  return EVENT_OPTIONS_MAP[eventType] || ['Person', 'Vehicle', 'Bag'];
};

const EventReportPage = ({ eventType, eventId, eventData }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  // Add a state for custom event popup
  const [activeCamera, setActiveCamera] = useState(CAMERA_LIST[0].id); // First camera active by default
  // { cameraId: [arr] }
  const [cameraSelections, setCameraSelections] = useState({});
  const [payloadList, setPayloadList] = useState([]);
  const [defaultTriggers, setDefaultTriggers] = useState(null);
  const [showDefaultTriggers, setShowDefaultTriggers] = useState(false);
  
  // New states for camera selection popup and scheduling
  const [cameraSelectionPopupOpen, setCameraSelectionPopupOpen] = useState(false);
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [scheduling, setScheduling] = useState(
    eventData?.scheduling || {
      dateRange: {
        startDate: '',
        endDate: ''
      },
      specificDays: [],
      timeRange: {
        startTime: '',
        endTime: ''
      },
      isEnabled: false
    }
  );

  // Determine event options and label based on whether we have API data or legacy eventType
  const eventOptions = getEventOptions(eventType, eventData);
  const eventLabel = eventData?.eventName || EVENT_LABELS[eventType] || (eventType ? eventType.charAt(0).toUpperCase() + eventType.slice(1).replace(/-/g, ' ') : 'Event Configuration');

  // Initialize cameras, scheduling, and camera selections from API event data if available
  useEffect(() => {
    if (eventData) {
      // Initialize cameras
      if (eventData.cameras && Array.isArray(eventData.cameras)) {
        setSelectedCameras(eventData.cameras);
        // Initialize camera selections with conditions from API
        const initialSelections = {};
        eventData.cameras.forEach(cameraId => {
          if (eventData.conditions && Array.isArray(eventData.conditions)) {
            initialSelections[cameraId] = eventData.conditions.map(c => c.object);
          }
        });
        setCameraSelections(initialSelections);
      }
      
      // Initialize scheduling from API event data
      if (eventData.scheduling) {
        setScheduling({
          dateRange: {
            startDate: eventData.scheduling.dateRange?.startDate || '',
            endDate: eventData.scheduling.dateRange?.endDate || '',
          },
          specificDays: eventData.scheduling.specificDays || [],
          timeRange: {
            startTime: eventData.scheduling.timeRange?.startTime || '',
            endTime: eventData.scheduling.timeRange?.endTime || '',
          },
          isEnabled: eventData.scheduling.isEnabled || false
        });
      }
    }
  }, [eventData]);

  // Load default triggers for this event type (only for legacy eventType)
  useEffect(() => {
    if (eventType && hasDefaultTriggers(eventType)) {
      const triggers = getDefaultTriggers(eventType);
      setDefaultTriggers(triggers);
      setShowDefaultTriggers(true);
    } else if (eventData) {
      // For API events, use the event data directly
      setDefaultTriggers({
        name: eventData.eventName,
        conditions: eventData.conditions || [],
        description: `Event configuration for ${eventData.eventName}`,
        tags: eventData.tags || []
      });
      setShowDefaultTriggers(true);
    }
  }, [eventType, eventData]);

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

  // Apply default triggers to selected cameras
  const applyDefaultTriggers = () => {
    if (!defaultTriggers || selectedCameras.length === 0) return;
    
    const newSelections = { ...cameraSelections };
    selectedCameras.forEach(cameraId => {
      // Get default objects from conditions
      const defaultObjects = defaultTriggers.conditions.map(condition => condition.object);
      newSelections[cameraId] = [...new Set(defaultObjects)];
    });
    
    setCameraSelections(newSelections);
    
    // Create payload with scheduling information
    const payload = selectedCameras.map(cameraId => ({
      cameraId: Number(cameraId),
      eventselect: newSelections[cameraId] || [],
      scheduling: scheduling.isEnabled ? scheduling : null
    }));
    
    setPayloadList(prev => [...prev, ...payload]);
    setCameraSelectionPopupOpen(false);
  };

  // Toggle default triggers visibility
  const toggleDefaultTriggers = () => {
    setShowDefaultTriggers(!showDefaultTriggers);
  };

  // Camera selection functions
  const toggleCamera = (cameraId) => {
    setSelectedCameras(prev => 
      prev.includes(cameraId) 
        ? prev.filter(id => id !== cameraId)
        : [...prev, cameraId]
    );
  };

  // Scheduling functions
  const toggleSpecificDay = (day) => {
    setScheduling(prev => ({
      ...prev,
      specificDays: prev.specificDays.includes(day)
        ? prev.specificDays.filter(d => d !== day)
        : [...prev.specificDays, day]
    }));
  };

  const updateScheduling = (field, value) => {
    setScheduling(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSchedulingNested = (parentField, childField, value) => {
    setScheduling(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

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
      
      {/* Default Triggers Section */}
      {defaultTriggers && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-blue-800">
                Default Detection Triggers
              </h3>
              <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {defaultTriggers.name}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleDefaultTriggers}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {showDefaultTriggers ? 'Hide Details' : 'Show Details'}
              </button>
              <button
                onClick={() => setCameraSelectionPopupOpen(true)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                Apply to Selected Cameras
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-3">
            {defaultTriggers.description}
          </p>
          
          {showDefaultTriggers && (
            <div className="space-y-4">
              {/* Tags Section */}
              {eventData?.tags && eventData.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {eventData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-purple-50 text-purple-800 px-2 py-1 rounded-full text-xs border border-purple-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Trigger Conditions */}
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-2">Trigger Conditions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {defaultTriggers.conditions.map((condition, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-800">{condition.object}</span>
                        <span className="text-gray-500">{condition.operator}</span>
                        <span className="font-bold text-blue-600">{condition.threshold}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Assigned Cameras */}
              {eventData?.cameras && eventData.cameras.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Assigned Cameras:</h4>
                  <div className="flex flex-wrap gap-2">
                    {eventData.cameras.map((cameraId) => {
                      const camera = CAMERA_LIST.find(c => c.id === cameraId);
                      return (
                        <span
                          key={cameraId}
                          className="inline-flex items-center bg-green-50 text-green-800 px-3 py-1 rounded-md text-sm border border-green-200"
                        >
                          {camera ? camera.name : `Camera ${cameraId}`}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Scheduling Information */}
              {eventData?.scheduling && eventData.scheduling.isEnabled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Scheduling:</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    {eventData.scheduling.dateRange?.startDate || eventData.scheduling.dateRange?.endDate ? (
                      <p>
                        <span className="font-medium">Date Range:</span>{' '}
                        {eventData.scheduling.dateRange.startDate || 'No start date'} to{' '}
                        {eventData.scheduling.dateRange.endDate || 'No end date'}
                      </p>
                    ) : null}
                    {eventData.scheduling.specificDays && eventData.scheduling.specificDays.length > 0 && (
                      <p>
                        <span className="font-medium">Days:</span>{' '}
                        {eventData.scheduling.specificDays.join(', ')}
                      </p>
                    )}
                    {eventData.scheduling.timeRange?.startTime || eventData.scheduling.timeRange?.endTime ? (
                      <p>
                        <span className="font-medium">Time Range:</span>{' '}
                        {eventData.scheduling.timeRange.startTime || 'No start time'} to{' '}
                        {eventData.scheduling.timeRange.endTime || 'No end time'}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* <AnalyticsTable /> */}
      {/* <div style={{marginTop:18, marginBottom:6}}>
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
      </div> */}
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
      
      {/* Camera Selection Popup */}
      {cameraSelectionPopupOpen && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 99999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', overflow: 'hidden', width: '90vw', maxWidth: 800, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#333' }}>Apply Default Triggers to Selected Cameras</h3>
                <button 
                  onClick={() => setCameraSelectionPopupOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#666' }}
                >
                  ×
                </button>
              </div>
              
              {/* Camera Selection */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12, color: '#333' }}>Select Cameras</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                  {CAMERA_LIST.map(camera => (
                    <label key={camera.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 6, background: selectedCameras.includes(camera.id) ? '#e3f2fd' : '#f5f5f5', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedCameras.includes(camera.id)}
                        onChange={() => toggleCamera(camera.id)}
                        style={{ margin: 0 }}
                      />
                      <span style={{ fontSize: 14, color: '#333' }}>{camera.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Scheduling Section */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12, color: '#333' }}>Event Scheduling (Optional)</h4>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <input
                      type="checkbox"
                      checked={scheduling.isEnabled}
                      onChange={(e) => updateScheduling('isEnabled', e.target.checked)}
                      style={{ margin: 0 }}
                    />
                    <span style={{ fontSize: 14, color: '#333' }}>Enable scheduling for this event</span>
                  </label>
                </div>

                {scheduling.isEnabled && (
                  <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, border: '1px solid #e9ecef' }}>
                    {/* Date Range */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>Date Range (Optional)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>Start Date</label>
                          <input
                            type="date"
                            value={scheduling.dateRange.startDate}
                            onChange={(e) => updateSchedulingNested('dateRange', 'startDate', e.target.value)}
                            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>End Date</label>
                          <input
                            type="date"
                            value={scheduling.dateRange.endDate}
                            onChange={(e) => updateSchedulingNested('dateRange', 'endDate', e.target.value)}
                            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Specific Days */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>Specific Days (Optional)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                          <label key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <input
                              type="checkbox"
                              checked={scheduling.specificDays.includes(day)}
                              onChange={() => toggleSpecificDay(day)}
                              style={{ margin: 0 }}
                            />
                            <span style={{ fontSize: 12, color: '#333' }}>{day.substring(0, 3)}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Time Range */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>Time Range (Optional)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>Start Time</label>
                          <input
                            type="time"
                            value={scheduling.timeRange.startTime}
                            onChange={(e) => updateSchedulingNested('timeRange', 'startTime', e.target.value)}
                            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>End Time</label>
                          <input
                            type="time"
                            value={scheduling.timeRange.endTime}
                            onChange={(e) => updateSchedulingNested('timeRange', 'endTime', e.target.value)}
                            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Schedule Summary */}
                    <div style={{ background: '#e3f2fd', padding: 12, borderRadius: 6, border: '1px solid #bbdefb' }}>
                      <h5 style={{ fontSize: 12, fontWeight: 500, color: '#1976d2', marginBottom: 8 }}>Schedule Summary</h5>
                      <div style={{ fontSize: 12, color: '#1976d2' }}>
                        {scheduling.dateRange.startDate || scheduling.dateRange.endDate ? (
                          <p style={{ margin: '4px 0' }}>Date Range: {scheduling.dateRange.startDate || 'No start date'} to {scheduling.dateRange.endDate || 'No end date'}</p>
                        ) : null}
                        {scheduling.specificDays.length > 0 && (
                          <p style={{ margin: '4px 0' }}>Days: {scheduling.specificDays.join(', ')}</p>
                        )}
                        {scheduling.timeRange.startTime || scheduling.timeRange.endTime ? (
                          <p style={{ margin: '4px 0' }}>Time: {scheduling.timeRange.startTime || 'No start time'} to {scheduling.timeRange.endTime || 'No end time'}</p>
                        ) : null}
                        {!scheduling.dateRange.startDate && !scheduling.dateRange.endDate && 
                         scheduling.specificDays.length === 0 && 
                         !scheduling.timeRange.startTime && !scheduling.timeRange.endTime && (
                          <p style={{ margin: '4px 0', color: '#666' }}>No specific scheduling constraints set</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  onClick={() => setCameraSelectionPopupOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: 6, background: '#f5f5f5', border: '1px solid #ddd', cursor: 'pointer', fontSize: 14 }}
                >
                  Cancel
                </button>
                <button
                  onClick={applyDefaultTriggers}
                  disabled={selectedCameras.length === 0}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: 6, 
                    background: selectedCameras.length > 0 ? '#1976d2' : '#ccc', 
                    color: 'white', 
                    border: 'none', 
                    cursor: selectedCameras.length > 0 ? 'pointer' : 'not-allowed', 
                    fontSize: 14,
                    opacity: selectedCameras.length > 0 ? 1 : 0.6
                  }}
                >
                  Apply to {selectedCameras.length} Camera{selectedCameras.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventReportPage;
