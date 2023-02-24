import { useUser } from "../../contexts/AppContext";
import { useAddress, useVmContract } from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import ParcelasWidgetViewer from "../../components/pagesComponents/parcelasWidgetViewer";
import Co2Graph from "../../components/pagesComponents/co2Graph";
import { Parcela } from "../../components/pagesComponents/parcelasGridViewer";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

export async function getServerSideProps(context) {
    const { id } = context.query;
  
    // Realiza una llamada a la API o base de datos para obtener los datos de la publicación con el ID correspondiente
    //const parcela = await prisma.parcela.findById() fetch(`https://mi-api.com/posts/${id}`).then(res => res.json());
    const laparce = new Parcela(1, 10, 20, 100, 40, 200)
    const parcela =JSON.parse(JSON.stringify(laparce))
    // Devuelve los datos como propiedades para renderizar la página
    return {
      props: {
        parcela
      },
    };
  }
  

export default function plot({parcela}) {
    const user = useUser();
    const vmContract = useVmContract()
    const address = useAddress()
    const router = useRouter();
    const [tokens, setTokens] = useState(null);

    console.log(parcela)

    if (!parcela) {
        //if (false){
        return (<div className="App">Loading...</div>)
    }
    else {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        {"Parcela " + parcela.latitud +" : " + parcela.longitud}
                    </Typography>
                    <Button variant="contained">
                        Actualizar  
                    </Button>
                </Stack>
                <Grid container spacing={2} >
                    <Grid item xs={12} md={12}>
                        <Item sx={{ height: "42vH" }} >
                            <Co2Graph/>
                        </Item>
                    </Grid>

                    //aca abajo van las fotos
                    <Grid item xs={12} sm={6} md={3}>
                        <ParcelasWidgetViewer title="Total de Parcelas" total={31} icon={'material-symbols:token'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <ParcelasWidgetViewer title="Co2" total={492} color="info" icon={'mdi:molecule-co2'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <ParcelasWidgetViewer title="Plantas Nuevas" total={43} color="warning" icon={'game-icons:plant-seed'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <ParcelasWidgetViewer title="Ver Todos" total={100} color="error" icon={'ic:baseline-remove-red-eye'} />
                    </Grid>
                </Grid>
            </Box>
        )
    }

}


