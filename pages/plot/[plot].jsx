import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import ParcelasWidgetViewer from "../../components/pagesComponents/parcelasWidgetViewer";
import ImageWithHover from "../../components/ImageWithHoverComponent";
import Co2Graph from "../../components/pagesComponents/co2Graph";
import DataGrid from "../../components/pagesComponents/dataGrid";
import useSWR from "swr";
import { DashboardSkeleton } from "../../components/skeletons/DashboardSkeleton";
import { EditPlotDialog } from "../../components/dialog/EditPlotDialog";

const { PrismaClient } = require("./../../node_modules/.prisma/client");

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  // Realiza una llamada a la API o base de datos para obtener los datos de la publicación con el ID correspondiente
  const parcela = await prisma.parcela.findMany({
    where: {
      id: context.query.plot,
    },
  });

  const owner = await prisma.user.findMany({
    where: {
      address: parcela[0].address,
    },
  });

  const aux = await prisma.history.findMany({
    where: {
      pid: parcela[0].id,
    },
    orderBy: {
      date: "desc",
    },
    take: 1,
  });

  const lastLog = JSON.parse(JSON.stringify(aux[0]));

  return {
    props: {
      parcela,
      lastLog,
      owner,
    },
  };
}

export default function Plot({ parcela, lastLog, owner }) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: data, error: error1 } = useSWR(
    `/api/co2Data/Parcela/Anual/${parcela[0].id}`,
    fetcher
  );

  const { data: total, error: error2 } = useSWR(
    `/api/co2Data/Parcela/Total/${parcela[0].id}`,
    fetcher
  );
  parcela = parcela[0];
  owner = owner[0];
  const actualData = {
    percentage: `${lastLog.m2used}`,
    m2: (`${lastLog.m2used}` / 100) * `${parcela.m2}`,
    height: `${lastLog.m3}`,
    total: `${total}`,
  };
  const actualPlot = {
    latitud: parcela.latitud,
    longitud: parcela.longitud,
    m2: parcela.m2,
    m2used: lastLog.m2used,
    m3: lastLog.m3,
    pid: lastLog.pid,
    userName: owner? owner.name: parcela.address,
  };
  const handleEditPlot = (plot) => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  if (!data) {
    //if (false){
    return <DashboardSkeleton />;
  } else {
    return (
      <Box sx={{ height: "100%" }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {`Parcela ${parcela.latitud} : ${parcela.blockId}`}
              </Typography>
              <Typography variant="h5" gutterBottom>
                {`Dueño ${owner? owner.name: parcela.blockId}`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "end" }}>
            <Button id="button-update" variant="contained">
              Actualizar
            </Button>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item sm={12} md={7}>
                    <Typography variant="h5" gutterBottom>
                      CO2 Combatido
                    </Typography>
                    <Co2Graph datos={data} />
                  </Grid>
                  <Grid item sm={12} md={5}>
                    <DataGrid datos={actualData} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ImageWithHover
                  fallbackImage="https://picsum.photos/500/300"
                  imageKey="1"
                  parcelaId={parcela.blockId}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ImageWithHover
                  fallbackImage="https://picsum.photos/500/300"
                  imageKey="2"
                  parcelaId={parcela.blockId}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ImageWithHover
                  fallbackImage="https://picsum.photos/500/300"
                  imageKey="3"
                  parcelaId={parcela.blockId}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ImageWithHover
                  fallbackImage="https://picsum.photos/500/300"
                  imageKey="4"
                  parcelaId={parcela.address}
              />
            </Grid>
          </Grid>
        </Grid>
        {parcela && (
          <EditPlotDialog
            open={openEditDialog}
            handleClose={handleCloseEditDialog}
            selectedPlot={actualPlot}
            users={[]}
          />
        )}
      </Box>
    );
  }
}
