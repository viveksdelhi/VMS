import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, Select, message, Space } from "antd";
import {
  ReloadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";
import HlsPlayer from "react-hls-player";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";

import { CameraSidebar, staticStreams } from "./CameraSidebar";
import CameraGrid from "./CameraGrid";

const { Option } = Select;

const LiveGrid = () => {
  const [gridSize, setGridSize] = useState(2);
  const [zoomCam, setZoomCam] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ✅ load from localStorage, or default empty grid
  const [gridCams, setGridCams] = useState(() => {
    const saved = localStorage.getItem("gridCams");
    return saved ? JSON.parse(saved) : Array(16).fill(null);
  });

  const [activeCam, setActiveCam] = useState(null);
  const gridRef = useRef(null);

  const sensors = useSensors(useSensor(PointerSensor));

  // ✅ Save to localStorage whenever grid changes
  useEffect(() => {
    localStorage.setItem("gridCams", JSON.stringify(gridCams));
  }, [gridCams]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    message.success("Streams refreshed");
  };

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
    const cam = staticStreams.find((c) => c.id === event.active.id);
    setActiveCam(cam);
  };

  const onDragEnd = (event) => {
    if (event.over && event.over.id.startsWith("cell-")) {
      const index = parseInt(event.over.id.split("-")[1], 10);
      const cam = staticStreams.find((c) => c.id === event.active.id);
      if (!cam) return;

      const updated = [...gridCams];
      updated[index] = cam;
      setGridCams(updated);
      message.success(`${cam.name} added to slot ${index + 1}`);
    }
    setActiveCam(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <CameraSidebar />

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Controls */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-purple-700">
              Live Streaming
            </h2>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                Refresh All
              </Button>
              <Button
                icon={
                  isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
                }
                onClick={toggleFullscreen}
              >
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
              <Select
                value={gridSize}
                style={{ width: 120 }}
                onChange={setGridSize}
              >
                <Option value={2}>2 x 2</Option>
                <Option value={3}>3 x 3</Option>
                <Option value={4}>4 x 4</Option>
              </Select>
            </Space>
          </div>

          {/* Grid */}
          <CameraGrid
            gridSize={gridSize}
            gridCams={gridCams}
            onZoom={setZoomCam}
            onRemove={handleRemove}
            refreshKey={refreshKey}
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
            src={zoomCam.src}
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
        {activeCam ? (
          <div className="px-3 py-2 bg-white border border-purple-300 shadow-md rounded">
            {activeCam.name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default LiveGrid;



// import React, { useState, useRef } from "react";
// import { Button, Modal, Select, message, Space } from "antd";
// import { ZoomInOutlined, ReloadOutlined, FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
// import HlsPlayer from "react-hls-player";
// import { motion, AnimatePresence } from "framer-motion";

// const { Option } = Select;

// const staticStreams = [
//   { id: 1, name: "Camera 1", src: "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8" },
//   { id: 2, name: "Camera 2", src: "https://content.jwplatform.com/manifests/yp34SRmf.m3u8" },
//   { id: 3, name: "Camera 3", src: "https://test-streams.mux.dev/test_001/stream.m3u8" },
//   { id: 4, name: "Camera 4", src: "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8" },
//   { id: 5, name: "Camera 5", src: "https://moiptvhls-i.akamaihd.net/hls/live/652317/live/master.m3u8" },
//   { id: 6, name: "Camera 6", src: "https://content.jwplatform.com/manifests/yp34SRmf.m3u8" },
//   { id: 7, name: "Camera 7", src: "https://moiptvhls-i.akamaihd.net/hls/live/652317/live/master.m3u8" },
//   { id: 8, name: "Camera 8", src: "https://content.jwplatform.com/manifests/yp34SRmf.m3u8" },
//   { id: 9, name: "Camera 9", src: "https://moiptvhls-i.akamaihd.net/hls/live/652317/live/master.m3u8" },
//   { id: 10, name: "Camera 10", src: "https://content.jwplatform.com/manifests/yp34SRmf.m3u8" },
// ];

// const StreamItem = ({ cam, onZoom, onError, refreshKey }) => (
//   <motion.div
//     key={`${cam.id}-${refreshKey}`} // ✅ reloads when refreshKey changes
//     variants={{
//       hidden: { opacity: 0, scale: 0.9 },
//       visible: { opacity: 1, scale: 1 },
//     }}
//     className="relative rounded-lg overflow-hidden border border-purple-300 bg-white flex items-center justify-center"
//   >
//     <HlsPlayer
//       src={cam.src}
//       autoPlay
//       controls={false}
//       muted
//       playsInline
//       width="100%"
//       height="100%"
//       className="object-cover"
//       onError={onError}
//     />

//     <div className="absolute bottom-0 left-0 right-0 bg-purple-700 bg-opacity-70 text-white text-sm p-2 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity">
//       <span>{cam.name}</span>
//       <Button
//         type="primary"
//         size="small"
//         shape="circle"
//         icon={<ZoomInOutlined />}
//         onClick={() => onZoom(cam)}
//         aria-label={`Zoom ${cam.name}`}
//       />
//     </div>
//   </motion.div>
// );

// const LiveGrid = () => {
//   const [gridSize, setGridSize] = useState(2);
//   const [zoomCam, setZoomCam] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const gridRef = useRef(null);

//   const gridCols = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };

//   const handleError = (id) => {
//     message.error(`Failed to load stream ${id}`);
//   };

//   const handleRefresh = () => {
//     setRefreshKey((prev) => prev + 1);
//     message.success("Streams refreshed");
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       gridRef.current.requestFullscreen?.();
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen?.();
//       setIsFullscreen(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-white min-h-screen">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold text-purple-700">Live Streaming</h2>

//         <Space>
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={handleRefresh}
//           >
//             Refresh All
//           </Button>
//           <Button
//             icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
//             onClick={toggleFullscreen}
//           >
//             {isFullscreen ? "Exit Fullscreen" : "Fullscreen Grid"}
//           </Button>
//           <Select defaultValue={2} style={{ width: 120 }} onChange={setGridSize}>
//             <Option value={2}>2 x 2</Option>
//             <Option value={3}>3 x 3</Option>
//             <Option value={4}>4 x 4</Option>
//           </Select>
//         </Space>
//       </div>

//       <motion.div
//         ref={gridRef}
//         className={`grid ${gridCols[gridSize]} gap-0.5 h-[calc(100vh-130px)]`}
//         initial="hidden"
//         animate="visible"
//         transition={{ staggerChildren: 0.1 }}
//       >
//         <AnimatePresence>
//           {staticStreams.slice(0, gridSize * gridSize).map((cam) => (
//             <StreamItem
//               key={cam.id}
//               cam={cam}
//               onZoom={setZoomCam}
//               onError={() => handleError(cam.id)}
//               refreshKey={refreshKey}
//             />
//           ))}
//         </AnimatePresence>
//       </motion.div>

//       <Modal
//         open={!!zoomCam}
//         footer={null}
//         width="80%"
//         centered
//         onCancel={() => setZoomCam(null)}
//         bodyStyle={{ padding: 0, background: "white" }}
//       >
//         {zoomCam && (
//           <HlsPlayer
//             src={zoomCam.src}
//             autoPlay
//             controls
//             muted
//             width="100%"
//             height="80vh"
//             className="object-cover"
//           />
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default LiveGrid;

