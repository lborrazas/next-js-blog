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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Chart = () => {
  const data = [
    {
      month: "Page A",
      value: 4000,
    },
    {
      month: "Page B",
      value: 3000,
    },
    {
      month: "Page C",
      value: 2000,
    },
    {
      month: "Page D",
      value: 2780,
    },
    {
      month: "Page E",
      value: 1890,
    },
    {
      month: "Page F",
      value: 2390,
    },
    {
      month: "Page G",
      value: 3490,
    },
  ];

  return (
    <ResponsiveContainer width="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
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
