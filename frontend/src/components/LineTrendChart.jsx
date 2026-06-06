import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const LineTrendChart = ({ data }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
        <XAxis dataKey="day" stroke="#334155" />
        <YAxis stroke="#334155" />
        <Tooltip />
        <Line type="monotone" dataKey="timeSpent" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default LineTrendChart;
