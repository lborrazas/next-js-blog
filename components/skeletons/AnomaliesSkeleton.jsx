import Grid from "@mui/material/Grid";
import { Skeleton } from "@mui/material";
import Typography from "@mui/material/Typography";

export const AnomaliesSkeleton = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Typography variant="h4" gutterBottom>
          Detectando anomalias
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ display: "flex", justifyContent: "end" }}>
        <Skeleton variant="rounded" width={126} height={38} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rounded" sx={{ height: "450px" }} />
      </Grid>
    </Grid>
  );
};

export default AnomaliesSkeleton;
