import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { styled } from "@mui/material/styles";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
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
        <YAxis />
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
