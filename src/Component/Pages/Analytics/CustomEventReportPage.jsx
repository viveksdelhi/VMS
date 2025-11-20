import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomEvents } from '../../../contexts/CustomEventContext';
import { slugify } from '../../../utils/slugify';

const CustomEventReportPage = ({ eventSlug: propEventSlug }) => {
  // Get eventSlug from props or URL params as fallback
  const urlParams = useParams();
  const eventSlug = propEventSlug || urlParams.eventSlug;
  const { customEvents } = useCustomEvents();
  const navigate = useNavigate();

  // State for toggling sections
  const [showTags, setShowTags] = useState(true);
  const [showConditions, setShowConditions] = useState(true);
  const [showCameras, setShowCameras] = useState(true);
  const [showScheduling, setShowScheduling] = useState(true);

  // Helper function to find custom event by slug
  const findCustomEventBySlug = slug => {
    if (!customEvents || !Array.isArray(customEvents)) return null;

    return customEvents.find(event => {
      const eventNameSlug = slugify(event.eventName || `custom-event-${event.eventId}`);
      return eventNameSlug === slug;
    });
  };

  // Find the custom event by slug
  const customEvent = findCustomEventBySlug(eventSlug);

  if (!customEvent) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Custom Event Not Found</h2>
          <p className="text-gray-600">The requested custom event could not be found.</p>
          <p className="text-sm text-gray-500 mt-2">Looking for slug: {eventSlug}</p>
          <button
            onClick={() => navigate('/analytics')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Back to Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#9357c9]">{customEvent.eventName}</h2>
      </div>

      {/* Custom Event Details Section */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-blue-800">Event Configuration</h3>
            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              {customEvent.eventName}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowTags(!showTags);
                setShowConditions(!showConditions);
                setShowCameras(!showCameras);
                setShowScheduling(!showScheduling);
              }}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {showTags && showConditions && showCameras && showScheduling
                ? 'Hide All'
                : 'Show All'}
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-3">
          Custom event detection configuration with specific conditions and triggers.
        </p>

        <div className="space-y-4">
          {/* Tags Section */}
          {customEvent.tags && customEvent.tags.length > 0 && (
            <div className="border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg">
                <h4 className="text-sm font-medium text-gray-800">Tags</h4>
                <button
                  onClick={() => setShowTags(!showTags)}
                  className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  {showTags ? 'Hide' : 'Show'}
                </button>
              </div>
              {showTags && (
                <div className="p-3">
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
            </div>
          )}

          {/* Trigger Conditions */}
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg">
              <h4 className="text-sm font-medium text-gray-800">Trigger Conditions</h4>
              <button
                onClick={() => setShowConditions(!showConditions)}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                {showConditions ? 'Hide' : 'Show'}
              </button>
            </div>
            {showConditions && customEvent.conditions && (
              <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {customEvent.conditions.map((condition, index) => (
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
            )}
          </div>

          {/* Assigned Cameras */}
          {customEvent.cameras && customEvent.cameras.length > 0 && (
            <div className="border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg">
                <h4 className="text-sm font-medium text-gray-800">Assigned Cameras</h4>
                <button
                  onClick={() => setShowCameras(!showCameras)}
                  className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  {showCameras ? 'Hide' : 'Show'}
                </button>
              </div>
              {showCameras && (
                <div className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {customEvent.cameras.map(cameraId => (
                      <span
                        key={cameraId}
                        className="inline-flex items-center bg-green-50 text-green-800 px-3 py-1 rounded-md text-sm border border-green-200"
                      >
                        Camera {cameraId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Scheduling Information */}
          {customEvent.scheduling && (
            <div className="border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg">
                <h4 className="text-sm font-medium text-gray-800">Scheduling</h4>
                <button
                  onClick={() => setShowScheduling(!showScheduling)}
                  className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  {showScheduling ? 'Hide' : 'Show'}
                </button>
              </div>
              {showScheduling && (
                <div className="p-3">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomEventReportPage;
