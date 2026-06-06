"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface DonutPoint {
  name: string;
  value: number;
}

const COLORS = ["#2563eb", "#10b981", "#f59e0b"];

export const DonutChart = ({ data }: { data: DonutPoint[] }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            background: "rgba(255,255,255,0.98)",
            color: "#0f172a",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)"
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);