import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "antd";

// ✅ Demo Data (replace with API data)
const alertData = [
  { day: "Mon", critical: 3, severe: 4, normal: 6 },
  { day: "Tue", critical: 2, severe: 3, normal: 5 },
  { day: "Wed", critical: 4, severe: 2, normal: 7 },
  { day: "Thu", critical: 1, severe: 5, normal: 6 },
  { day: "Fri", critical: 5, severe: 3, normal: 4 },
  { day: "Sat", critical: 6, severe: 4, normal: 3 },
  { day: "Sun", critical: 2, severe: 2, normal: 5 },
];

const WeeklyAlertGraph = () => {
  return (
    <Card
      title="Weekly Alerts"
      className="rounded-2xl shadow-md border border-gray-100"
      headStyle={{ fontWeight: "600", background: "#F3E8FF", padding: "8px 16px" }}
      bodyStyle={{ background: "#F3E8FF", padding: "0" }}
    >
      <div className="h-68">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={alertData}
            barCategoryGap="40%" // spacing between groups
            barSize={10}         // ✅ thin bar width
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd6fe" />
            <XAxis dataKey="day" stroke="#6D28D9" />
            <YAxis stroke="#6D28D9" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ede9fe",
                border: "1px solid #a78bfa",
                borderRadius: "8px",
              }}
              cursor={{ fill: "#ddd6fe" }}
            />
            <Legend />

            {/* Critical - Red */}
            <Bar
              dataKey="critical"
              fill="#ef4444"
              name="Critical"
              radius={[5, 5, 0, 0]}
            />

            {/* Severe - Orange */}
            <Bar
              dataKey="severe"
              fill="#f59e0b"
              name="Severe"
              radius={[5, 5, 0, 0]}
            />

            {/* Normal - Green */}
            <Bar
              dataKey="normal"
              fill="#22c55e"
              name="Normal"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default WeeklyAlertGraph;
