import { useRouter } from "next/router";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import Iconify from "../../components/iconify";
import ParcelasGridViewer, {
  Parcela,
} from "../../components/pagesComponents/parcelasGridViewer";
import ParcelasWidgetViewer from "../../components/pagesComponents/parcelasWidgetViewer";
import useSWR from "swr";
import { DashboardSkeleton } from "../../components/skeletons/DashboardSkeleton";
import {getCsrfToken, useSession} from "next-auth/react";

export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession()

  function handleCLick() {
    // TODO: harcodeado no
    const parcela = new Parcela(
      "clerbc7s50000l5nkm288v8u5",
      10,
      20,
      100,
      40,
      200
    );
    router.push({
      pathname: `/plot/${parcela.id}`,
    });
  }

  const [parcelas, setParcelas] = useState([]);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    session.address ? `/api/enhance/mytokens/${session.address}` : null,
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
          <Paper elevation={3} sx={{ padding: "30px" }}>
            <ParcelasGridViewer tokens={data}></ParcelasGridViewer>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ParcelasWidgetViewer
            title="Total de Parcelas"
            total={31}
            icon="material-symbols:token"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ParcelasWidgetViewer
            title="Co2"
            total={492}
            color="info"
            icon="mdi:molecule-co2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ParcelasWidgetViewer
            title="Plantas Nuevas"
            total={43}
            color="warning"
            icon="game-icons:plant-seed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ParcelasWidgetViewer
            title="Ver Todos"
            total={100}
            color="error"
            icon="ic:baseline-remove-red-eye"
          />
        </Grid>
      </Grid>
    );
  }
}
