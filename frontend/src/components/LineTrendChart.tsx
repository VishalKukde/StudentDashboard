"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface TrendPoint {
  day: string;
  timeSpent: number;
}

export const LineTrendChart = ({ data }: { data: TrendPoint[] }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="day" stroke="#475569" tickLine={false} axisLine={false} />
        <YAxis stroke="#475569" tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            background: "rgba(255,255,255,0.98)",
            color: "#0f172a",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)"
          }}
        />
        <Line type="monotone" dataKey="timeSpent" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);