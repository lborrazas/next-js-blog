import { useRouter } from "next/router";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import Iconify from "../../components/iconify";
import ParcelasGridViewer from "../../components/pagesComponents/parcelasGridViewer";
import ParcelasWidgetViewer from "../../components/pagesComponents/parcelasWidgetViewer";
import useSWR from "swr";
import { DashboardSkeleton } from "../../components/skeletons/DashboardSkeleton";
import { getCsrfToken, useSession } from "next-auth/react";

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  function handleCLick() {
    router.push({
      pathname: `/plot/user/${session.address}`,
    });
  }

  const [parcelas, setParcelas] = useState([]);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    session?.isAdmin
      ? `/api/enhance/mytokens/all`
      : `/api/enhance/mytokens/${session.address}`,
    fetcher
  );
  const { data: total, error: error2 } = useSWR(
    session?.isAdmin
      ? `/api/co2Data/Admin/total`
      : `/api/co2Data/Cliente/Total/${session.address}`,
    fetcher
  );
  const { data: prom, error: error3 } = useSWR(
    session?.isAdmin
      ? `/api/co2Data/Admin/promedio`
      : `/api/co2Data/Cliente/Promedio/${session.address}`,
    fetcher
  );

  const { data: m2, error: error4 } = useSWR(
    session?.isAdmin
      ? `/api/co2Data/Admin/m2`
      : `/api/co2Data/Cliente/M2/${session.address}`,
    fetcher
  );
  if (error) {
    return <div>failed to load</div>;
  }
  if (!data) {
    return <DashboardSkeleton />;
  } else {
    return (
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            onClick={() => handleCLick()}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Refresh
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <ParcelasGridViewer tokens={data} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ParcelasWidgetViewer
            title="Total de Parcelas"
            total={data.length ? data.length : "0"}
            icon="material-symbols:token"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ParcelasWidgetViewer
            title="kg de CO2"
            total={total}
            color="info"
            icon="mdi:molecule-co2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ParcelasWidgetViewer
            title="m2 abarcados"
            total={m2}
            color="warning"
            icon="game-icons:plant-seed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ParcelasWidgetViewer
            title="Terreno utilizado"
            total={`${prom} %`}
            color="error"
            icon="ic:baseline-remove-red-eye"
          />
        </Grid>
      </Grid>
    );
  }
}
