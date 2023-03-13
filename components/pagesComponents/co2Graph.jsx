import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, { useEffect, useMemo, useState } from "react";
import { Skeleton, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const formatNumber = (number) => {
  let formattedNumber = number;
  if (number >= 1000000000000) {
    formattedNumber = `${Math.round(number / 1000000000000).toFixed(2)}t`;
  } else if (number >= 1000000000) {
    formattedNumber = `${Math.round(number / 1000000000).toFixed(2)}g`;
  } else if (number >= 1000000) {
    formattedNumber = `${Math.round(number / 1000000).toFixed(2)}m`;
  } else if (number >= 1000) {
    formattedNumber = `${Math.round(number / 1000).toFixed(2)}k`;
  }
  return formattedNumber;
};

const CustomYAxisTick = ({ x, y, payload }) => {
  const formattedNumber = formatNumber(payload.value);

  return (
    <text x={x} y={y} dy={16} textAnchor="end" fill="#666" fontSize={16}>
      {formattedNumber}
    </text>
  );
};

const Chart = ({ datos, setCo2 }) => {
  const getDataSum = () => {
    let val = 0;
    datos.forEach((dato) => {
      val += dato.value;
    });
    return val;
  };

  const sum = useMemo(() => getDataSum(), [getDataSum]);

  useEffect(() => {
    setCo2(sum);
  }, [setCo2, sum]);

  return (
    <ResponsiveContainer width="100%">
      <AreaChart
        width="100%"
        height="400px"
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
  const [co2, setCo2] = useState("");

  if (!datos) {
    return <Skeleton variant="rounded" sx={{ height: "85%", width: "100%" }} />;
  }

  return (
    <Stack
      sx={{ height: "85%" }}
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      <Chart datos={datos} setCo2={setCo2} />
      <Paper
        elevation={6}
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="subtitle1">{formatNumber(co2)}</Typography>
        <Typography variant="caption" color="#808080">
          {" "}
          co2
        </Typography>
      </Paper>
    </Stack>
  );
}
