import React, { useState } from 'react';
import { useCustomEvents } from '../../../contexts/CustomEventContext';

const OBJECT_OPTIONS = [
  'Person', 'Vehicle', 'Bicycle', 'Car', 'Dog', 'Animal', 'Bag', 'Box', 
  'Suitcase', 'Laptop', 'Chair', 'TV', 'Artwork', 'Group', 'Children', 
  'Adult', 'Bus', 'Smoke', 'Fire', 'Flame', 'Steam', 'Unknown Object',
  'Camera Covered', 'Camera Moved'
];

const OPERATORS = ['>', '>=', '==', '<', '<='];

const CustomEventForm = ({ onClose }) => {
  const { addCustomEvent } = useCustomEvents();
  const [eventName, setEventName] = useState('');
  const [conditions, setConditions] = useState([]);
  const [currentCondition, setCurrentCondition] = useState({
    object: 'Person',
    operator: '>',
    threshold: 1
  });
  const [step, setStep] = useState(1); // 1: Create conditions, 2: Select cameras, 3: Schedule
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
      // Save custom event using context
      const newEvent = addCustomEvent({
        name: eventName,
        conditions,
        cameras: selectedCameras,
        scheduling: scheduling.isEnabled ? scheduling : null
      });
      console.log('CustomEventForm - Created new event:', newEvent);
      onClose();
    }
  };

  // Test function to create a sample custom event
  const createTestEvent = () => {
    const newEvent = addCustomEvent({
      name: 'Test Custom Event',
      conditions: [
        { object: 'Person', operator: '>', threshold: 2 },
        { object: 'Vehicle', operator: '>=', threshold: 1 }
      ],
      cameras: [1, 2]
    });
    console.log('Test event created with ID:', newEvent.id);
  };

  return (
    <div>
      {/* Test button - remove this later */}
      {/* <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded">
        <button onClick={createTestEvent} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">
          Create Test Event
        </button>
        <span className="ml-2 text-sm text-gray-600">(For testing - creates "Test Custom Event")</span>
      </div> */}
      
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
  );
};

export default CustomEventForm;
