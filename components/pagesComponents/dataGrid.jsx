import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { fShortenNumber } from "../../utils/formatNumber";
import styled from "@emotion/styled";

const InformationContainer = styled(Paper)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "30px",
});

const InformationItem = ({ value, description }) => {
  return (
    <InformationContainer elevation={3}>
      <Typography variant="h3">{value}</Typography>
      <Typography variant="caption" sx={{ opacity: 0.72 }}>
        {description}
      </Typography>
    </InformationContainer>
  );
};

export default function DataGrid({ datos }) {
  const areaOcupadaTitlte = "Area ocupada";
  const m2ocuppedtitle = "Metros cuadrados ocupados";
  const alturaTitle = "Metros de altura promedio";
  const co2title = "CO2 Absorbido";
  return (
    <Grid paddingY="2vh" container rowSpacing={1} columnSpacing={2}>
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
