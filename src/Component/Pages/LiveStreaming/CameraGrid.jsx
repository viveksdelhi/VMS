import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Button, Space, Tooltip } from "antd";
import { ZoomInOutlined, CloseOutlined } from "@ant-design/icons";
import HlsPlayer from "react-hls-player";
import {STREAM_API_URL} from "../../../config";
const GridCell = ({ index, cam, onZoom, onRemove, refreshKey }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `cell-${index}` });

  return ( 
    <div
      ref={setNodeRef}
      className={`relative rounded-sm overflow-hidden border border-gray-700 bg-gray-800 flex items-center justify-center w-full h-full ${
        isOver ? "ring-2 ring-purple-500" : ""
      }`}
    >
      {cam ? (
        <>
          <HlsPlayer
            src={`${STREAM_API_URL}/Streaming/stream/${cam.id}/stream.m3u8`}
            autoPlay
            muted
            playsInline
            width="100%"
            height="100%"
            key={`${cam.id}-${refreshKey}`}
            className="object-cover w-full h-full"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-purple-700 bg-opacity-70 text-white text-sm p-2 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity">
            <span>{cam.name}</span>
            <Space>
              <Tooltip title="Zoom">
                <Button
                  type="primary"
                  size="small"
                  shape="circle"
                  icon={<ZoomInOutlined />}
                  onClick={() => onZoom(cam)}
                />
              </Tooltip>
              <Tooltip title="Remove">
                <Button
                  size="small"
                  shape="circle"
                  icon={<CloseOutlined />}
                  onClick={onRemove}
                />
              </Tooltip>
            </Space>
          </div>
        </>
      ) : (
        <span className="text-gray-400 text-xs">Drop Camera Here</span>
      )}
    </div>
  );
};

// Define grid columns dynamically
const gridCols = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };
const gridRows = { 2: "grid-rows-2", 3: "grid-rows-3", 4: "grid-rows-4" };

const CameraGrid = ({
  gridSize,
  gridCams,
  onZoom,
  onRemove,
  refreshKey,
  gridRef,
}) => (
  <div
    ref={gridRef}
    className={`grid ${gridCols[gridSize]} ${gridRows[gridSize]} gap-0 h-[calc(100vh-130px)]`}
  >
    {gridCams.slice(0, gridSize * gridSize).map((cam, i) => (
      <GridCell
        key={i}
        index={i}
        cam={cam}
        onZoom={onZoom}
        onRemove={() => onRemove(i)}
        refreshKey={refreshKey}
      />
    ))}
  </div>
);

export default React.memo(CameraGrid);





// import React from "react";
// import { useDroppable } from "@dnd-kit/core";
// import { Button, Space, Tooltip } from "antd";
// import { ZoomInOutlined, CloseOutlined } from "@ant-design/icons";
// import HlsPlayer from "react-hls-player";

// const GridCell = ({ index, cam, onZoom, onRemove, refreshKey }) => {
//   const { setNodeRef, isOver } = useDroppable({ id: `cell-${index}` });

//   return (
//     <div
//       ref={setNodeRef}
//       className={`relative rounded-lg overflow-hidden border border-purple-300 bg-white flex items-center justify-center min-h-[220px] ${
//         isOver ? "ring-2 ring-purple-500" : ""
//       }`}
//     >
//       {cam ? (
//         <>
//           <HlsPlayer
//             src={cam.src}
//             autoPlay
//             muted
//             playsInline
//             width="100%"
//             height="100%"
//             key={`${cam.id}-${refreshKey}`}
//             className="object-cover"
//           />
//           <div className="absolute bottom-0 left-0 right-0 bg-purple-700 bg-opacity-70 text-white text-sm p-2 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity">
//             <span>{cam.name}</span>
//             <Space>
//               <Tooltip title="Zoom">
//                 <Button
//                   type="primary"
//                   size="small"
//                   shape="circle"
//                   icon={<ZoomInOutlined />}
//                   onClick={() => onZoom(cam)}
//                 />
//               </Tooltip>
//               <Tooltip title="Remove">
//                 <Button
//                   size="small"
//                   shape="circle"
//                   icon={<CloseOutlined />}
//                   onClick={onRemove}
//                 />
//               </Tooltip>
//             </Space>
//           </div>
//         </>
//       ) : (
//         <span className="text-gray-400 text-xs">Drop Camera Here</span>
//       )}
//     </div>
//   );
// };

// const gridCols = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };

// const CameraGrid = ({ gridSize, gridCams, onZoom, onRemove, refreshKey, gridRef }) => (
//   <div ref={gridRef} className={`grid ${gridCols[gridSize]} gap-0.5 h-[calc(100vh-130px)]`}>
//     {gridCams.slice(0, gridSize * gridSize).map((cam, i) => (
//       <GridCell
//         key={i}
//         index={i}
//         cam={cam}
//         onZoom={onZoom}
//         onRemove={() => onRemove(i)}
//         refreshKey={refreshKey}
//       />
//     ))}
//   </div>
// );

// export default React.memo(CameraGrid);
