import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import Iconify from "../../../components/iconify";
import ParcelasGridViewer from "../../../components/pagesComponents/parcelasGridViewer";
import ParcelasWidgetViewer from "../../../components/pagesComponents/parcelasWidgetViewer";
import useSWR from "swr";
import { DashboardSkeleton } from "../../../components/skeletons/DashboardSkeleton";
const { PrismaClient } = require("./../../../node_modules/.prisma/client");

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  // Realiza una llamada a la API o base de datos para obtener los datos de la publicación con el ID correspondiente

  const client = await prisma.user.findMany({
    where: {
      address: context.query.address,
    },
  });
  return {
    props: {
      client,
    },
  };
}

export default function DashboardUser({ client }) {
  client = client[0];

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `/api/enhance/mytokens/${client.address}`,
    fetcher
  );
  const { data: total } = useSWR(
    `/api/co2Data/Cliente/Total/${client.address}`,
    fetcher
  );
  const { data: prom } = useSWR(
    `/api/co2Data/Cliente/Promedio/${client.address}`,
    fetcher
  );
  const { data: m2 } = useSWR(
    `/api/co2Data/Cliente/M2/${client.address}`,
    fetcher
  );
  if (error) {
    return <div>failed to load</div>;
  }
  if (!data) {
    return <DashboardSkeleton />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Typography variant="h4" gutterBottom>
          Usuario : {client.name}
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ display: "flex", justifyContent: "end" }}></Grid>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <ParcelasGridViewer tokens={data} address={client.address} />
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
          title="Co2"
          total={total}
          color="info"
          icon="mdi:molecule-co2"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <ParcelasWidgetViewer
          title="m2 abarcados"
          total={m2 ? m2 : "0"}
          color="warning"
          icon="game-icons:plant-seed"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <ParcelasWidgetViewer
          title="Terreno utilizado"
          // TODO: esta mal el tipo que se manda
          total={`${prom} %`}
          color="error"
          icon="ic:baseline-remove-red-eye"
        />
      </Grid>
    </Grid>
  );
}
