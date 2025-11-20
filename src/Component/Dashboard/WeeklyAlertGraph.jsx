import React, { useMemo } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Skeleton } from 'antd';
import { useAlertData } from '../../contexts/AlertDataContext';

const WeeklyAlertGraph = () => {
  const { weeklyCounts, loading } = useAlertData();

  const chartData = useMemo(() => {
    if (!weeklyCounts.length) return [];

    const today = new Date();
    return Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - idx));
      const key = date.toISOString().split('T')[0];
      const match = weeklyCounts.find(item => item.date === key);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        total: match?.count || 0,
      };
    });
  }, [weeklyCounts]);

  return (
    <Card
      title={<span className="text-purple-800 font-semibold text-lg">Weekly Camera Alerts</span>}
      className="rounded-2xl shadow-lg bg-gradient-to-b from-purple-50 to-white"
      bordered={false}
      headStyle={{
        background: 'transparent',
        borderBottom: 'none',
        padding: '12px 20px',
      }}
      bodyStyle={{ padding: '0 16px 16px 16px' }}
    >
      {loading ? (
        <div className="flex flex-col justify-center items-center h-72 space-y-4">
          <Skeleton.Input active style={{ width: 220, height: 20, borderRadius: 6 }} />
          <div className="w-full px-6 flex justify-around items-end h-48">
            {Array(7)
              .fill(0)
              .map((_, idx) => (
                <Skeleton.Button
                  key={idx}
                  active
                  style={{
                    width: 25,
                    height: `${40 + Math.random() * 60}px`,
                    borderRadius: 8,
                    background: 'linear-gradient(180deg,#ddd6fe 0%,#ede9fe 100%)',
                  }}
                />
              ))}
          </div>
          <Skeleton.Input active style={{ width: '60%', height: 10, borderRadius: 4 }} />
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barSize={25} // ✅ thinner bars (width doesn’t expand)
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" />
              <XAxis
                dataKey="day"
                stroke="#7C3AED"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#7C3AED" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f5f3ff',
                  border: '1px solid #c4b5fd',
                  borderRadius: '10px',
                  color: '#5b21b6',
                }}
                cursor={{ fill: '#ede9fe' }}
              />
              <Bar
                dataKey="total"
                fill="url(#purpleGradient)"
                name="Alert Count"
                radius={[10, 10, 0, 0]}
              />
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0.7} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default WeeklyAlertGraph;

// import React from "react";
// import {
//   BarChart,
//   Bar,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { Card } from "antd";

// // ✅ Demo Data (replace with API data)
// const alertData = [
//   { day: "Mon", critical: 3, severe: 4, normal: 6 },
//   { day: "Tue", critical: 2, severe: 3, normal: 5 },
//   { day: "Wed", critical: 4, severe: 2, normal: 7 },
//   { day: "Thu", critical: 1, severe: 5, normal: 6 },
//   { day: "Fri", critical: 5, severe: 3, normal: 4 },
//   { day: "Sat", critical: 6, severe: 4, normal: 3 },
//   { day: "Sun", critical: 2, severe: 2, normal: 5 },
// ];

// const WeeklyAlertGraph = () => {
//   return (
//     <Card
//       title="Weekly Alerts"
//       className="rounded-2xl shadow-md border border-gray-100"
//       headStyle={{ fontWeight: "600", background: "#F3E8FF", padding: "8px 16px" }}
//       bodyStyle={{ background: "#F3E8FF", padding: "0" }}
//     >
//       <div className="h-68">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={alertData}
//             barCategoryGap="40%" // spacing between groups
//             barSize={10}         // ✅ thin bar width
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#ddd6fe" />
//             <XAxis dataKey="day" stroke="#6D28D9" />
//             <YAxis stroke="#6D28D9" />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#ede9fe",
//                 border: "1px solid #a78bfa",
//                 borderRadius: "8px",
//               }}
//               cursor={{ fill: "#ddd6fe" }}
//             />
//             <Legend />

//             {/* Critical - Red */}
//             <Bar
//               dataKey="critical"
//               fill="#ef4444"
//               name="Critical"
//               radius={[5, 5, 0, 0]}
//             />

//             {/* Severe - Orange */}
//             <Bar
//               dataKey="severe"
//               fill="#f59e0b"
//               name="Severe"
//               radius={[5, 5, 0, 0]}
//             />

//             {/* Normal - Green */}
//             <Bar
//               dataKey="normal"
//               fill="#22c55e"
//               name="Normal"
//               radius={[5, 5, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </Card>
//   );
// };

// export default WeeklyAlertGraph;
