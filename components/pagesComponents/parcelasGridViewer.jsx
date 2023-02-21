import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {Stack} from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TokenIcon from '@mui/icons-material/Token';


export class Parcela {
    constructor(id, latitud, longitud, m2, m2used, m3){
        this.id = id
        this.latitud = latitud
        this.longitud = longitud
        this.m2 = m2
        this.m2used = m2used
        this.m3 = m3
    }
}

export function colorGrading(number) {
    let grading = ""
    if (number <= 10) grading = "red"
    if (10 < number &&  number <= 30) grading = "orange"
    if (30 < number &&  number <= 80) grading = "yellowgreen"
    if (80 < number &&  number <= 100) grading = "green"
    return grading
}

export const parcelas = [
    new Parcela(1, 20, 30, 50, 99, 250),
    new Parcela(2, 20, 30, 50, 80, 250),
    new Parcela(3, 20, 30, 50, 70, 250),
    new Parcela(4, 20, 30, 50, 4, 250),
    new Parcela(4, 20, 30, 50, 12, 250),
    new Parcela(4, 20, 30, 50, 40, 250),
    new Parcela(4, 20, 30, 50, 100, 250),
    new Parcela(4, 20, 30, 50, 94, 250),
    new Parcela(4, 20, 30, 50, 90, 250),
    new Parcela(4, 20, 30, 50, 20, 250),
    new Parcela(4, 20, 30, 50, 10, 250),
    new Parcela(4, 20, 30, 50, 40, 250),
    new Parcela(4, 20, 30, 50, 2, 250),
    new Parcela(4, 20, 30, 50, 49, 250),
    new Parcela(4, 20, 30, 50, 85, 250),
    new Parcela(4, 20, 30, 50, 75, 250),
    new Parcela(4, 20, 30, 50, 94, 250),
    new Parcela(4, 20, 30, 50, 100, 250),
    new Parcela(1, 20, 30, 50, 99, 250),
    new Parcela(2, 20, 30, 50, 80, 250),
    new Parcela(3, 20, 30, 50, 70, 250),
    new Parcela(4, 20, 30, 50, 4, 250),
    new Parcela(4, 20, 30, 50, 12, 250),
    new Parcela(4, 20, 30, 50, 40, 250),
    new Parcela(4, 20, 30, 50, 100, 250),
    new Parcela(4, 20, 30, 50, 94, 250),
    new Parcela(4, 20, 30, 50, 90, 250),
    new Parcela(4, 20, 30, 50, 20, 250),
    new Parcela(4, 20, 30, 50, 10, 250),
    new Parcela(4, 20, 30, 50, 40, 250),
    new Parcela(4, 20, 30, 50, 2, 250),
    new Parcela(4, 20, 30, 50, 49, 250),
    new Parcela(4, 20, 30, 50, 85, 250),
    new Parcela(4, 20, 30, 50, 75, 250),
    new Parcela(4, 20, 30, 50, 94, 250),
    new Parcela(4, 20, 30, 50, 100, 250),
    new Parcela(1, 20, 30, 50, 99, 250),
    new Parcela(2, 20, 30, 50, 80, 250),
    new Parcela(3, 20, 30, 50, 70, 250),
    new Parcela(4, 20, 30, 50, 4, 250),
    new Parcela(4, 20, 30, 50, 12, 250),
    new Parcela(4, 20, 30, 50, 40, 250),
    new Parcela(4, 20, 30, 50, 100, 250),
    new Parcela(4, 20, 30, 50, 94, 250),
    new Parcela(4, 20, 30, 50, 90, 250),
    new Parcela(4, 20, 30, 50, 20, 250),
    new Parcela(4, 20, 30, 50, 10, 250),
    new Parcela(4, 20, 30, 50, 40, 250),
    new Parcela(4, 20, 30, 50, 2, 250),
    new Parcela(4, 20, 30, 50, 49, 250),
    new Parcela(4, 20, 30, 50, 85, 250),
    new Parcela(4, 20, 30, 50, 75, 250),
    new Parcela(4, 20, 30, 50, 94, 250),
    new Parcela(4, 20, 30, 50, 100, 250)
]
export default function ParcelasGridViewer() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <Typography variant="h5" gutterBottom>
                    Area geográfica
                </Typography>
                <Stack spacing={0} sx={{paddingX: 10, pr: 0}}>
                    {[
                        {color: "red", text: "0 - 10%"},
                        {color: "orange", text: "11 - 30%"},
                        {color: "yellowgreen", text: "31 - 80%"},
                        {color: "green", text: "81 - 100%"}].map(({color, text}) => (
                        <Stack direction="row" >
                            <Box bgcolor={color} width={"50px"} height={"50px"}/>
                            <Box paddingX="20px"  paddingY="20px" textAlign="left"  width={"100%"}
                                 height={"60px"}> {text} </Box>
                        </Stack>
                    ))}
                </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
                <Box paddingX="90px" textAlign="left">
                {
                    parcelas.map( (parcela) => (
                        <TokenIcon sx={{ fontSize: 50, color:  colorGrading(parcela.m2used) }}/>
                        // <Box>{parcela.id}</Box>
                    ))
                  //
            }
                </Box>
                <Paper elevation={0}> Parcelas </Paper>
            </Grid>
        </Grid>
    );
}