import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import debounce from "lodash/debounce";
import { deviceApi } from "../../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { message, Popconfirm, Modal, Spin, Tag, Switch } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, CameraFilled } from "@ant-design/icons";
import axios from "axios"; // ✅ needed for streaming API call
import CameraModal from "./CameraModal";
import AnalyticsModal from "./AnalyticsModal";

const columnHelper = createColumnHelper();

const CameraDetailsTable = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [viewCamera, setViewCamera] = useState(null);
  const [loading, setLoading] = useState(false);

  const [analyticsLoadingIds, setAnalyticsLoadingIds] = useState([]);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [analyticsField, setAnalyticsField] = useState(null);
  const [analyticsValue, setAnalyticsValue] = useState(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);


  const [statusFilter, setStatusFilter] = useState(null);
  const [featureFilter, setFeatureFilter] = useState(null);
  const [zoneFilter, setZoneFilter] = useState(null);
  const [nvrFilter, setNvrFilter] = useState(null);

  const [zones, setZones] = useState([]);
  const [nvrs, setNvrs] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const userId = Cookies.get("userId");

  // ✅ Fetch filter options
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [zoneRes, nvrRes] = await Promise.allSettled([
          deviceApi.get("/Zone/?page=1&page_size=100"),
          deviceApi.get(`/NVR/?user_id=${userId}&page=1&page_size=100`),
        ]);

        if (zoneRes.status === "fulfilled") {
          setZones(zoneRes.value.data.results || []);
        }
        if (nvrRes.status === "fulfilled") {
          setNvrs(nvrRes.value.data.results || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    loadFilters();
  }, [userId]);

  // ✅ Fetch camera data
  const fetchData = async (
    search = globalFilter,
    currentPage = page,
    size = pageSize,
    status = statusFilter,
    feature = featureFilter,
    zone = zoneFilter,
    nvr = nvrFilter
  ) => {
    setLoading(true);
    try {
      const res = await deviceApi.get(`/Camera/?user_id=${userId}`, {
        params: {
          search,
          page: currentPage,
          pageSize: size,
          status,
          feature,
          zone,
          nvr,
        },
      });
      setData(res.data.results || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("API Error:", err);
      message.error("Failed to fetch cameras!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(
      globalFilter,
      page,
      pageSize,
      statusFilter,
      featureFilter,
      zoneFilter,
      nvrFilter
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    globalFilter,
    page,
    pageSize,
    statusFilter,
    featureFilter,
    zoneFilter,
    nvrFilter,
  ]);

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        setGlobalFilter(value);
        setPage(1);
      }, 300),
    []
  );

  // ✅ Delete (camera always, streaming optional)
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      // 1️⃣ Always delete camera first
      await deviceApi.delete(`/Camera/${id}/`);
      setData((prev) => prev.filter((item) => item.id !== id));

      let messageText = "Camera deleted successfully!";

      // 2️⃣ Then try to delete streaming
      try {
        await axios.delete(`http://14.195.152.244:9015/Streaming/remove_camera/${id}`);
        messageText += ",Streaming stopped successfully!";
      } catch (streamErr) {
        console.error("Streaming delete failed:", streamErr);
        messageText += ",⚠️ Streaming not stopped!";
      }

      // 3️⃣ Then try to stop recording
      try {
        await axios.delete(`http://14.195.152.244:9004/Recording/stop/${id}`);
        messageText += "and Recording stopped successfully!";
      } catch (recErr) {
        console.error("Recording stop failed:", recErr);
        messageText += ",⚠️ Recording not stopped!";
      }

      // 🔔 Final combined alert
      alert(messageText);
    } catch (err) {
      console.error("Camera delete failed:", err);
      alert("❌ Failed to delete camera!");
    } finally {
      setDeletingId(null);
    }
  };


  // ✅ Analytics toggle with modal warning
  const handleAnalyticsToggle = async (camera, field, value) => {
    if (value) {
      // ✅ Analytics ON → open modal
      setSelectedCamera(camera);
      setAnalyticsField(field);
      setAnalyticsValue(value);
      setAnalyticsModalOpen(true);
    } else {
      // ✅ Analytics OFF → call API directly
      try {
        // Mark this camera as loading
        setAnalyticsLoadingIds((prev) => [...prev, camera.id]);

        const payload = {
          cameras: [
            {
              objectlist: "[]",
              camera_id: camera.id,
              url: camera.rtspurl || camera.url,
              camera_ip: camera.cameraIP || "",
              user_id: camera.user_id || userId,
              credit_id: camera.credit_id || 0,
              running: "False",
            },
          ],
        };

        await axios.post("http://14.195.152.244:7001/CameraDetails", payload);

        // Update camera DB
        const dbPayload = { ...camera, [field]: 0, userid: String(userId) };
        await deviceApi.put(`/Camera/${camera.id}/`, dbPayload);

        message.success("Analytics turned off successfully");
        fetchData(); // refresh table
      } catch (err) {
        console.error("Failed to turn off analytics:", err);
        message.error("Failed to turn off analytics");
      } finally {
        // Remove loading state
        setAnalyticsLoadingIds((prev) => prev.filter((id) => id !== camera.id));
      }
    }
  };



  // ✅ Toggle with streaming API support
  // ✅ Toggle Streaming / Recording with API support
  const handleToggle = async (row, field, value) => {
    // Optimistic UI update
    setData((prev) =>
      prev.map((cam) =>
        cam.id === row.id ? { ...cam, [field]: value ? 1 : 0 } : cam
      )
    );

    try {
      // 1️⃣ Update Camera DB
      const payload = {
        ...row,
        [field]: value ? 1 : 0,
        userid: String(userId),
      };
      await deviceApi.put(`/Camera/${row.id}/`, payload);

      // 2️⃣ External API calls
      if (field === "isStreaming") {
        if (value) {
          // Start streaming
          await axios.post("http://14.195.152.244:9015/Streaming/add_camera/", {
            rtspUrl: row.rtspurl,
            cameraId: row.id,
            creditId: row.creditId || 0,
          });
          message.success("Streaming started successfully!");
        } else {
          // Stop streaming
          try {
            await axios.delete(
              `http://14.195.152.244:9015/Streaming/remove_camera/${row.id}`
            );
            message.success("Streaming stopped successfully!");
          } catch (err) {
            console.error("Streaming stop failed:", err);
            message.warning("Camera updated but streaming not stopped!");
          }
        }
      } else if (field === "isRecording") {
        if (value) {
          // Start recording
          await axios.post("http://14.195.152.244:9004/Recording/start/", {
            streamUrl: row.rtspurl,
            cameraId: row.id,
          });
          message.success("Recording started successfully!");
        } else {
          // Stop recording
          try {
            await axios.delete(
              `http://14.195.152.244:9004/Recording/stop/${row.id}`
            );
            message.success("Recording stopped successfully!");
          } catch (err) {
            console.error("Recording stop failed:", err);
            message.warning("Camera updated but recording not stopped!");
          }
        }
      } else {
        // For other fields
        message.success(`${field} updated successfully`);
      }
    } catch (err) {
      console.error("Toggle error:", err);
      message.error(`Failed to update ${field}`);
      fetchData(); // rollback
    }
  };

  const columns = [
    columnHelper.display({
      id: "serial",
      header: "S.No",
      cell: (info) => (
        <span className="font-medium text-gray-700">
          {(page - 1) * pageSize + info.row.index + 1}
        </span>
      ),
    }),
    columnHelper.accessor("name", {
      header: "Camera Name",
      cell: (info) => (
        <span className="font-semibold text-[#2c028d]">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("location", { header: "Location" }),
    columnHelper.accessor("zone", { header: "Zone" }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const val = info.getValue();
        return (
          <Tag color={val === 0 ? "green" : "red"}>
            {val === 0 ? "Online" : "Offline"}
          </Tag>
        );
      },
    }),
    columnHelper.accessor("isRecording", {
      header: "Recording",
      cell: (info) => (
        <Switch
          checked={!!info.getValue()}
          onChange={(val) =>
            handleToggle(info.row.original, "isRecording", val)
          }
        />
      ),
    }),
    columnHelper.accessor("isStreaming", {
      header: "Streaming",
      cell: (info) => (
        <Switch
          checked={!!info.getValue()}
          onChange={(val) =>
            handleToggle(info.row.original, "isStreaming", val)
          }
        />
      ),
    }),
    columnHelper.accessor("isANPR", {
      header: "Analytics",
      cell: (info) => {
        const camera = info.row.original;
        const loading = analyticsLoadingIds.includes(camera.id);
        return (
          <Switch
            checked={!!info.getValue()}
            onChange={(val) => handleAnalyticsToggle(camera, "isANPR", val)}
            loading={loading} // ✅ show spinner
            disabled={loading} // optional: disable toggle while processing
          />
        );
      },
    }),
    columnHelper.accessor("regDate", {
      header: "Created",
      cell: (info) =>
        info.getValue()
          ? new Date(info.getValue()).toLocaleDateString()
          : "—",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex gap-3 items-center">
            <EyeOutlined
              style={{
                color: "#9000DB",
                fontSize: "15px",
                cursor: "pointer",
              }}
              onClick={() => setViewCamera(row)}
            />
            <EditOutlined
              style={{
                color: "#16a34a",
                fontSize: "15px",
                cursor: "pointer",
              }}
              onClick={() =>
                navigate(`/camera/form`, { state: { camera: row } })
              }
            />
            <Popconfirm
              title="Are you sure to delete this camera?"
              onConfirm={() => handleDelete(row.id)}
              okText="Yes"
              cancelText="No"
            >
              {deletingId === row.id ? (
                <Spin size="small" />
              ) : (
                <DeleteOutlined
                  style={{
                    color: "#dc2626",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                />
              )}
            </Popconfirm>
            <CameraFilled
              style={{
                color: "#16a34a",
                fontSize: "15px",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedCamera(row);
                setIsCameraModalOpen(true);
              }}
            />

            {/* Camera Modal */}
            <CameraModal
              open={isCameraModalOpen}
              onClose={() => setIsCameraModalOpen(false)}
              camera={selectedCamera}
            />

          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-4 space-y-4 max-w-full">
      {/* Header with Filters */}
      <div className="flex px-2 py-3 rounded-md flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#9864db] text-[#E6E6FA]">
        <h2 className="text-xl font-bold text-[#fce4e4]">Camera Details</h2>
        <div className="flex gap-3 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search cameras..."
            onChange={(e) => handleSearch(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm text-black"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm text-white"
          >
            <option value="all" className="text-black">All Status</option>
            <option value="online" className="text-black">Online</option>
            <option value="offline" className="text-black">Offline</option>
          </select>
          <select
            value={featureFilter}
            onChange={(e) => setFeatureFilter(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm text-white"
          >
            <option value="all" className="text-black">All Features</option>
            <option value="recording" className="text-black">Recording</option>
            <option value="streaming" className="text-black">Streaming</option>
            <option value="analytics" className="text-black">Analytics</option>
          </select>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm text-white"
          >
            <option value="all" className="text-black">All Zones</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id} className="text-black">
                {z.name}
              </option>
            ))}
          </select>
          <select
            value={nvrFilter}
            onChange={(e) => setNvrFilter(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm text-white"
          >
            <option value="all" className="text-black">All NVRs</option>
            {nvrs.map((n) => (
              <option key={n.id} value={n.id} className="text-black">
                {n.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate("/camera/form")}
            className="bg-white hover:bg-gray-200 text-black px-3 py-1 rounded-md shadow"
          >
            + Add Camera
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-[#e7e5ec] shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-[#9864db] text-[#E6E6FA]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 border border-[#e7e5ec] text-left font-semibold whitespace-nowrap cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc" && " 🔼"}
                    {header.column.getIsSorted() === "desc" && " 🔽"}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-purple-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center">
                  <Spin spinning />
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-purple-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 border border-purple-100 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 text-center text-gray-500"
                >
                  No cameras found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 border rounded bg-purple-100 text-[#2c028d] disabled:opacity-50"
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border rounded bg-purple-100 text-[#2c028d] disabled:opacity-50"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* View Modal */}
      <Modal
        title="Camera Details"
        open={!!viewCamera}
        onCancel={() => setViewCamera(null)}
        footer={null}
      >
        {viewCamera && (
          <div className="space-y-2">
            <p><b>ID:</b> {viewCamera.id}</p>
            <p><b>Name:</b> {viewCamera.name}</p>
            <p><b>IP:</b> {viewCamera.cameraIP}</p>
            <p><b>Location:</b> {viewCamera.location}</p>
            <p><b>Zone:</b> {viewCamera.zone}</p>
            <p><b>Brand:</b> {viewCamera.brand}</p>
            <p><b>Manufacture:</b> {viewCamera.manufacture}</p>
            <p><b>MAC:</b> {viewCamera.macAddress}</p>
            <p><b>Port:</b> {viewCamera.port}</p>
            <p><b>Channel:</b> {viewCamera.channelId}</p>
            <p><b>Latitude:</b> {viewCamera.latitude}</p>
            <p><b>Longitude:</b> {viewCamera.longitude}</p>
            <p><b>RTSP URL:</b> {viewCamera.rtspurl}</p>
            <p><b>Status:</b> {viewCamera.status === 1 ? "Online" : "Offline"}</p>
            <p><b>Recording:</b> {viewCamera.isRecording ? "Yes" : "No"}</p>
            <p><b>Streaming:</b> {viewCamera.isStreaming ? "Yes" : "No"}</p>
            <p><b>Registered:</b> {new Date(viewCamera.regDate).toLocaleString()}</p>
          </div>
        )}
      </Modal>
      {/* // ✅ Analytics Modal */}
      <AnalyticsModal
        open={analyticsModalOpen}
        onClose={() => setAnalyticsModalOpen(false)}
        field={analyticsField}
        value={analyticsValue}
        userId={userId}
        camera={selectedCamera}
        onSaved={fetchData}   // ✅ refresh camera list after close
      />


    </div>
  );
};

export default CameraDetailsTable;
