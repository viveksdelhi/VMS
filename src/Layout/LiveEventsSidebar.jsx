import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { message, Skeleton, Badge, Modal, Image } from "antd";
import { deviceApi } from "../utils/axiosInstance";
import { ANALYTICS_API_URL } from "../config";
import { MdClose, MdNotificationsActive, MdNotificationsOff } from "react-icons/md";

const LiveEventsSidebar = ({
  isCollapsed = true,
  onCollapseChange = () => {},
}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [wasOpenedByHover, setWasOpenedByHover] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const userId = Cookies.get("userId");
  const intervalRef = useRef(null);

  const fetchLiveEvents = async () => {
    if (!userId || isPaused) return;
    
    try {
      setLoading(true);
      const res = await deviceApi.get(`/CameraAlert/`, {
        params: {
          userid: userId,
          page: 1,
          pageSize: 20, // Show more events in sidebar
          search: "",
          camera_id: "",
        },
      });
      setEvents(res.data.results || []);
    } catch (error) {
      console.error("Error fetching live events:", error);
      // Don't show error message on every failed fetch to avoid spam
      if (!intervalRef.current) {
        message.error("Failed to fetch live events");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchLiveEvents();
    }
  }, [userId]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (userId && !isPaused) {
      intervalRef.current = setInterval(() => {
        fetchLiveEvents();
      }, 10000); // Refresh every 10 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [userId, isPaused]);

  const getEventTypeColor = (objectName) => {
    if (!objectName) return "bg-gray-200 text-gray-700";
    
    const name = objectName.toLowerCase();
    if (name.includes("fire")) return "bg-red-200 text-red-700 border-red-400";
    if (name.includes("person") || name.includes("human")) return "bg-purple-200 text-blue-700 border-purple-400";
    if (name.includes("vehicle") || name.includes("car")) return "bg-yellow-200 text-yellow-700 border-yellow-400";
    if (name.includes("rodent") || name.includes("animal")) return "bg-orange-200 text-orange-700 border-orange-400";
    return "bg-purple-200 text-purple-700 border-purple-400";
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const handleMouseEnter = () => {
    if (isCollapsed) {
      setWasOpenedByHover(true);
      onCollapseChange(false);
    }
  };

  const handleClose = () => {
    setWasOpenedByHover(false);
    onCollapseChange(true);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      className={`
        fixed right-0 top-16 h-full z-40
        bg-white shadow-2xl border-l border-t border-2 border-gray-200
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-12" : "w-80"}
        flex flex-col
        hidden md:flex
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <MdNotificationsActive className="text-purple-600 text-xl" />
            <h2 className="text-lg font-semibold text-gray-800">Live Events</h2>
            {events.length > 0 && (
              <Badge count={events.length} showZero={false} className="ml-2" />
            )}
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {!isCollapsed && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-md hover:bg-purple-200 transition-colors"
              title={isPaused ? "Resume updates" : "Pause updates"}
            >
              {isPaused ? (
                <MdNotificationsOff className="text-gray-600 text-lg" />
              ) : (
                <MdNotificationsActive className="text-purple-600 text-lg animate-pulse" />
              )}
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-1.5 rounded-md hover:bg-purple-200 transition-colors"
            title="Close sidebar"
          >
            <MdClose className="text-gray-600 text-lg" />
          </button>
        </div>
      </div>

      {/* Events List */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {loading && events.length === 0 ? (
            <div className="space-y-3">
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-md bg-gray-50 border-l-4 border-purple-200 shadow-sm"
                  >
                    <Skeleton active title={false} paragraph={{ rows: 2 }} />
                  </div>
                ))}
            </div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className={`
                  p-3 rounded-md border-l-4 shadow-sm
                  hover:shadow-md transition-all cursor-pointer
                  ${getEventTypeColor(event.objectName)}
                `}
                onClick={() => {
                  setSelectedEvent(event);
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {event.camera_name || "Unknown Camera"}
                    </p>
                    <p className="text-xs font-semibold mt-1 text-gray-700">
                      {event.objectName || "No object detected"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(event.regDate)}
                      </p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">
                        {new Date(event.regDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/80 shadow-inner flex-shrink-0">
                    #{event.id}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <MdNotificationsOff className="text-gray-300 text-4xl mb-2" />
              <p className="text-gray-500 text-sm">No live events</p>
              <p className="text-gray-400 text-xs mt-1">
                Events will appear here as they occur
              </p>
            </div>
          )}
        </div>
      )}

      {/* Collapsed View */}
      {isCollapsed && (
        <div className="flex flex-col items-center justify-center h-full p-2">
          <div className="relative p-2 rounded-md hover:bg-purple-100 transition-colors">
            <MdNotificationsActive className="text-purple-600 text-2xl" />
            {events.length > 0 && (
              <Badge
                count={events.length}
                className="absolute -top-1 -right-1"
              />
            )}
          </div>
          {isPaused && (
            <div className="mt-2 w-2 h-2 rounded-full bg-yellow-400" title="Updates paused" />
          )}
        </div>
      )}

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {isPaused ? "Updates paused" : "Auto-refreshing every 10s"}
            </span>
            <span>{events.length} events</span>
          </div>
        </div>
      )}

      <Modal
        open={!!selectedEvent}
        onCancel={() => setSelectedEvent(null)}
        footer={null}
        centered
        width={520}
        destroyOnClose
        title={
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-gray-800">
              Live Event #{selectedEvent?.id}
            </span>
            <span className="text-xs text-gray-500">
              {selectedEvent
                ? new Date(selectedEvent.regDate).toLocaleString()
                : ""}
            </span>
          </div>
        }
      >
        {selectedEvent && (
          <div className="space-y-4">
            {selectedEvent.framePath && (
              <Image
                src={`${ANALYTICS_API_URL}${selectedEvent.framePath}`}
                alt="Event frame"
                className="rounded-md border"
                fallback="https://via.placeholder.com/480x270?text=No+Image"
              />
            )}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Camera</p>
                <p className="font-medium text-gray-800">
                  {selectedEvent.camera_name || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Location</p>
                <p className="font-medium text-gray-800">
                  {selectedEvent.camera_location || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Object</p>
                <p className="font-medium text-gray-800">
                  {selectedEvent.objectName || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Object Count</p>
                <p className="font-medium text-gray-800">
                  {selectedEvent.objectCount ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium text-gray-800">
                  {selectedEvent.alertStatus || selectedEvent.status || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Camera ID</p>
                <p className="font-medium text-gray-800">
                  {selectedEvent.cameraId ?? "-"}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LiveEventsSidebar;

