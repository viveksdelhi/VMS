import React, { useState, useEffect } from "react";
import { Input, Select, Spin, message } from "antd";
import { useDraggable } from "@dnd-kit/core";
import Cookies from "js-cookie";
import { deviceApi } from "../../../utils/axiosInstance";

const { Option } = Select;

const CameraItem = ({ cam }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: cam.id,
      data: { cam },
    });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="p-2 border border-purple-200 rounded bg-white cursor-grab hover:bg-purple-50"
    >
      <div className="font-medium">{cam.name}</div>
      <div className="text-xs text-gray-500">{cam.zone?.name || "No Zone"}</div>
    </div>
  );
};

const CameraSidebar = () => {
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = Cookies.get("userId") || 77;

  // ✅ Fetch cameras from API
  useEffect(() => {
    const fetchCameras = async () => {
      setLoading(true);
      try {
        const res = await deviceApi.get(`/Camera/?user_id=${userId}`);
        setCameras(res.data.results || []);
      } catch (err) {
        console.error("Error fetching cameras:", err);
        message.error("Failed to load cameras");
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, [userId]);

  // ✅ Unique zones
  const zones = [...new Set(cameras.map((c) => c.zone?.name).filter(Boolean))];

  // ✅ Apply filters (search + zone)
  const filtered = cameras.filter((c) => {
    const matchesSearch = c.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesZone = zone ? c.zone?.name === zone : true;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="w-72 border-r border-gray-200 p-3 flex flex-col">
      <h3 className="text-lg font-semibold text-purple-700 mb-3">Cameras</h3>

      {/* Search */}
      <Input.Search
        placeholder="Search camera..."
        allowClear
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />

      {/* Zone filter only */}
      <Select
        allowClear
        placeholder="Select Zone"
        value={zone}
        onChange={setZone}
        className="mb-3 w-full"
      >
        {zones.map((z) => (
          <Option key={z} value={z}>
            {z}
          </Option>
        ))}
      </Select>

      {/* Camera List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <Spin />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((cam) => <CameraItem key={cam.id} cam={cam} />)
        ) : (
          <div className="text-gray-400 text-center text-sm mt-10">
            No cameras found
          </div>
        )}
      </div>
    </div>
  );
};

export { CameraSidebar };

// import React, { useState } from "react";
// import { Input, Select } from "antd";
// import { useDraggable } from "@dnd-kit/core";

// const { Option } = Select;

// // ✅ Example Cameras with Zone
// const staticStreams = [
//   { id: "1",  name: "Camera 1",  zone: "Zone A", src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
//   { id: "2",  name: "Camera 2",  zone: "Zone A", src: "https://content.jwplatform.com/manifests/yp34SRmf.m3u8" },
//   { id: "3",  name: "Camera 3",  zone: "Zone B", src: "https://moiptvhls-i.akamaihd.net/hls/live/652317/live/master.m3u8" },
//   { id: "4",  name: "Camera 4",  zone: "Zone B", src: "https://test-streams.mux.dev/test_001/stream.m3u8" },
//   { id: "5",  name: "Camera 5",  zone: "Zone C", src: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8" },
//   { id: "6",  name: "Camera 6",  zone: "Zone C", src: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8" },
//   { id: "7",  name: "Camera 7",  zone: "Zone D", src: "https://test-streams.mux.dev/bbb-abr/bbb.m3u8" },
//   { id: "8",  name: "Camera 8",  zone: "Zone D", src: "https://mnmedias.api.telequebec.tv/m3u8/29880.m3u8" },
// ];

// const CameraItem = ({ cam }) => {
//   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
//     id: cam.id,
//     data: { cam },
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       {...attributes}
//       {...listeners}
//       style={{
//         transform: transform
//           ? `translate(${transform.x}px, ${transform.y}px)`
//           : undefined,
//         opacity: isDragging ? 0.5 : 1,
//       }}
//       className="p-2 border border-purple-200 rounded bg-white cursor-grab hover:bg-purple-50"
//     >
//       <div className="font-medium">{cam.name}</div>
//       <div className="text-xs text-gray-500">{cam.zone}</div>
//     </div>
//   );
// };

// const CameraSidebar = () => {
//   const [search, setSearch] = useState("");
//   const [zone, setZone] = useState(null);

//   const zones = [...new Set(staticStreams.map((c) => c.zone))];

//   // ✅ Apply filters (only search + zone)
//   const filtered = staticStreams.filter((c) => {
//     const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
//     const matchesZone = zone ? c.zone === zone : true;
//     return matchesSearch && matchesZone;
//   });

//   return (
//     <div className="w-72 border-r border-gray-200 p-3 flex flex-col">
//       <h3 className="text-lg font-semibold text-purple-700 mb-3">Cameras</h3>

//       {/* Search */}
//       <Input.Search
//         placeholder="Search camera..."
//         allowClear
//         onChange={(e) => setSearch(e.target.value)}
//         className="mb-3"
//       />

//       {/* Zone filter only */}
//       <Select
//         allowClear
//         placeholder="Select Zone"
//         value={zone}
//         onChange={setZone}
//         className="mb-3"
//       >
//         {zones.map((z) => (
//           <Option key={z} value={z}>
//             {z}
//           </Option>
//         ))}
//       </Select>

//       {/* Camera List */}
//       <div className="flex-1 overflow-y-auto space-y-2">
//         {filtered.map((cam) => (
//           <CameraItem key={cam.id} cam={cam} />
//         ))}
//         {filtered.length === 0 && (
//           <div className="text-gray-400 text-center text-sm mt-10">
//             No cameras found
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export { CameraSidebar, staticStreams };
