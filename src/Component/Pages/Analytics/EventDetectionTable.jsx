import React, { useState, useEffect } from 'react';
import AnalyticsTable from './AnalyticsData';
import { useCustomEvents } from '../../../contexts/CustomEventContext';

const CAMERA_LIST = [
  { id: 1, name: 'Camera 1' },
  { id: 2, name: 'Camera 2' },
  { id: 3, name: 'Camera 3' },
];

const EventReportPage = ({ eventId, eventData }) => {
  const { customEvents } = useCustomEvents();
  const [popupOpen, setPopupOpen] = useState(false);
  const [activeCamera, setActiveCamera] = useState(CAMERA_LIST[0].id);
  const [cameraSelections, setCameraSelections] = useState({});
  const [payloadList, setPayloadList] = useState([]);

  // Find the custom event by ID from context
  const customEvent =
    customEvents?.find(event => event.eventId === eventId || event.id === eventId) || eventData;

  if (!customEvent) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Event Not Found</h2>
          <p className="text-gray-600">The requested event could not be found.</p>
        </div>
      </div>
    );
  }

  // Get event options from custom event conditions
  const getEventOptions = () => {
    if (customEvent.conditions && Array.isArray(customEvent.conditions)) {
      return customEvent.conditions.map(condition => condition.object);
    }
    return ['Person', 'Vehicle', 'Bag']; // Fallback options
  };

  const eventOptions = getEventOptions();
  const eventLabel = customEvent.eventName || customEvent.name || 'Event Configuration';

  // Initialize camera selections from custom event data
  useEffect(() => {
    if (customEvent.cameras && Array.isArray(customEvent.cameras)) {
      const initialSelections = {};
      customEvent.cameras.forEach(cameraId => {
        if (customEvent.conditions && Array.isArray(customEvent.conditions)) {
          initialSelections[cameraId] = customEvent.conditions.map(c => c.object);
        }
      });
      setCameraSelections(initialSelections);
    }
  }, [customEvent]);

  // Click to focus a camera
  const handleCameraFocus = camId => {
    setActiveCamera(camId);
  };

  // Edit ONLY the active camera's event array
  const handleCheckbox = event => {
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
      .map(([id, arr]) => ({
        cameraId: Number(id),
        eventselect: arr,
        tags: customEvent.tags || [],
      }));
    setPayloadList(payload);
    setPopupOpen(false);
  };

  const livePayload = Object.entries(cameraSelections)
    .filter(([_, arr]) => arr.length)
    .map(([id, arr]) => ({
      cameraId: Number(id),
      eventselect: arr,
      tags: customEvent.tags || [],
    }));

  // The events for camera in focus
  const selectedEvents = cameraSelections[activeCamera] || [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#9357c9]">{eventLabel} Events</h2>
        <button
          onClick={() => setPopupOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
        >
          + Create Event Report
        </button>
      </div>

      {/* Custom Event Details Section */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-blue-800">Custom Event Configuration</h3>
            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              {eventLabel}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-3">
          Custom event detection configuration with specific conditions and triggers.
        </p>

        <div className="space-y-4">
          {/* Tags Section */}
          {customEvent.tags && customEvent.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {customEvent.tags.map((tag, index) => (
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
              {customEvent.conditions &&
                customEvent.conditions.map((condition, index) => (
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
          {customEvent.cameras && customEvent.cameras.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-2">Assigned Cameras:</h4>
              <div className="flex flex-wrap gap-2">
                {customEvent.cameras.map(cameraId => {
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
          {customEvent.scheduling && customEvent.scheduling.isEnabled && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Scheduling:</h4>
              <div className="space-y-1 text-sm text-gray-700">
                {customEvent.scheduling.dateRange?.startDate ||
                customEvent.scheduling.dateRange?.endDate ? (
                  <p>
                    <span className="font-medium">Date Range:</span>{' '}
                    {customEvent.scheduling.dateRange.startDate || 'No start date'} to{' '}
                    {customEvent.scheduling.dateRange.endDate || 'No end date'}
                  </p>
                ) : null}
                {customEvent.scheduling.specificDays &&
                  customEvent.scheduling.specificDays.length > 0 && (
                    <p>
                      <span className="font-medium">Days:</span>{' '}
                      {customEvent.scheduling.specificDays.join(', ')}
                    </p>
                  )}
                {customEvent.scheduling.timeRange?.startTime ||
                customEvent.scheduling.timeRange?.endTime ? (
                  <p>
                    <span className="font-medium">Time Range:</span>{' '}
                    {customEvent.scheduling.timeRange.startTime || 'No start time'} to{' '}
                    {customEvent.scheduling.timeRange.endTime || 'No end time'}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Table */}
      <AnalyticsTable />

      {/* Payload Preview */}
      <div style={{ marginTop: 18, marginBottom: 6 }}>
        <h5 className="text-[15px] font-medium mb-2 text-[#b17ef3]">
          Payload preview (all cameras with any selections)
        </h5>
        <pre className="bg-[#f4f3fa] text-sm rounded px-4 py-3 border border-[#ece5fa] text-[#402d57]">
          {JSON.stringify(livePayload, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: 12 }}>
        <h5 className="text-[15px] font-medium mb-2 text-[#9465db]">Submitted payloads</h5>
        <pre className="bg-[#f4f3fa] text-sm rounded px-4 py-3 border border-[#e1defa] text-[#402d57]">
          {JSON.stringify(payloadList, null, 2)}
        </pre>
      </div>

      {/* Event Configuration Popup */}
      {popupOpen && (
        <div
          style={{
            position: 'fixed',
            left: 65,
            top: 0,
            width: 'calc(100vw - 65px)',
            height: '100vh',
            zIndex: 99999,
            background: 'rgba(0,0,0,0.38)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              minWidth: 800,
              minHeight: 440,
              width: '64vw',
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 4px 24px #9164d966',
              overflow: 'hidden',
            }}
          >
            {/* Camera list */}
            <div
              style={{
                width: 240,
                background: '#f5f2fa',
                borderRight: '1px solid #eee',
                padding: 24,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 10 }}>Cameras</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {CAMERA_LIST.map(cam => (
                  <li key={cam.id} style={{ marginBottom: 2 }}>
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
                        textAlign: 'left',
                      }}
                    >
                      {cam.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Event checkboxes per camera */}
            <div
              style={{
                flex: 1,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, marginBottom: 10 }}>
                  {activeCamera
                    ? `Select Events/Objects for ${CAMERA_LIST.find(c => c.id === activeCamera)?.name}`
                    : 'Select a camera to configure events'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  {activeCamera &&
                    eventOptions.map(opt => (
                      <label
                        key={opt}
                        style={{
                          padding: 7,
                          borderRadius: 5,
                          background: '#f4f8fe',
                          border: '1px solid #e6e6fa',
                          minWidth: 120,
                          cursor: 'pointer',
                          fontSize: 14,
                        }}
                      >
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
                  style={{
                    padding: '7px 22px',
                    borderRadius: 6,
                    background: '#f6f6f6',
                    border: 'none',
                  }}
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
                    opacity: Object.values(cameraSelections).some(arr => arr.length) ? 1 : 0.5,
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
    </div>
  );
};

export default EventReportPage;
