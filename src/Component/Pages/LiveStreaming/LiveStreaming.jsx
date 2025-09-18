import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, Select, Space } from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter, DragOverlay } from "@dnd-kit/core";
import HlsPlayer from "react-hls-player";
import { STREAM_API_URL } from "../../../config";
import { CameraSidebar } from "./CameraSidebar";
import CameraGrid from "./CameraGrid";

const { Option } = Select;

const LiveGrid = () => {
  const [gridSize, setGridSize] = useState(2);
  const [zoomCam, setZoomCam] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gridCams, setGridCams] = useState(() => {
    // Load from localStorage on initial render
    const saved = localStorage.getItem("gridCams");
    return saved ? JSON.parse(saved) : Array(16).fill(null);
  });
  const [activeCam, setActiveCam] = useState(null);

  const gridRef = useRef(null);
  const sensors = useSensors(useSensor(PointerSensor));

  // Save gridCams to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gridCams", JSON.stringify(gridCams));
  }, [gridCams]);

  // Listen to fullscreen changes (e.g., Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      gridRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleRemove = (i) => {
    const updated = [...gridCams];
    updated[i] = null;
    setGridCams(updated);
  };

  const onDragStart = (event) => {
    setActiveCam(event.active.data.current.cam);
  };

  const onDragEnd = (event) => {
    if (event.over && event.over.id.startsWith("cell-")) {
      const index = parseInt(event.over.id.split("-")[1], 10);
      const cam = event.active.data.current.cam;
      if (!cam) return;

      const updated = [...gridCams];
      updated[index] = cam;
      setGridCams(updated); // automatically saved to localStorage
    }
    setActiveCam(null);
  };
  const staticStreams = [
    { id: "1",  name: "Came1",  zone: "Zone A", src: "http://14.195.152.244:7015/stream/1576/stream.m3u8" },
    { id: "2",  name: "Camera 2",  zone: "Zone A", src: "http://14.195.152.244:7015/stream/1575/stream.m3u8" },
    { id: "3",  name: "Camera 3",  zone: "Zone B", src: "http://14.195.152.244:7015/stream/1574/stream.m3u8" },
    { id: "4",  name: "Camera 4",  zone: "Zone B", src: "http://14.195.152.244:7015/stream/1573/stream.m3u8" },
    // { id: "5",  name: "Camera 5",  zone: "Zone C", src: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8" },
    // { id: "6",  name: "Camera 6",  zone: "Zone C", src: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8" },
    // { id: "7",  name: "Camera 7",  zone: "Zone D", src: "https://test-streams.mux.dev/bbb-abr/bbb.m3u8" },
    // { id: "8",  name: "Camera 8",  zone: "Zone D", src: "https://mnmedias.api.telequebec.tv/m3u8/29880.m3u8" },
  ];
  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="flex h-screen bg-white">
        <CameraSidebar /> {/* fetch cameras from API */}

        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-purple-700">Live Streaming</h2>
            <Space>
              <Button
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
              <Select value={gridSize} style={{ width: 120 }} onChange={setGridSize}>
                <Option value={2}>2 x 2</Option>
                <Option value={3}>3 x 3</Option>
                <Option value={4}>4 x 4</Option>
              </Select>
            </Space>
          </div>

          {/* Grid */}
          <CameraGrid
            gridSize={gridSize}
            gridCams={staticStreams}
            onZoom={setZoomCam}
            onRemove={handleRemove}
            gridRef={gridRef}
          />
        </div>
      </div>

      {/* Zoom Modal */}
      <Modal
        open={!!zoomCam}
        footer={null}
        width="80%"
        centered
        onCancel={() => setZoomCam(null)}
        bodyStyle={{ padding: 0, background: "black" }}
      >
        {zoomCam && (
          <HlsPlayer
            src={`${STREAM_API_URL}/Streaming/stream/${zoomCam.id}/stream.m3u8`}
            autoPlay
            controls
            muted
            width="100%"
            height="80vh"
            className="object-cover"
          />
        )}
      </Modal>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeCam && (
          <div className="px-3 py-2 bg-black border border-purple-300 shadow-md rounded">
            {activeCam.name}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default LiveGrid;
