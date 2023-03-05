import Grid from "@mui/material/Grid";
import { Skeleton } from "@mui/material";
import Typography from "@mui/material/Typography";

export const TransferSkeleton = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Typography variant="h4" gutterBottom>
          Transferir parcela
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rounded" sx={{ height: "56px" }} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rounded" sx={{ height: "56px" }} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rounded" sx={{ height: "38px" }} />
      </Grid>
    </Grid>
  );
};

export default TransferSkeleton;
