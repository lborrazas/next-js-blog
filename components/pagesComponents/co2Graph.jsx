import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
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
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default function Co2Graph() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Typography variant="h5" gutterBottom>
          CO2 Combatido
        </Typography>
        <Box height="85%" >
          <Chart />
        </Box>
      </Grid>
      <Grid item xs={12} md={5}>
        <Grid paddingY="2vh" container rowSpacing={1} columnSpacing={2}>
          <Grid item xs={6}  >
            <Item sx={{height:"16vH"}}>1</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{height:"16vH"}}>2</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{height:"16vH"}}>3</Item>  
          </Grid>
          <Grid item xs={6}>
            <Item sx={{height:"16vH"}}>4</Item>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}     