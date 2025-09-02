import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import debounce from "lodash/debounce";
import axios from "axios";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", {
    header: "Camera Name",
    cell: (info) => (
      <span className="font-semibold text-[#2c028d]">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("location", { header: "Location" }),
  columnHelper.accessor("zone", { header: "Zone" }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const val = info.getValue();
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            val === "online"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {val}
        </span>
      );
    },
  }),
  columnHelper.accessor("is_recording", {
    header: "Recording",
    cell: (info) =>
      info.getValue() ? (
        <span className="text-green-600 font-medium">✅ Yes</span>
      ) : (
        <span className="text-red-500 font-medium">❌ No</span>
      ),
  }),
  columnHelper.accessor("is_streaming", {
    header: "Streaming",
    cell: (info) =>
      info.getValue() ? (
        <span className="text-green-600 font-medium">✅ Yes</span>
      ) : (
        <span className="text-red-500 font-medium">❌ No</span>
      ),
  }),
  columnHelper.accessor("is_analytics", {
    header: "Analytics",
    cell: (info) =>
      info.getValue() ? (
        <span className="text-green-600 font-medium">✅ Enabled</span>
      ) : (
        <span className="text-gray-500 font-medium">Disabled</span>
      ),
  }),
  columnHelper.accessor("nvr", {
    header: "NVR",
    cell: (info) => info.getValue()?.name || "—",
  }),
  columnHelper.accessor("created_at", {
    header: "Created",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
];

const CameraDetailsTable = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // ✅ Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [featureFilter, setFeatureFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [nvrFilter, setNvrFilter] = useState("all");

  const [zones, setZones] = useState([]);
  const [nvrs, setNvrs] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Fetch filter options
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [zoneRes, nvrRes] = await Promise.all([
          axios.get("http://106.201.68.175:8000/api/zone/"),
          axios.get("http://106.201.68.175:8000/api/nvr/"),
        ]);
        setZones(zoneRes.data);
        setNvrs(nvrRes.data);
      } catch (err) {
        console.error("Filter API error:", err);
      }
    };
    loadFilters();
  }, []);

  // ✅ Fetch camera data
  const fetchData = async (
    search = "",
    currentPage = 1,
    size = pageSize,
    status = "all",
    feature = "all",
    zone = "all",
    nvr = "all"
  ) => {
    try {
      const res = await axios.get("http://106.201.68.175:8000/api/camera/", {
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
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  useEffect(() => {
    fetchData(globalFilter, page, pageSize, statusFilter, featureFilter, zoneFilter, nvrFilter);
  }, [globalFilter, page, pageSize, statusFilter, featureFilter, zoneFilter, nvrFilter]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        setGlobalFilter(value);
        setPage(1);
      }, 300),
    []
  );

  return (
    <div className="p-4 space-y-4 max-w-full">
      {/* Header */}
      <div className="flex px-2 py-3 rounded-md flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#9864db] text-[#E6E6FA]">
        <h2 className="text-xl font-bold text-[#fce4e4]">Camera Details</h2>

        <div className="flex gap-3 items-center flex-wrap">
          {/* Search */}
          <input
            type="text"
            placeholder="Search cameras..."
            onChange={(e) => handleSearch(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring focus:ring-purple-300 text-white"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-200"
          >
            <option className="text-black" value="all">All Status</option>
            <option className="text-black" value="online">Online</option>
            <option className="text-black" value="offline">Offline</option>
          </select>

          {/* Feature Filter */}
          <select
            value={featureFilter}
            onChange={(e) => {
              setFeatureFilter(e.target.value);
              setPage(1);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-200"
          >
            <option className="text-black" value="all">All Features</option>
            <option className="text-black" value="recording">Recording</option>
            <option className="text-black" value="streaming">Streaming</option>
            <option className="text-black" value="analytics">Analytics</option>
          </select>

          {/* Zone Filter */}
          <select
            value={zoneFilter}
            onChange={(e) => {
              setZoneFilter(e.target.value);
              setPage(1);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-200 "
          >
            <option className="text-black" value="all">All Zones</option>
            {zones.map((z) => (
              <option key={z.id} className="text-black" value={z.id}>
                {z.name}
              </option>
            ))}
          </select>

          {/* NVR Filter */}
          <select
            value={nvrFilter}
            onChange={(e) => {
              setNvrFilter(e.target.value);
              setPage(1);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-200 "
          >
            <option className="text-black" value="all">All NVRs</option>
            {nvrs.map((n) => (
              <option key={n.id} className="text-black" value={n.id}>
                {n.name}
              </option>
            ))}
          </select>

          {/* Add Camera */}
          {/* <button
            onClick={() => alert("Open Add Camera Form")}
            className="bg-[#fcfcfc] hover:bg-gray-200 text-black px-3 p-0.5 rounded-md font-sm shadow"
          >
            Add Camera
          </button> */}
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
                    className="px-4 py-3 border border-[#e7e5ec] text-left font-semibold cursor-pointer whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" && " 🔼"}
                    {header.column.getIsSorted() === "desc" && " 🔽"}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-purple-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-purple-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 border border-purple-100 whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {table.getRowModel().rows.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No cameras found.
          </div>
        )}
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
    </div>
  );
};

export default CameraDetailsTable;
