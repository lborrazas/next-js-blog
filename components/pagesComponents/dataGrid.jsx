import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { fShortenNumber } from "../../utils/formatNumber";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

const InformationItem = ({ value, description }) => {
  return (
    <Paper
      elevation={6}
      sx={{
        p: 2,
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Typography variant="h4">{value}</Typography>
        <Typography
          color="#808080"
          variant="caption"
          sx={{ textAlign: "center" }}
        >
          {description}
        </Typography>
      </Box>
    </Paper>
  );
};

export default function DataGrid({ datos }) {
  const areaOcupadaTitlte = "Area ocupada";
  const m2ocuppedtitle = "Metros cuadrados ocupados";
  const alturaTitle = "Metros de altura promedio";
  const co2title = "CO2 Absorbido";
  return (
    <Grid container spacing={2} sx={{ height: "100%" }}>
      <Grid item xs={6}>
        <InformationItem
          value={`${fShortenNumber(datos.percentage)}%`}
          description={areaOcupadaTitlte}
        />
      </Grid>
      <Grid item xs={6}>
        <InformationItem
          value={`${fShortenNumber(datos.m2)}`}
          description={m2ocuppedtitle}
        />
      </Grid>
      <Grid item xs={6}>
        <InformationItem
          value={`${fShortenNumber(datos.height)}`}
          description={alturaTitle}
        />
      </Grid>
      <Grid item xs={6}>
        <InformationItem
          value={`${fShortenNumber(datos.total)}`}
          description={co2title}
        />
      </Grid>
    </Grid>
  );
}
