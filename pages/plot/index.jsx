import { useUser, setTokens, useTokens } from "../../contexts/AppContext";
import { useAddress, useVmContract } from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Iconify from "../../components/iconify";
import ParcelasGridViewer, {
  Parcela,
} from "../../components/pagesComponents/parcelasGridViewer";
import ParcelasWidgetViewer from "../../components/pagesComponents/parcelasWidgetViewer";
import axios from "axios";
import { Token } from "@mui/icons-material";
import useSWR from "swr";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function plot() {
  const user = useUser();
  const vmContract = useVmContract();
  const address = useAddress();
  const router = useRouter();

  function handleCLick() {
    const parcela = new Parcela(1, 10, 20, 100, 40, 200);
    router.push({
      pathname: `/plot/${parcela.id}`,
    });
  }

  const tokens = useTokens();
  const [parcelas, setParcelas] = useState([]);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    address ? `/api/enhance/mytokens/${address}` : null,
    fetcher
  );
  console.log(error);

  if (error) {
    return <div>failed to load</div>;
  }
  if (!data) {
    //if (false){
    return <div className="App">Loading...</div>;
  } else {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Button
            onClick={() => handleCLick()}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Refresh
          </Button>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Item sx={{ height: "42vH" }}>
              <ParcelasGridViewer tokens={data}></ParcelasGridViewer>
            </Item>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ParcelasWidgetViewer
              title="Total de Parcelas"
              total={31}
              icon={"material-symbols:token"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ParcelasWidgetViewer
              title="Co2"
              total={492}
              color="info"
              icon={"mdi:molecule-co2"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ParcelasWidgetViewer
              title="Plantas Nuevas"
              total={43}
              color="warning"
              icon={"game-icons:plant-seed"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ParcelasWidgetViewer
              title="Ver Todos"
              total={100}
              color="error"
              icon={"ic:baseline-remove-red-eye"}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }
}
