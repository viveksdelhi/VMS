
import React, { useState } from "react";
import {
  Card,
  Modal,
  DatePicker,
  Select,
  Button,
  Tag,
  Empty,
  Badge,
} from "antd";
import { motion } from "framer-motion";
import {
  PlayCircleOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const RecordingViewer = () => {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentMeta, setCurrentMeta] = useState(null);

  // Cameras
  const cameras = [
    { id: 1, name: "Entrance Camera" },
    { id: 2, name: "Parking Lot" },
    { id: 3, name: "Lobby" },
    { id: 4, name: "Warehouse" },
    { id: 5, name: "Back Gate" },
    { id: 6, name: "Main Road" },
  ];

  // Demo MP4 recordings
  const recordings = [
    {
      id: 1,
      camera: 1,
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      start_time: "2025-08-18T10:30:00",
      duration: 5,
      thumbnail: "https://picsum.photos/seed/rec1/400/250",
    },
    {
      id: 2,
      camera: 2,
      url: "https://www.w3schools.com/html/movie.mp4",
      start_time: "2025-08-17T14:00:00",
      duration: 8,
      thumbnail: "https://picsum.photos/seed/rec2/400/250",
    },
    {
      id: 3,
      camera: 3,
      url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
      start_time: "2025-08-17T18:30:00",
      duration: 12,
      thumbnail: "https://picsum.photos/seed/rec3/400/250",
    },
    {
      id: 4,
      camera: 4,
      url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_5mb.mp4",
      start_time: "2025-08-16T09:00:00",
      duration: 20,
      thumbnail: "https://picsum.photos/seed/rec4/400/250",
    },
    {
      id: 5,
      camera: 5,
      url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_10mb.mp4",
      start_time: "2025-08-15T21:45:00",
      duration: 15,
      thumbnail: "https://picsum.photos/seed/rec5/400/250",
    },
    {
      id: 6,
      camera: 6,
      url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_20mb.mp4",
      start_time: "2025-08-14T20:15:00",
      duration: 25,
      thumbnail: "https://picsum.photos/seed/rec6/400/250",
    },
  ];

  // Filter Logic
  const getFiltered = () => {
    let filtered = recordings;
    if (selectedCamera) {
      filtered = filtered.filter((r) => r.camera === selectedCamera);
    }
    if (dateRange.length === 2) {
      filtered = filtered.filter(
        (r) =>
          dayjs(r.start_time).isAfter(dateRange[0]) &&
          dayjs(r.start_time).isBefore(dateRange[1])
      );
    }
    return filtered;
  };

  const resetFilters = () => {
    setSelectedCamera(null);
    setDateRange([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* Filters */}
      <Card className="mb-8 shadow-lg border border-purple-100 rounded-xl">
        <div className="flex flex-wrap gap-4 items-center">
          <Select
            placeholder="Select Camera"
            style={{ minWidth: 200 }}
            value={selectedCamera}
            onChange={(val) => setSelectedCamera(val)}
            allowClear
          >
            {cameras.map((cam) => (
              <Option key={cam.id} value={cam.id}>
                {cam.name}
              </Option>
            ))}
          </Select>
          <RangePicker value={dateRange} onChange={(val) => setDateRange(val)} />
          <Button
            icon={<ReloadOutlined />}
            onClick={resetFilters}
            className="border-gray-300"
          >
            Reset
          </Button>
        </div>

        {/* Active Filters */}
        <div className="mt-3 space-x-2">
          {selectedCamera && (
            <Tag color="purple">
              Camera: {cameras.find((c) => c.id === selectedCamera)?.name}
            </Tag>
          )}
          {dateRange.length === 2 && (
            <Tag color="blue">
              {dateRange[0].format("MMM D")} - {dateRange[1].format("MMM D")}
            </Tag>
          )}
        </div>
      </Card>

      {/* Recording Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFiltered().length > 0 ? (
          getFiltered().map((rec) => (
            <motion.div
              key={rec.id}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer"
              onClick={() => {
                setCurrentVideo(rec.url);
                setCurrentMeta(rec);
                setVisible(true);
              }}
            >
              <Card
                hoverable
                cover={
                  <div className="relative group">
                    <img
                      alt="Recording Thumbnail"
                      src={rec.thumbnail}
                      className="h-44 w-full object-cover rounded-t-lg"
                    />
                    {/* Play button only on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <div className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition">
                        <PlayCircleOutlined className="text-white text-3xl" />
                      </div>
                    </div>
                  </div>
                }
                className="shadow-md rounded-xl overflow-hidden border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <Badge
                    color="purple"
                    text={cameras.find((c) => c.id === rec.camera)?.name}
                  />
                  <Tag color="blue" icon={<ClockCircleOutlined />}>
                    {rec.duration} mins
                  </Tag>
                </div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {dayjs(rec.start_time).format("MMM D, YYYY HH:mm")}
                </h3>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex justify-center py-12">
            <Empty description="No recordings found" />
          </div>
        )}
      </div>

      {/* Video Modal */}
      <Modal
        title="Recording Playback"
        open={visible}
        footer={null}
        onCancel={() => {
          setVisible(false);
          setCurrentVideo(null); // ✅ reset so video stops
        }}
        centered
        width={800}
        destroyOnClose
      >
        {currentVideo && (
          <>
            <div className="mb-3">
              <p className="text-sm text-gray-700">
                <VideoCameraOutlined className="mr-1" />
                <strong>Camera:</strong>{" "}
                {cameras.find((c) => c.id === currentMeta?.camera)?.name}
              </p>
              <p className="text-sm text-gray-700">
                <ClockCircleOutlined className="mr-1" />
                <strong>Date:</strong>{" "}
                {dayjs(currentMeta?.start_time).format("MMM D, YYYY HH:mm")}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Duration:</strong> {currentMeta?.duration} mins
              </p>
            </div>
            <video
              src={currentVideo}
              autoPlay
              controls
              width="100%"
              height="450px"
              style={{ borderRadius: "8px" }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default RecordingViewer;
