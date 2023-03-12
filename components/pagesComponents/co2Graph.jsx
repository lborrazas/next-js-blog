import Box from "@mui/material/Box";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomYAxisTick = ({ x, y, payload }) => {
  let formattedNumber = payload.value;
  if (payload.value >= 1000000000000) {
    formattedNumber = `${Math.round(payload.value / 1000000000000).toFixed(
      2
    )}T`;
  } else if (payload.value >= 1000000000) {
    formattedNumber = `${Math.round(payload.value / 1000000000).toFixed(2)}G`;
  } else if (payload.value >= 1000000) {
    formattedNumber = `${Math.round(payload.value / 1000000).toFixed(2)}M`;
  } else if (payload.value >= 1000) {
    formattedNumber = `${Math.round(payload.value / 1000).toFixed(2)}K`;
  }

  return (
    <text x={x} y={y} dy={16} textAnchor="end" fill="#666" fontSize={16}>
      {formattedNumber}
    </text>
  );
};

const Chart = ({ datos }) => {
  return (
    <ResponsiveContainer width="100%">
      <AreaChart
        width="100%"
        height="100%"
        data={datos}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tick={<CustomYAxisTick />} />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default function Co2Graph({ datos }) {
  return (
    <Box height="85%">
      <Chart datos={datos} />
    </Box>
  );
}
