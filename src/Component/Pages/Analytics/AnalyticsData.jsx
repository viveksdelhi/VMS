import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Image } from "antd"; // ✅ AntD Image (includes preview/zoom/rotate/fullscreen)
import debounce from "lodash/debounce";
import axios from "axios";

const columnHelper = createColumnHelper();

const AnalyticsTable = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ Define columns (removed status column)
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
        const imgUrl = `http://14.195.152.244:7001/${path}`;
        return (
          <Image
            src={imgUrl}
            alt="frame"
            width={80}
            height={60}
            className="object-cover rounded border"
            preview={{
              mask: "Click to Preview", // hover text
            }}
          />
        );
      },
    }),
  ];

  // Fetch camera alerts
  const fetchData = async (search = "", currentPage = 1, size = pageSize) => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://14.195.152.244:7006/api/CameraAlert/",
        {
          params: {
            user_id: 77, // you can make this dynamic
            page: currentPage,
            pageSize: size,
            camera_id: "", // optional filter
            search, // backend must support
          },
        }
      );

      setData(res.data.results || []);
      setTotalPages(Math.ceil(res.data.count / size));
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(globalFilter, page, pageSize);
  }, [globalFilter, page, pageSize]);

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
        <h2 className="text-xl font-bold text-[#fce4e4]">
          Video Analytics Alerts
        </h2>

        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search (object)..."
            onChange={(e) => handleSearch(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring focus:ring-green-300"
          />
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


// import React, { useState, useEffect, useMemo } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getSortedRowModel,
//   flexRender,
//   createColumnHelper,
// } from "@tanstack/react-table";
// import debounce from "lodash/debounce";
// import axios from "axios";

// const columnHelper = createColumnHelper();

// const columns = [
//   columnHelper.accessor("id", { header: "Id" }),
//   columnHelper.accessor("name", {
//     header: "Name",
//     cell: (info) => (
//       <span className="font-semibold text-green-800">{info.getValue()}</span>
//     ),
//   }),
//   columnHelper.accessor("username", { header: "Username" }),
//   columnHelper.accessor("company", { header: "Company" }),
//   columnHelper.accessor("email", { header: "Email" }),
//   columnHelper.accessor("city", { header: "City" }),
//   columnHelper.accessor("phone", { header: "Phone" }),
//   columnHelper.accessor("website", { header: "Website" }),
// ];

// const AnalyticsTable = () => {
//   const [data, setData] = useState([]);
//   const [sorting, setSorting] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);

//   // Fetch data
//   const fetchData = async (search = "", currentPage = 1, size = pageSize) => {
//     try {
//       const res = await axios.get("http://localhost:6050/api/analytics", {
//         params: { search, page: currentPage, pageSize: size },
//       });
//       setData(res.data.data);
//       setTotalPages(res.data.totalPages);
//     } catch (err) {
//       console.error("API Error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData(globalFilter, page, pageSize);
//   }, [globalFilter, page, pageSize]);

//   const table = useReactTable({
//     data,
//     columns,
//     state: { sorting },
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   const handleSearch = useMemo(
//     () =>
//       debounce((value) => {
//         setGlobalFilter(value);
//         setPage(1);
//       }, 300),
//     []
//   );

//   return (
//     <div className="p-4 space-y-4 max-w-full">
//       {/* Header */}
//      <div className="flex px-2 py-3 rounded-md flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#9864db] text-[#E6E6FA]">
//         <h2 className="text-xl font-bold text-[#fce4e4]">Analytics Data</h2>

//         <div className="flex gap-3 items-center">
//           <input
//             type="text"
//             placeholder="Search..."
//             onChange={(e) => handleSearch(e.target.value)}
//             className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring focus:ring-green-300"
//           />
//           <select
//             value={pageSize}
//             onChange={(e) => {
//               setPageSize(Number(e.target.value));
//               setPage(1);
//             }}
//             className="px-2 py-1 border border-gray-300 rounded-md text-sm"
//           >
//             {[10, 25, 50].map((size) => (
//               <option key={size} value={size} className="text-black">
//                 Show {size}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-md border-[#e7e5ec] shadow">
//         <table className="min-w-full text-sm ">
//           <thead className="bg-[#9864db] text-[#E6E6FA]">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <th
//                     key={header.id}
//                     className="px-4 py-3 border border-[#e7e5ec] text-left font-semibold  text-[#E6E6FA] cursor-pointer whitespace-nowrap"
//                     onClick={header.column.getToggleSortingHandler()}
//                   >
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                     {header.column.getIsSorted() === "asc" && " 🔼"}
//                     {header.column.getIsSorted() === "desc" && " 🔽"}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody className="bg-white divide-y divide-green-100">
//             {table.getRowModel().rows.map((row) => (
//               <tr key={row.id} className="hover:bg-green-50">
//                 {row.getVisibleCells().map((cell) => (
//                   <td
//                     key={cell.id}
//                     className="px-4 py-3 border border-green-100 whitespace-nowrap"
//                   >
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {table.getRowModel().rows.length === 0 && (
//           <div className="text-center text-gray-500 py-6">No data found.</div>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
//         <span className="text-sm text-gray-600">
//           Page {page} of {totalPages}
//         </span>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setPage((p) => Math.max(p - 1, 1))}
//             className="px-3 py-1 border rounded bg-green-100 text-[#2c028d] disabled:opacity-50"
//             disabled={page === 1}
//           >
//             Prev
//           </button>
//           <button
//             onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//             className="px-3 py-1 border rounded bg-green-100 text-[#2c028d] disabled:opacity-50"
//             disabled={page === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalyticsTable;
