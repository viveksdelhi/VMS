import React, { useEffect, useState } from 'react';
import { useCustomEvents } from '../../../contexts/CustomEventContext';
import Cookies from 'js-cookie';
import { deviceApi } from '../../../utils/axiosInstance';

const OBJECT_OPTIONS = [
  'Person',
  'Vehicle',
  'Bicycle',
  'Car',
  'Dog',
  'Animal',
  'Bag',
  'Box',
  'Suitcase',
  'Laptop',
  'Chair',
  'TV',
  'Artwork',
  'Group',
  'Children',
  'Adult',
  'Bus',
  'Smoke',
  'Fire',
  'Flame',
  'Steam',
  'Unknown Object',
  'Camera Covered',
  'Camera Moved',
];

const OPERATORS = ['>', '>=', '==', '<', '<='];

const CustomEventForm = ({ editingData, onClose }) => {
  const { refreshEvents } = useCustomEvents();

  // State initialization with editingData
  const [eventName, setEventName] = useState(editingData?.eventName || '');
  const [tags, setTags] = useState(editingData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [selectedPresetEvents, setSelectedPresetEvents] = useState(editingData?.presetEvents || []);
  const [conditions, setConditions] = useState(editingData?.conditions || []);
  const [currentCondition, setCurrentCondition] = useState({
    object: 'Person',
    operator: '>',
    threshold: 1,
  });
  const [step, setStep] = useState(1);
  const [selectedCameras, setSelectedCameras] = useState(editingData?.cameras || []);
  const [scheduling, setScheduling] = useState({
    dateRange: {
      startDate: editingData?.scheduling?.dateRange?.startDate || '',
      endDate: editingData?.scheduling?.dateRange?.endDate || '',
    },
    specificDays: editingData?.scheduling?.specificDays || [],
    timeRange: {
      startTime: editingData?.scheduling?.timeRange?.startTime || '',
      endTime: editingData?.scheduling?.timeRange?.endTime || '',
    },
    isEnabled: !!editingData?.scheduling,
  });

  // New state for preset events from API
  const [presetEventsFromAPI, setPresetEventsFromAPI] = useState([]);
  const [loadingPresets, setLoadingPresets] = useState(false);

  // New state for dynamic cameras
  const [cameraList, setCameraList] = useState([]);
  const [loadingCameras, setLoadingCameras] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Effect to populate form when editingData changes
  useEffect(() => {
    if (editingData) {
      setEventName(editingData.eventName || '');
      setTags(editingData.tags || []);
      setConditions(editingData.conditions || []);
      setSelectedCameras(editingData.cameras || []);

      // Set scheduling data
      if (editingData.scheduling) {
        setScheduling({
          dateRange: {
            startDate: editingData.scheduling.dateRange?.startDate || '',
            endDate: editingData.scheduling.dateRange?.endDate || '',
          },
          specificDays: editingData.scheduling.specificDays || [],
          timeRange: {
            startTime: editingData.scheduling.timeRange?.startTime || '',
            endTime: editingData.scheduling.timeRange?.endTime || '',
          },
          isEnabled: true,
        });
      } else {
        setScheduling({
          dateRange: { startDate: '', endDate: '' },
          specificDays: [],
          timeRange: { startTime: '', endTime: '' },
          isEnabled: false,
        });
      }
    }
  }, [editingData]);

  const userId = Cookies.get('userId');

  // Fetch preset events from API
  useEffect(() => {
    const fetchPresetEvents = async () => {
      setLoadingPresets(true);
      try {
        const response = await deviceApi.get('/event/');
        setPresetEventsFromAPI(response.data.results || []);
      } catch (error) {
        console.error('Error fetching preset events:', error);
        setPresetEventsFromAPI([]);
      } finally {
        setLoadingPresets(false);
      }
    };

    fetchPresetEvents();
  }, []);

  // Fetch cameras dynamically from API
  useEffect(() => {
    const fetchCameras = async () => {
      setLoadingCameras(true);
      setCameraError(null);
      try {
        const response = await deviceApi.get('/Camera/');
        const cameras = response.data.results || response.data || [];

        if (Array.isArray(cameras)) {
          setCameraList(
            cameras.map(camera => ({
              id: camera.id || camera.cameraId,
              name: camera.name || camera.cameraName || `Camera ${camera.id}`,
              status: camera.status,
              location: camera.location,
            }))
          );
        } else {
          console.warn('Unexpected camera data format:', cameras);
          setCameraList([]);
        }
      } catch (error) {
        console.error('Error fetching cameras:', error);
        setCameraError('Failed to load cameras');
        setCameraList([]);
      } finally {
        setLoadingCameras(false);
      }
    };

    fetchCameras();
  }, []);

  // Map preset events from API
  const apiPresetEventsMap = Object.fromEntries(
    presetEventsFromAPI.map(preset => [
      `preset_${preset.id || preset.presetId}`,
      {
        eventName: preset.name || preset.eventName || `Preset ${preset.id}`,
        conditions: preset.conditions || [],
        tags: preset.tags || [],
        description: preset.description || 'Predefined event template',
      },
    ])
  );

  const presetEvents = {
    ...apiPresetEventsMap,
  };

  const addCondition = e => {
    e?.preventDefault();
    e?.stopPropagation();
    if (
      currentCondition.object &&
      currentCondition.operator &&
      currentCondition.threshold !== undefined &&
      currentCondition.threshold >= 0
    ) {
      setConditions(prev => [...prev, { ...currentCondition }]);
      setCurrentCondition({ object: 'Person', operator: '>', threshold: 1 });
    }
  };

  const removeCondition = index => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  // Handle preset event selection
  const handlePresetEventToggle = eventType => {
    setSelectedPresetEvents(prev => {
      if (prev.includes(eventType)) {
        const presetEvent = presetEvents[eventType];
        const newConditions = conditions.filter(
          condition =>
            !presetEvent.conditions.some(
              presetCondition =>
                presetCondition.object === condition.object &&
                presetCondition.operator === condition.operator &&
                presetCondition.threshold === condition.threshold
            )
        );
        setConditions(newConditions);
        return prev.filter(type => type !== eventType);
      } else {
        const presetEvent = presetEvents[eventType];
        const newConditions = [...conditions];

        presetEvent.conditions.forEach(presetCondition => {
          const exists = newConditions.some(
            condition =>
              condition.object === presetCondition.object &&
              condition.operator === presetCondition.operator &&
              condition.threshold === presetCondition.threshold
          );

          if (!exists) {
            newConditions.push({
              ...presetCondition,
            });
          }
        });

        setConditions(newConditions);
        return [...prev, eventType];
      }
    });
  };

  const toggleCamera = cameraId => {
    setSelectedCameras(prev =>
      prev.includes(cameraId) ? prev.filter(id => id !== cameraId) : [...prev, cameraId]
    );
  };

  const toggleSpecificDay = day => {
    setScheduling(prev => ({
      ...prev,
      specificDays: prev.specificDays.includes(day)
        ? prev.specificDays.filter(d => d !== day)
        : [...prev.specificDays, day],
    }));
  };

  const updateScheduling = (field, value) => {
    setScheduling(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSchedulingNested = (parentField, childField, value) => {
    setScheduling(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value,
      },
    }));
  };

  const handleNext = () => {
    if (step === 1 && eventName.trim() && conditions.length > 0) {
      setStep(2);
    } else if (step === 2 && selectedCameras.length > 0) {
      setStep(3);
    }
  };

  // Format data according to API specification
  const formatEventData = () => {
    const eventData = {
      eventName: eventName.trim(),
      tags: tags,
      conditions: conditions.map(condition => ({
        object: condition.object,
        operator: condition.operator,
        threshold: condition.threshold,
      })),
      cameras: selectedCameras,
    };

    // Add scheduling only if enabled and has some configuration
    if (scheduling.isEnabled) {
      eventData.scheduling = {
        dateRange: {
          startDate: scheduling.dateRange.startDate || '',
          endDate: scheduling.dateRange.endDate || '',
        },
        specificDays: scheduling.specificDays,
        timeRange: {
          startTime: scheduling.timeRange.startTime || '',
          endTime: scheduling.timeRange.endTime || '',
        },
        isEnabled: true,
      };
    }

    return eventData;
  };

  const handleSave = async () => {
    if (step === 3) {
      const eventData = formatEventData();

      try {
        if (editingData) {
          // UPDATE existing event
          await deviceApi.put(
            `/event/${editingData.eventId}/`,
            { userId: userId, ...eventData },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Event updated successfully');
        } else {
          // CREATE new event
          await deviceApi.post(
            `/event/`,
            { userId: userId, ...eventData },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Event created successfully');
        }

        // Refresh events in context - this will update the sidebar
        if (refreshEvents) {
          await refreshEvents();
        }

        // Notify other components
        window.dispatchEvent(new CustomEvent('customEventsUpdated'));

        onClose();
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
  };

  // Reset form when modal opens fresh (no editingData)
  useEffect(() => {
    if (!editingData) {
      setEventName('');
      setTags([]);
      setTagInput('');
      setSelectedPresetEvents([]);
      setConditions([]);
      setCurrentCondition({ object: 'Person', operator: '>', threshold: 1 });
      setStep(1);
      setSelectedCameras([]);
      setScheduling({
        dateRange: { startDate: '', endDate: '' },
        specificDays: [],
        timeRange: { startTime: '', endTime: '' },
        isEnabled: false,
      });
    }
  }, [editingData]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white">
      {/* Progress Indicator */}
      <div className="flex justify-center mb-6 pt-0">
        <div className="flex items-center">
          {[1, 2, 3].map(stepNumber => (
            <React.Fragment key={stepNumber}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === stepNumber
                    ? 'bg-purple-500 text-white'
                    : step > stepNumber
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 ${step > stepNumber ? 'bg-green-500' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mb-0 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {editingData ? 'Edit Custom Event' : 'Create Custom Event'}
        </h2>
        <p className="text-gray-600 mt-2">
          {step === 1 && 'Define event conditions'}
          {step === 2 && 'Select cameras'}
          {step === 3 && 'Configure scheduling'}
        </p>
      </div>

      {step === 1 && (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Event Name *</label>
            <input
              name="eventName"
              type="text"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              placeholder="Enter custom event name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Tags (Optional)</label>
            <div className="w-full px-2 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-purple-500 bg-white">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 px-2 py-1 rounded-full border border-purple-200 text-xs"
                  >
                    {tag}
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
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const raw = tagInput.trim().replace(/,$/, '');
                      if (raw) {
                        const newTags = raw
                          .split(',')
                          .map(s => s.trim())
                          .filter(Boolean);
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
                      const newTags = raw
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean);
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

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Select Preset Events (Optional)
            </label>

            {loadingPresets ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading preset events...</p>
              </div>
            ) : (
              <div className="max-h-40 border border-gray-300 rounded-md p-2 bg-gray-50">
                {Object.entries(presetEvents).length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No preset events available</div>
                ) : (
                  Object.entries(presetEvents)
                    .filter(([_, eventData]) => {
                      if (!tags || tags.length === 0) return true;
                      const presetTags = (eventData.tags || []).map(t => String(t).toLowerCase());
                      return tags.some(t => presetTags.includes(String(t).toLowerCase()));
                    })
                    .map(([eventType, eventData]) => (
                      <label
                        key={eventType}
                        className="flex items-start space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPresetEvents.includes(eventType)}
                          onChange={() => handlePresetEventToggle(eventType)}
                          className="mt-1 rounded"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {eventData.eventName}
                          </div>
                          {eventData.description && (
                            <div className="text-xs text-gray-600">{eventData.description}</div>
                          )}
                          {eventData.tags && eventData.tags.length > 0 && (
                            <div className="text-xs text-purple-600 mt-1">
                              Tags: {eventData.tags.join(', ')}
                            </div>
                          )}
                          <div className="text-xs text-purple-600 mt-1">
                            Conditions:{' '}
                            {eventData.conditions
                              .map(c => `${c.object} ${c.operator} ${c.threshold}`)
                              .join(', ')}
                          </div>
                        </div>
                      </label>
                    ))
                )}
              </div>
            )}

            {selectedPresetEvents.length > 0 && (
              <div className="mt-2 text-sm text-green-600">
                ✓ {selectedPresetEvents.length} preset event(s) selected - conditions added
                automatically
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {editingData ? 'Edit Conditions' : 'Add Conditions'} *
            </label>
            <div className="flex gap-2 mb-3">
              <select
                value={currentCondition.object}
                onChange={e => setCurrentCondition({ ...currentCondition, object: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              >
                {OBJECT_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <select
                value={currentCondition.operator}
                onChange={e =>
                  setCurrentCondition({ ...currentCondition, operator: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              >
                {OPERATORS.map(op => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={currentCondition.threshold}
                onChange={e =>
                  setCurrentCondition({
                    ...currentCondition,
                    threshold: parseInt(e.target.value) || 0,
                  })
                }
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCondition(e);
                  }
                }}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                min="0"
              />

              <button
                type="button"
                onClick={addCondition}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="border border-gray-200 rounded-md bg-gray-50 p-3">
              <div className="flex flex-wrap gap-2">
                {conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-300 text-sm"
                  >
                    <span className="text-gray-700">
                      {condition.object} {condition.operator} {condition.threshold}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCondition(index)}
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
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!eventName.trim() || conditions.length === 0}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-700">
            {editingData ? 'Update Cameras for' : 'Select Cameras for'} "{eventName}"
          </h3>

          {loadingCameras ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading cameras...</p>
            </div>
          ) : cameraError ? (
            <div className="text-center py-4">
              <div className="text-red-500 mb-2">{cameraError}</div>
              <p className="text-gray-500 text-sm">Please try again later</p>
            </div>
          ) : cameraList.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No cameras available</p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {cameraList.map(camera => (
                <label
                  key={camera.id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCameras.includes(camera.id)}
                    onChange={() => toggleCamera(camera.id)}
                    className="rounded text-purple-500"
                  />
                  <div className="flex-1">
                    <span className="text-gray-900 font-medium">{camera.name}</span>
                    {camera.location && (
                      <span className="text-gray-500 text-sm ml-2">({camera.location})</span>
                    )}
                    {camera.status && (
                      <span
                        className={`text-xs ml-2 px-2 py-1 rounded ${
                          camera.status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {camera.status}
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={selectedCameras.length === 0}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-700">
            Configure Event Scheduling (Optional)
          </h3>

          <div className="mb-6">
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={scheduling.isEnabled}
                onChange={e => updateScheduling('isEnabled', e.target.checked)}
                className="rounded text-purple-500"
              />
              <span className="text-gray-900 font-medium">Enable scheduling for this event</span>
            </label>
          </div>

          {scheduling.isEnabled && (
            <div className="space-y-6">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Date Range (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={scheduling.dateRange.startDate}
                      onChange={e =>
                        updateSchedulingNested('dateRange', 'startDate', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      value={scheduling.dateRange.endDate}
                      onChange={e => updateSchedulingNested('dateRange', 'endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Specific Days */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Specific Days (Optional)
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {[
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ].map(day => (
                    <label
                      key={day}
                      className="flex flex-col items-center space-y-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={scheduling.specificDays.includes(day)}
                        onChange={() => toggleSpecificDay(day)}
                        className="rounded text-purple-500"
                      />
                      <span className="text-xs text-gray-700">{day.substring(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Time Range (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={scheduling.timeRange.startTime}
                      onChange={e =>
                        updateSchedulingNested('timeRange', 'startTime', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Time</label>
                    <input
                      type="time"
                      value={scheduling.timeRange.endTime}
                      onChange={e => updateSchedulingNested('timeRange', 'endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Summary */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Schedule Summary</h4>
                <div className="text-sm text-purple-700 space-y-1">
                  {scheduling.dateRange.startDate || scheduling.dateRange.endDate ? (
                    <p>
                      Date Range: {scheduling.dateRange.startDate || 'No start date'} to{' '}
                      {scheduling.dateRange.endDate || 'No end date'}
                    </p>
                  ) : null}
                  {scheduling.specificDays.length > 0 && (
                    <p>Days: {scheduling.specificDays.join(', ')}</p>
                  )}
                  {scheduling.timeRange.startTime || scheduling.timeRange.endTime ? (
                    <p>
                      Time: {scheduling.timeRange.startTime || 'No start time'} to{' '}
                      {scheduling.timeRange.endTime || 'No end time'}
                    </p>
                  ) : null}
                  {!scheduling.dateRange.startDate &&
                    !scheduling.dateRange.endDate &&
                    scheduling.specificDays.length === 0 &&
                    !scheduling.timeRange.startTime &&
                    !scheduling.timeRange.endTime && (
                      <p className="text-gray-500">No specific scheduling constraints set</p>
                    )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              {editingData ? 'Update Custom Event' : 'Save Custom Event'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomEventForm;
