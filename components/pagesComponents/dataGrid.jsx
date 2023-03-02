import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { styled } from "@mui/material/styles";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));



export default function DataGrid({ datos }) {
    return (
        <Grid paddingY="2vh" container rowSpacing={1} columnSpacing={2}>
            <Grid item xs={6}  >
                <Item sx={{ height: "16vH" }}>1</Item>
            </Grid>
            <Grid item xs={6}>
                <Item sx={{ height: "16vH" }}>2</Item>
            </Grid>
            <Grid item xs={6}>
                <Item sx={{ height: "16vH" }}>3</Item>
            </Grid>
            <Grid item xs={6}>
                <Item sx={{ height: "16vH" }}>4</Item>
            </Grid>
        </Grid>
    );
}     