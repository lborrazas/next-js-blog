import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { fShortenNumber } from "../../utils/formatNumber";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "16vH",
}));

export default function DataGrid({ datos }) {
  const title = "hola";
  return (
    <Grid paddingY="2vh" container rowSpacing={1} columnSpacing={2}>
      <Grid item xs={6}>
        <Item sx={{ height: "16vH" }}>
          <Typography variant="h3">
            {fShortenNumber(datos.percentage)}%
          </Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
            {title}
          </Typography>
        </Item>
      </Grid>
      <Grid item xs={6}>
        <Item sx={{ height: "16vH" }}>
          {" "}
          <Typography variant="h3">{fShortenNumber(datos.m2)}</Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
            {title}
          </Typography>
        </Item>
      </Grid>
      <Grid item xs={6}>
        <Item sx={{ height: "16vH" }}>
          {" "}
          <Typography variant="h3">{fShortenNumber(datos.height)}</Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
            {title}
          </Typography>
        </Item>
      </Grid>
      <Grid item xs={6}>
        <Item sx={{ height: "16vH" }}>
          <Typography variant="h3">{fShortenNumber(datos.total)}</Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
            {title}
          </Typography>
        </Item>
      </Grid>
    </Grid>
  );
}
