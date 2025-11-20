import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Card, Button, Tag, Popconfirm, message, Modal } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import CustomEventForm from "./CustomEventForm";
import { deviceApi } from "../../../utils/axiosInstance";
import { useCustomEvents } from "../../../contexts/CustomEventContext";

const CustomEventManagement = () => {
  const [events, setEvents] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const { refreshEvents } = useCustomEvents();

  const userId = Cookies.get("userId");

  const fetchEvents = async () => {
    try {
      const res = await deviceApi.get(`/event/?userid=${userId}`);
      setEvents(res.data.results || []);
    } catch (err) {
      message.error("Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      await deviceApi.delete(`/event/${eventId}/`);
      message.success("Event deleted");

      // Refresh all event data
      fetchEvents(); // Refresh custom events
      refreshEvents(); // Sidebar update
    } catch (err) {
      message.error("Delete failed");
    }
  };

  return (
    <div className="p-8">
      {/* Page Heading */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Custom Event Management
          </h1>

          <Button
            size="large"
            icon={<PlusOutlined />}
            style={{
              background: "#B17EF3",
              borderColor: "#B17EF3",
              color: "white",
              padding: "0 20px",
              height: "45px",
              borderRadius: "12px",
              boxShadow: "0 6px 14px rgba(177, 126, 243, 0.4)",
            }}
            onClick={() => {
              setEditingEvent(null);
              setOpenForm(true);
            }}
          >
            Add Custom Event
          </Button>
        </div>

        <p className="text-gray-500 mt-1">
          Manage all your video processing and AI detection events.
        </p>
      </div>

      {/* EVENT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {events.map((ev) => (
          <Card
            key={ev.eventId}
            className="relative border border-purple-200 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl bg-white/95 backdrop-blur-xl"
          >
            {/* Card Title */}
            <div className="flex items-center gap-3 mb-4">
              <VideoCameraOutlined
                className="text-2xl"
                style={{ color: "#B17EF3" }}
              />
              <h2 className="text-xl font-semibold text-gray-900">
                {ev.eventName}
              </h2>
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  style={{
                    borderRadius: "50%",
                    borderColor: "#B17EF3",
                    color: "#B17EF3",
                  }}
                  onClick={() => {
                    setEditingEvent(ev);
                    setOpenForm(true);
                  }}
                />

                <Popconfirm
                  title="Delete this event?"
                  onConfirm={() => handleDelete(ev.eventId)}
                >
                  <Button
                    size="small"
                    danger
                    style={{
                      borderRadius: "50%",
                      borderColor: "#ff4d4f",
                    }}
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-1 mt-1">
              <p className="font-medium">Tags:</p>
              {ev.tags?.map((tag, i) => (
                <Tag key={i} color="#B17EF3" className="text-white">
                  {tag}
                </Tag>
              ))}
            </div>

            {/* Conditions */}
            <div className="mb-3">
              <p className="font-medium">Conditions:</p>
              {ev.conditions?.map((cond, i) => (
                <div key={i} className="space-x-2 mt-1">
                  <Tag color="purple">{cond.object}</Tag>
                  <strong>{cond.operator}</strong>
                  <Tag color="green">{cond.threshold}</Tag>
                </div>
              ))}
            </div>

            {/* Cameras */}
            <div className="mb-4">
              <p className="font-medium">Cameras:</p>
              <Tag color="volcano">{ev.cameras?.join(", ")}</Tag>
            </div>

            {/* Schedule */}
            <div>
              <p className="font-medium mb-1">Schedule:</p>
              <div className="text-gray-600 text-sm space-y-1">
                <p>
                  📅 {ev.scheduling?.dateRange?.startDate} →{" "}
                  {ev.scheduling?.dateRange?.endDate}
                </p>
                <p>
                  ⏰ {ev.scheduling?.timeRange?.startTime} →{" "}
                  {ev.scheduling?.timeRange?.endTime}
                </p>
                <p>🗓 Days: {ev.scheduling?.specificDays?.join(", ") || "-"}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* MODAL - Custom Event Form */}
      <Modal
        open={openForm}
        footer={null}
        width={750}
        onCancel={() => {
          setOpenForm(false);
          setEditingEvent(null);
        }}
        destroyOnClose
        style={{ top: 20 }}
        styles={{
          body: { 
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            padding: '20px'
          }
        }}
      >
        <CustomEventForm
          editingData={editingEvent}
          onClose={() => {
            setOpenForm(false);
            setEditingEvent(null);
            fetchEvents();
          }}
        />
      </Modal>
    </div>
  );
};

export default CustomEventManagement;
