import React, { useState } from 'react';
import { useCustomEvents } from '../../../contexts/CustomEventContext';
import { getAllDefaultTriggers } from '../../../config/defaultEventTriggers';

const OBJECT_OPTIONS = [
  'Person', 'Vehicle', 'Bicycle', 'Car', 'Dog', 'Animal', 'Bag', 'Box', 
  'Suitcase', 'Laptop', 'Chair', 'TV', 'Artwork', 'Group', 'Children', 
  'Adult', 'Bus', 'Smoke', 'Fire', 'Flame', 'Steam', 'Unknown Object',
  'Camera Covered', 'Camera Moved'
];

const OPERATORS = ['>', '>=', '==', '<', '<='];

const CustomEventForm = ({ onClose }) => {
  const { addCustomEvent, customEvents } = useCustomEvents();
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedPresetEvents, setSelectedPresetEvents] = useState([]);
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

  // Get default presets and merge user custom events as selectable presets
  const defaultPresets = getAllDefaultTriggers();
  const customPresetMap = Object.fromEntries(
    (customEvents || []).map(e => [
      `custom_${e.id}`,
      {
        name: e.name,
        description: e.description || 'User-defined custom event',
        conditions: e.conditions || [],
        tags: e.tags || []
      }
    ])
  );
  const presetEvents = { ...defaultPresets, ...customPresetMap };

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

  // Handle preset event selection
  const handlePresetEventToggle = (eventType) => {
    setSelectedPresetEvents(prev => {
      if (prev.includes(eventType)) {
        // Remove preset event and its conditions
        const presetEvent = presetEvents[eventType];
        const newConditions = conditions.filter(condition => 
          !presetEvent.conditions.some(presetCondition => 
            presetCondition.object === condition.object &&
            presetCondition.operator === condition.operator &&
            presetCondition.threshold === condition.threshold
          )
        );
        setConditions(newConditions);
        return prev.filter(type => type !== eventType);
      } else {
        // Add preset event and its conditions
        const presetEvent = presetEvents[eventType];
        const newConditions = [...conditions];
        
        presetEvent.conditions.forEach(presetCondition => {
          // Check if condition already exists
          const exists = newConditions.some(condition => 
            condition.object === presetCondition.object &&
            condition.operator === presetCondition.operator &&
            condition.threshold === presetCondition.threshold
          );
          
          if (!exists) {
            newConditions.push({
              ...presetCondition,
              id: Date.now() + Math.random() // Unique ID
            });
          }
        });
        
        setConditions(newConditions);
        return [...prev, eventType];
      }
    });
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
        description: description.trim() || null,
        tags,
        presetEvents: selectedPresetEvents,
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
            <label className="block text-sm font-medium mb-2 text-gray-700">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">Tags (Optional)</label>
            <div className="w-full px-2 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-purple-500 bg-white">
              <div className="flex flex-wrap gap-2">
                {tags.map((t, idx) => (
                  <span key={`${t}-${idx}`} className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 px-2 py-1 rounded-full border border-purple-200 text-xs">
                    {t}
                    <button
                      type="button"
                      className="text-purple-600 hover:text-purple-800"
                      onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                      aria-label="Remove tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const raw = tagInput.trim().replace(/,$/, '');
                      if (raw) {
                        const newTags = raw.split(',').map(s => s.trim()).filter(Boolean);
                        const merged = [...tags, ...newTags]
                          .map(t => t.toLowerCase())
                          .filter((t, i, arr) => arr.indexOf(t) === i);
                        setTags(merged);
                      }
                      setTagInput('');
                    }
                  }}
                  onBlur={() => {
                    const raw = tagInput.trim().replace(/,$/, '');
                    if (raw) {
                      const newTags = raw.split(',').map(s => s.trim()).filter(Boolean);
                      const merged = [...tags, ...newTags]
                        .map(t => t.toLowerCase())
                        .filter((t, i, arr) => arr.indexOf(t) === i);
                      setTags(merged);
                    }
                    setTagInput('');
                  }}
                  placeholder="Type and press Enter to add"
                  className="flex-1 min-w-[140px] px-2 py-1 outline-none text-gray-900"
                />
              </div>
            </div>
            {tags.length > 0 && (
              <div className="mt-1 text-xs text-gray-500">{tags.length} tag(s) added</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">Select Preset Events (Optional)</label>
            <div className="max-h-40 w-150 overflow-y-auto border border-gray-300 rounded-md p-2 bg-gray-50">
              {Object.entries(presetEvents)
                .filter(([_, eventData]) => {
                  if (!tags || tags.length === 0) return true;
                  const presetTags = (eventData.tags || []).map(t => String(t).toLowerCase());
                  return tags.some(t => presetTags.includes(String(t).toLowerCase()));
                })
                .map(([eventType, eventData]) => (
                <label key={eventType} className="flex items-start space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPresetEvents.includes(eventType)}
                    onChange={() => handlePresetEventToggle(eventType)}
                    className="mt-1 rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{eventData.name}</div>
                    <div className="text-xs text-gray-600">{eventData.description}</div>
                    {eventData.tags && eventData.tags.length > 0 && (
                      <div className="text-xs text-purple-600 mt-1">Tags: {eventData.tags.join(', ')}</div>
                    )}
                    <div className="text-xs text-purple-600 mt-1">
                      Conditions: {eventData.conditions.map(c => `${c.object} ${c.operator} ${c.threshold}`).join(', ')}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {selectedPresetEvents.length > 0 && (
              <div className="mt-2 text-sm text-green-600">
                ✓ {selectedPresetEvents.length} preset event(s) selected - conditions added automatically
              </div>
            )}
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

            <div className="max-h-32 max-w-165 overflow-y-auto border border-gray-200 rounded-md bg-gray-50 p-2">
              <div className="flex flex-wrap gap-2">
                {conditions.map(condition => (
                  <div key={condition.id} className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-300 text-sm">
                    <span className="text-gray-700">{condition.object} {condition.operator} {condition.threshold}</span>
                    <button
                      onClick={() => removeCondition(condition.id)}
                      className="text-red-500 hover:text-red-700 ml-1 text-xs font-bold"
                      title="Remove condition"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {conditions.length === 0 && (
                  <span className="text-gray-500 text-sm italic">No conditions added yet</span>
                )}
              </div>
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
