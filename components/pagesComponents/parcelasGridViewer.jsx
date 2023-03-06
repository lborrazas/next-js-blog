import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TokenIcon from "@mui/icons-material/Token";
import styled from "@emotion/styled";

const GeographicAreaItem = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

export class Parcela {
  constructor(id, latitud, longitud, m2, m2used, m3) {
    this.id = id;
    this.latitud = latitud;
    this.longitud = longitud;
    this.m2 = m2;
    this.m2used = m2used;
    this.m3 = m3;
  }
}

export function colorGrading(number) {
  let grading = "";
  if (number <= 10) grading = "red";
  if (10 < number && number <= 30) grading = "orange";
  if (30 < number && number <= 80) grading = "yellowgreen";
  if (80 < number && number <= 100) grading = "green";
  return grading;
}


export default function ParcelasGridViewer({ tokens }) {
  const valuesHarcoded = [
    { color: "red", text: "0-10%" },
    { color: "orange", text: "11-30%" },
    { color: "yellowgreen", text: "31-80%" },
    { color: "green", text: "81-100%" },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4} md={3}>
        <Typography variant="h5" gutterBottom>
          Area geográfica
        </Typography>
        <Stack spacing={2}>
          {valuesHarcoded.map(({ color, text }) => (
            <GeographicAreaItem key={`${color}${text}`}>
              <Box bgcolor={color} width="50px" height="50px" />
              <Box sx={{ paddingX: "10px" }}>
                <Typography variant="description">{text} </Typography>
              </Box>
            </GeographicAreaItem>
          ))}
        </Stack>
      </Grid>
      <Grid item xs={12} sm={8} md={9}>
        <Box paddingX="90px" textAlign="left">
          {
            tokens.map((parcela) => (
              <TokenIcon
                key={parcela.id}
                sx={{ fontSize: 50, color: colorGrading(parcela.m2used) }}
              />
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
