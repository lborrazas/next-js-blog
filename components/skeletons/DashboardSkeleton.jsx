import Grid from "@mui/material/Grid";
import { Skeleton } from "@mui/material";
import Typography from "@mui/material/Typography";

export const DashboardSkeleton = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={8}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} sx={{ display: "flex", justifyContent: "end" }}>
        <Skeleton variant="rounded" width={126} height={38} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rounded" sx={{ height: "250px" }} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Skeleton variant="rounded" sx={{ height: "250px" }} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Skeleton variant="rounded" sx={{ height: "250px" }} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Skeleton variant="rounded" sx={{ height: "250px" }} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Skeleton variant="rounded" sx={{ height: "250px" }} />
      </Grid>
    </Grid>
  );
};

export default DashboardSkeleton;
