import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Image } from "antd"; // ✅ AntD Image (preview/zoom)
import debounce from "lodash/debounce";
import Cookies from "js-cookie";
import { deviceApi } from "../../../utils/axiosInstance";
import { ANALYTICS_API_URL } from "../../../config";


const columnHelper = createColumnHelper();

const AnalyticsTable = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [cameraFilter, setCameraFilter] = useState(""); // ✅ Camera filter state
  const [cameras, setCameras] = useState([]); // ✅ Dropdown options
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const userId = Cookies.get("userId");
  // Rules state (persist per user)
  const [ruleEnabled, setRuleEnabled] = useState(false);
  const [matchMode, setMatchMode] = useState("AND"); // AND | OR
  const [rules, setRules] = useState([]); // {id, objectKey, operator, threshold}
  const [draft, setDraft] = useState({ id: null, objectKey: "person", operator: ">", threshold: 1 });
  // ✅ Define table columns
  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("objectName", {
      header: "Objects",
      cell: (info) => {
        const raw = info.getValue();
        try {
          const cleaned = raw.replace(/'/g, '"');
          const parsed = JSON.parse(cleaned);
          return (
            <div className="flex flex-wrap gap-1">
              {Object.entries(parsed).map(([k, v]) => (
                <span
                  key={k}
                  className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800"
                >
                  {k}: {v}
                </span>
              ))}
            </div>
          );
        } catch {
          return <span className="whitespace-normal break-words">{raw}</span>;
        }
      },
    }),
    columnHelper.accessor("objectCount", { header: "Count" }),
    // Alert Severity Mapping
    columnHelper.accessor("alertStatus", {
      header: "Severity",
      cell: (info) => {
        const code = info.getValue();
        let label = "Unknown";
        let color = "bg-gray-100 text-gray-600";
        let emoji = "ℹ️";

        switch (code) {
          case "B":
            label = "Basic";
            color = "bg-blue-100 text-blue-700";
            emoji = "🔵";
            break;
          case "C":
            label = "Critical";
            color = "bg-red-100 text-red-700";
            emoji = "🚨";
            break;
          case "S":
            label = "Severe";
            color = "bg-orange-100 text-orange-700";
            emoji = "⚠️";
            break;
          case "N":
            label = "Normal";
            color = "bg-green-100 text-green-700";
            emoji = "✅";
            break;
        }

        return (
          <span className={`px-2 py-1 text-xs rounded ${color}`}>
            {emoji} {label}
          </span>
        );
      },
    }),
    columnHelper.accessor("regDate", {
      header: "Timestamp",
      cell: (info) =>
        new Date(info.getValue()).toLocaleString("en-IN", {
          dateStyle: "short",
          timeStyle: "medium",
        }),
    }),
    columnHelper.accessor("framePath", {
      header: "Snapshot",
      cell: (info) => {
        const path = info.getValue();
        const imgUrl = `${ANALYTICS_API_URL}/${path}`;
        return (
          <Image
            src={imgUrl}
            alt="frame"
            width={80}
            height={60}
            className="object-cover rounded border"
            preview={{ mask: "Click to Preview" }}
          />
        );
      },
    }),
  ];

  // ✅ Fetch cameras for filter dropdown
  const fetchCameras = async () => {
    try {
      const res = await deviceApi.get(`/Camera/?user_id=${userId}&page=1&pageSize=100`);
      setCameras(res.data.results || []);
    } catch (err) {
      console.error("Camera fetch failed:", err);
    }
  };

  // ✅ Fetch alerts using deviceApi instead of hardcoded URL
  const fetchData = async (search = "", currentPage = 1, size = pageSize) => {
    try {
      setLoading(true);
      const res = await deviceApi.get("/CameraAlert/", {
        params: {
          userid: userId,          // you can replace with dynamic userId if needed
          page: currentPage,
          pageSize: size,
          camera_id: cameraFilter || "", // camera filter
          search,
        },
      });

      setData(res.data.results || []);
      setTotalPages(Math.ceil(res.data.count / size));
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  useEffect(() => {
    fetchData(globalFilter, page, pageSize);
  }, [globalFilter, page, pageSize, cameraFilter]); // ✅ refetch when camera changes

  // ---- Persistence ----
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`analytics_rules_v2_${userId}`);
      if (stored) {
        const { rules: r = [], enabled = false, mode = "AND" } = JSON.parse(stored);
        setRules(r);
        setRuleEnabled(enabled);
        setMatchMode(mode);
      }
    } catch {}
  }, [userId]);

  useEffect(() => {
    try {
      localStorage.setItem(`analytics_rules_v2_${userId}` , JSON.stringify({ rules, enabled: ruleEnabled, mode: matchMode }));
    } catch {}
  }, [rules, ruleEnabled, matchMode, userId]);

  const filteredForRule = useMemo(() => {
    if (!ruleEnabled || rules.length === 0) return data;
    const safeParse = (raw) => {
      if (!raw || typeof raw !== "string") return {};
      try {
        const cleaned = raw.replace(/'/g, '"');
        const parsed = JSON.parse(cleaned);
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch {
        return {};
      }
    };
    const applyRule = (row, r) => {
      const obj = safeParse(row.objectName);
      const value = Number(obj[r.objectKey] ?? 0);
      const thr = Number(r.threshold);
      switch (r.operator) {
        case ">": return value > thr;
        case ">=": return value >= thr;
        case "==": return value === thr;
        case "<": return value < thr;
        case "<=": return value <= thr;
        default: return true;
      }
    };
    return (data || []).filter((row) => {
      if (matchMode === "AND") return rules.every((r) => applyRule(row, r));
      return rules.some((r) => applyRule(row, r));
    });
  }, [data, ruleEnabled, rules, matchMode]);

  const table = useReactTable({
    data: filteredForRule,
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
        <h2 className="text-xl font-bold text-[#fce4e4]">
          Video Analytics Alerts
        </h2>

        <div className="flex gap-3 items-center">
          {/* 🔍 Search */}
          <input
            type="text"
            placeholder="Search (object)..."
            onChange={(e) => handleSearch(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring focus:ring-green-300"
          />

          {/* 📷 Camera Filter */}
          <select
            value={cameraFilter}
            onChange={(e) => {
              setCameraFilter(e.target.value);
              setPage(1);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="" className="text-black">All Cameras</option>
            {cameras.map((cam) => (
              <option key={cam.id} value={cam.id} className="text-black">
                {cam.name || `Camera ${cam.id}`}
              </option>
            ))}
          </select>

          {/* 📄 Page size */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size} className="text-black">
                Show {size}
              </option>
            ))}
          </select>
          {/* Rules controls */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={ruleEnabled}
              onChange={(e) => setRuleEnabled(e.target.checked)}
            />
            Apply Rules
          </label>
          <select
            className="px-2 py-1 border rounded text-sm"
            value={matchMode}
            onChange={(e) => setMatchMode(e.target.value)}
            title="Match mode"
          >
            <option value="AND" className="text-black">AND</option>
            <option value="OR" className="text-black">OR</option>
          </select>
        </div>
      </div>

      {/* Rules table */}
      <div className="w-full bg-white border rounded-md p-3 shadow-sm">
        <div className="flex gap-2 flex-wrap items-end">
          <input
            className="px-2 py-1 border rounded text-sm w-36"
            placeholder="object (e.g., person)"
            value={draft.objectKey}
            onChange={(e) => setDraft((d) => ({ ...d, objectKey: e.target.value }))}
          />
          <select
            className="px-2 py-1 border rounded text-sm"
            value={draft.operator}
            onChange={(e) => setDraft((d) => ({ ...d, operator: e.target.value }))}
          >
            {[">", ">=", "==", "<", "<="].map((op) => (
              <option key={op} value={op} className="text-black">{op}</option>
            ))}
          </select>
          <input
            type="number"
            className="px-2 py-1 border rounded text-sm w-24"
            min={0}
            value={draft.threshold}
            onChange={(e) => setDraft((d) => ({ ...d, threshold: Number(e.target.value) }))}
          />
          <button
            className="px-3 py-2 bg-[#9864db] text-white rounded text-sm"
            onClick={() => {
              if (!draft.objectKey) return;
              if (draft.id == null) {
                setRules((prev) => [
                  ...prev,
                  { id: Date.now(), objectKey: draft.objectKey, operator: draft.operator, threshold: Number(draft.threshold) },
                ]);
              } else {
                setRules((prev) => prev.map((r) => (r.id === draft.id ? { ...draft, threshold: Number(draft.threshold) } : r)));
              }
              setDraft({ id: null, objectKey: "person", operator: ">", threshold: 1 });
            }}
          >
            {draft.id == null ? "Add Rule" : "Save Rule"}
          </button>
          {draft.id != null && (
            <button
              className="px-3 py-2 bg-gray-200 text-black rounded text-sm"
              onClick={() => setDraft({ id: null, objectKey: "person", operator: ">", threshold: 1 })}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-2 py-1">Object</th>
                <th className="px-2 py-1">Operator</th>
                <th className="px-2 py-1">Threshold</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-2 py-2 text-gray-500">No rules added.</td>
                </tr>
              ) : (
                rules.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-2 py-1">{r.objectKey}</td>
                    <td className="px-2 py-1">{r.operator}</td>
                    <td className="px-2 py-1">{r.threshold}</td>
                    <td className="px-2 py-1 flex gap-2">
                      <button
                        className="px-2 py-1 border rounded text-xs"
                        onClick={() => setDraft(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 border rounded text-xs text-red-600"
                        onClick={() => setRules((prev) => prev.filter((x) => x.id !== r.id))}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border-[#e7e5ec] shadow">
        <table className="min-w-full text-sm ">
          <thead className="bg-[#9864db] text-[#E6E6FA]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 border border-[#e7e5ec] text-left font-semibold cursor-pointer"
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
          <tbody className="bg-white divide-y divide-green-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-green-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 border border-green-100 whitespace-normal break-words"
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
                <td colSpan={columns.length} className="text-center py-6">
                  No data found.
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
            className="px-3 py-1 border rounded bg-green-100 text-[#2c028d] disabled:opacity-50"
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border rounded bg-green-100 text-[#2c028d] disabled:opacity-50"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTable;
