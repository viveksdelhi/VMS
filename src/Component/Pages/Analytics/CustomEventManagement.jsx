import React, { useState } from 'react';
import { useCustomEvents } from '../../../contexts/CustomEventContext';
import { useNavigate } from 'react-router-dom';

const OBJECT_OPTIONS = [
  'Person', 'Vehicle', 'Bicycle', 'Car', 'Dog', 'Animal', 'Bag', 'Box', 
  'Suitcase', 'Laptop', 'Chair', 'TV', 'Artwork', 'Group', 'Children', 
  'Adult', 'Bus', 'Smoke', 'Fire', 'Flame', 'Steam', 'Unknown Object',
  'Camera Covered', 'Camera Moved'
];

const OPERATORS = ['>', '>=', '==', '<', '<='];

const CustomEventManagement = () => {
  const { customEvents, addCustomEvent, removeCustomEvent, updateCustomEvent, clearAllCustomEvents } = useCustomEvents();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const CAMERA_LIST = [
    { id: 1, name: 'Camera 1' },
    { id: 2, name: 'Camera 2' },
    { id: 3, name: 'Camera 3' },
  ];

  const handleDeleteEvent = (eventId) => {
    removeCustomEvent(eventId);
    setShowDeleteConfirm(null);
  };

  const handleViewEvent = (eventId) => {
    navigate(`/analytics/custom/${eventId}`);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#9357c9]">Custom Event Management</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>+</span>
            <span>Create New Custom Event</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all custom events? This cannot be undone.')) {
                clearAllCustomEvents();
              }
            }}
            className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Clear All
          </button>
        </div>
      </div>


      {/* Custom Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewEvent(event.id)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setShowEditForm(event)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(event.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Conditions:</h4>
                  <div className="space-y-1">
                    {event.conditions.map((condition, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        {condition.object} {condition.operator} {condition.threshold}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Cameras:</h4>
                  <div className="text-sm text-gray-700">
                    {event.cameras.map(camId => 
                      CAMERA_LIST.find(c => c.id === camId)?.name || `Camera ${camId}`
                    ).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {customEvents.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Custom Events</h3>
          <p className="text-gray-500 mb-4">Create your first custom event to get started.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Create Custom Event
          </button>
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <CreateCustomEventForm 
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => setShowCreateForm(false)}
        />
      )}

      {/* Edit Form Modal */}
      {showEditForm && (
        <EditCustomEventForm 
          event={showEditForm}
          onClose={() => setShowEditForm(null)}
          onSuccess={() => setShowEditForm(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', left: 65, top: 0, width: 'calc(100vw - 65px)', height: '100vh', zIndex: 99999, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #9164d966', padding: 32, minWidth: 600, maxWidth: '80vw' }}>
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Custom Event</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this custom event? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEvent(showDeleteConfirm)}
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

// Create Custom Event Form Component
const CreateCustomEventForm = ({ onClose, onSuccess }) => {
  const { addCustomEvent } = useCustomEvents();
  const [eventName, setEventName] = useState('');
  const [conditions, setConditions] = useState([]);
  const [currentCondition, setCurrentCondition] = useState({
    object: 'Person',
    operator: '>',
    threshold: 1
  });
  const [step, setStep] = useState(1);
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [scheduling, setScheduling] = useState({
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
  });

  const CAMERA_LIST = [
    { id: 1, name: 'Camera 1' },
    { id: 2, name: 'Camera 2' },
    { id: 3, name: 'Camera 3' },
  ];

  const addCondition = () => {
    if (currentCondition.object && currentCondition.threshold >= 0) {
      setConditions([...conditions, { ...currentCondition, id: Date.now() }]);
      setCurrentCondition({ object: 'Person', operator: '>', threshold: 1 });
    }
  };

  const removeCondition = (id) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const toggleCamera = (cameraId) => {
    setSelectedCameras(prev => 
      prev.includes(cameraId) 
        ? prev.filter(id => id !== cameraId)
        : [...prev, cameraId]
    );
  };

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

  const handleNext = () => {
    if (step === 1 && eventName.trim() && conditions.length > 0) {
      setStep(2);
    } else if (step === 2 && selectedCameras.length > 0) {
      setStep(3);
    }
  };

  const handleSave = () => {
    if (step === 3) {
      addCustomEvent({
        name: eventName,
        conditions,
        cameras: selectedCameras,
        scheduling: scheduling.isEnabled ? scheduling : null
      });
      onSuccess();
    }
  };

  return (
    <div style={{ position: 'fixed', left: 65, top: 0, width: 'calc(100vw - 65px)', height: '100vh', zIndex: 99999, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #9164d966', padding: 32, minWidth: 600, maxWidth: '80vw' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Create Custom Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {step === 1 && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Event Name</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter custom event name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Add Conditions</label>
              <div className="flex gap-2 mb-2">
                <select
                  value={currentCondition.object}
                  onChange={(e) => setCurrentCondition({...currentCondition, object: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  {OBJECT_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                
                <select
                  value={currentCondition.operator}
                  onChange={(e) => setCurrentCondition({...currentCondition, operator: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  {OPERATORS.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
                
                <input
                  type="number"
                  value={currentCondition.threshold}
                  onChange={(e) => setCurrentCondition({...currentCondition, threshold: parseInt(e.target.value) || 0})}
                  className="px-3 py-2 border border-gray-300 rounded-md w-20 text-gray-900"
                  min="0"
                />
                
                <button
                  onClick={addCondition}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {conditions.map(condition => (
                  <div key={condition.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-gray-900">{condition.object} {condition.operator} {condition.threshold}</span>
                    <button
                      onClick={() => removeCondition(condition.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={!eventName.trim() || conditions.length === 0}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-700">Select Cameras for "{eventName}"</h3>
            
            <div className="space-y-2 mb-4">
              {CAMERA_LIST.map(camera => (
                <label key={camera.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCameras.includes(camera.id)}
                    onChange={() => toggleCamera(camera.id)}
                    className="rounded"
                  />
                  <span className="text-gray-900">{camera.name}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={selectedCameras.length === 0}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-700">Configure Event Scheduling (Optional)</h3>
            
            <div className="mb-6">
              <label className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  checked={scheduling.isEnabled}
                  onChange={(e) => updateScheduling('isEnabled', e.target.checked)}
                  className="rounded"
                />
                <span className="text-gray-900 font-medium">Enable scheduling for this event</span>
              </label>
            </div>

            {scheduling.isEnabled && (
              <div className="space-y-6">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Date Range (Optional)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={scheduling.dateRange.startDate}
                        onChange={(e) => updateSchedulingNested('dateRange', 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <input
                        type="date"
                        value={scheduling.dateRange.endDate}
                        onChange={(e) => updateSchedulingNested('dateRange', 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Specific Days */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Specific Days (Optional)</label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                      <label key={day} className="flex flex-col items-center space-y-1">
                        <input
                          type="checkbox"
                          checked={scheduling.specificDays.includes(day)}
                          onChange={() => toggleSpecificDay(day)}
                          className="rounded"
                        />
                        <span className="text-xs text-gray-700">{day.substring(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time Range */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Time Range (Optional)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={scheduling.timeRange.startTime}
                        onChange={(e) => updateSchedulingNested('timeRange', 'startTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Time</label>
                      <input
                        type="time"
                        value={scheduling.timeRange.endTime}
                        onChange={(e) => updateSchedulingNested('timeRange', 'endTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule Summary */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">Schedule Summary</h4>
                  <div className="text-sm text-purple-700">
                    {scheduling.dateRange.startDate || scheduling.dateRange.endDate ? (
                      <p>Date Range: {scheduling.dateRange.startDate || 'No start date'} to {scheduling.dateRange.endDate || 'No end date'}</p>
                    ) : null}
                    {scheduling.specificDays.length > 0 && (
                      <p>Days: {scheduling.specificDays.join(', ')}</p>
                    )}
                    {scheduling.timeRange.startTime || scheduling.timeRange.endTime ? (
                      <p>Time: {scheduling.timeRange.startTime || 'No start time'} to {scheduling.timeRange.endTime || 'No end time'}</p>
                    ) : null}
                    {!scheduling.dateRange.startDate && !scheduling.dateRange.endDate && 
                     scheduling.specificDays.length === 0 && 
                     !scheduling.timeRange.startTime && !scheduling.timeRange.endTime && (
                      <p className="text-gray-500">No specific scheduling constraints set</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save Custom Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Edit Custom Event Form Component
const EditCustomEventForm = ({ event, onClose, onSuccess }) => {
  const { updateCustomEvent } = useCustomEvents();
  const [eventName, setEventName] = useState(event.name);
  const [conditions, setConditions] = useState([...event.conditions]);
  const [currentCondition, setCurrentCondition] = useState({
    object: 'Person',
    operator: '>',
    threshold: 1
  });
  const [step, setStep] = useState(1);
  const [selectedCameras, setSelectedCameras] = useState([...event.cameras]);
  const [scheduling, setScheduling] = useState({
    dateRange: {
      startDate: event.scheduling?.dateRange?.startDate || '',
      endDate: event.scheduling?.dateRange?.endDate || ''
    },
    specificDays: event.scheduling?.specificDays || [],
    timeRange: {
      startTime: event.scheduling?.timeRange?.startTime || '',
      endTime: event.scheduling?.timeRange?.endTime || ''
    },
    isEnabled: !!event.scheduling
  });

  const CAMERA_LIST = [
    { id: 1, name: 'Camera 1' },
    { id: 2, name: 'Camera 2' },
    { id: 3, name: 'Camera 3' },
  ];

  const addCondition = () => {
    if (currentCondition.object && currentCondition.threshold >= 0) {
      setConditions([...conditions, { ...currentCondition, id: Date.now() }]);
      setCurrentCondition({ object: 'Person', operator: '>', threshold: 1 });
    }
  };

  const removeCondition = (id) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const toggleCamera = (cameraId) => {
    setSelectedCameras(prev => 
      prev.includes(cameraId) 
        ? prev.filter(id => id !== cameraId)
        : [...prev, cameraId]
    );
  };

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

  const handleNext = () => {
    if (step === 1 && eventName.trim() && conditions.length > 0) {
      setStep(2);
    } else if (step === 2 && selectedCameras.length > 0) {
      setStep(3);
    }
  };

  const handleSave = () => {
    if (step === 3) {
      updateCustomEvent(event.id, {
        name: eventName,
        conditions,
        cameras: selectedCameras,
        scheduling: scheduling.isEnabled ? scheduling : null
      });
      onSuccess();
    }
  };

  return (
    <div style={{ position: 'fixed', left: 65, top: 0, width: 'calc(100vw - 65px)', height: '100vh', zIndex: 99999, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #9164d966', padding: 32, minWidth: 600, maxWidth: '80vw' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Custom Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {step === 1 && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Event Name</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter custom event name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Edit Conditions</label>
              <div className="flex gap-2 mb-2">
                <select
                  value={currentCondition.object}
                  onChange={(e) => setCurrentCondition({...currentCondition, object: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  {OBJECT_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                
                <select
                  value={currentCondition.operator}
                  onChange={(e) => setCurrentCondition({...currentCondition, operator: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  {OPERATORS.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
                
                <input
                  type="number"
                  value={currentCondition.threshold}
                  onChange={(e) => setCurrentCondition({...currentCondition, threshold: parseInt(e.target.value) || 0})}
                  className="px-3 py-2 border border-gray-300 rounded-md w-20 text-gray-900"
                  min="0"
                />
                
                <button
                  onClick={addCondition}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {conditions.map(condition => (
                  <div key={condition.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-gray-900">{condition.object} {condition.operator} {condition.threshold}</span>
                    <button
                      onClick={() => removeCondition(condition.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={!eventName.trim() || conditions.length === 0}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-700">Update Cameras for "{eventName}"</h3>
            
            <div className="space-y-2 mb-4">
              {CAMERA_LIST.map(camera => (
                <label key={camera.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCameras.includes(camera.id)}
                    onChange={() => toggleCamera(camera.id)}
                    className="rounded"
                  />
                  <span className="text-gray-900">{camera.name}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={selectedCameras.length === 0}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-700">Configure Event Scheduling (Optional)</h3>
            
            <div className="mb-6">
              <label className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  checked={scheduling.isEnabled}
                  onChange={(e) => updateScheduling('isEnabled', e.target.checked)}
                  className="rounded"
                />
                <span className="text-gray-900 font-medium">Enable scheduling for this event</span>
              </label>
            </div>

            {scheduling.isEnabled && (
              <div className="space-y-6">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Date Range (Optional)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={scheduling.dateRange.startDate}
                        onChange={(e) => updateSchedulingNested('dateRange', 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <input
                        type="date"
                        value={scheduling.dateRange.endDate}
                        onChange={(e) => updateSchedulingNested('dateRange', 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Specific Days */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Specific Days (Optional)</label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                      <label key={day} className="flex flex-col items-center space-y-1">
                        <input
                          type="checkbox"
                          checked={scheduling.specificDays.includes(day)}
                          onChange={() => toggleSpecificDay(day)}
                          className="rounded"
                        />
                        <span className="text-xs text-gray-700">{day.substring(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time Range */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Time Range (Optional)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={scheduling.timeRange.startTime}
                        onChange={(e) => updateSchedulingNested('timeRange', 'startTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Time</label>
                      <input
                        type="time"
                        value={scheduling.timeRange.endTime}
                        onChange={(e) => updateSchedulingNested('timeRange', 'endTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule Summary */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">Schedule Summary</h4>
                  <div className="text-sm text-purple-700">
                    {scheduling.dateRange.startDate || scheduling.dateRange.endDate ? (
                      <p>Date Range: {scheduling.dateRange.startDate || 'No start date'} to {scheduling.dateRange.endDate || 'No end date'}</p>
                    ) : null}
                    {scheduling.specificDays.length > 0 && (
                      <p>Days: {scheduling.specificDays.join(', ')}</p>
                    )}
                    {scheduling.timeRange.startTime || scheduling.timeRange.endTime ? (
                      <p>Time: {scheduling.timeRange.startTime || 'No start time'} to {scheduling.timeRange.endTime || 'No end time'}</p>
                    ) : null}
                    {!scheduling.dateRange.startDate && !scheduling.dateRange.endDate && 
                     scheduling.specificDays.length === 0 && 
                     !scheduling.timeRange.startTime && !scheduling.timeRange.endTime && (
                      <p className="text-gray-500">No specific scheduling constraints set</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Update Custom Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomEventManagement;
