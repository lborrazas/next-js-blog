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
import DataGrid from "../../components/pagesComponents/dataGrid";
import { Parcela } from "../../components/pagesComponents/parcelasGridViewer";
import { useSWR } from "swr";

const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

export async function getServerSideProps(context) {
    const data = context.query;
    console.log(data)
    // Realiza una llamada a la API o base de datos para obtener los datos de la publicación con el ID correspondiente
    const parcela = await prisma.parcela.findMany(
        {
            where: {
                latitud: 1,
                longitud: 1
            },
        }
    )


    const owner = await prisma.user.findMany({
        where: {
            address: parcela[0].address
        }
    })

    let aux = await prisma.history.findMany({
        where: {
            pid: parcela.id,
        },
        orderBy: {
            date: 'desc'
        },
        take: 1
    });

    const lastLog = JSON.parse(JSON.stringify(aux[0]))








    // fetch(`https://mi-api.com/posts/${id}`).then(res => res.json());
    //const parcela =JSON.parse(JSON.stringify(laparce))
    // Devuelve los datos como propiedades para renderizar la página

    return {
        props: {
            parcela,
            lastLog,
            owner
        },
    };
}


export default function plot({ parcela, lastLog, owner }) {

    const user = useUser();
    const vmContract = useVmContract()
    const address = useAddress()
    const router = useRouter();
    parcela = parcela[0]
    owner = owner[0]
    const datos = [] // todo  casos

    //const fetcher = (url) => fetch(url).then((res) => res.json())
    //const { data, error } = useSWR(`/api/getparcela`, fetcher({longitud:parcela.longitud,latitud:parcela.latitud}))      
    //console.log(error)


    //if (error) {

    //  return <div>failed to load</div>;}

    if (!parcela) {
        //if (false){
        return (<div className="App">Loading...</div>)
    }
    else {
        console.log(parcela)
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            {"Parcela " + parcela.latitud + " : " + parcela.longitud}
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            {"Dueño " + owner.name}
                        </Typography>
                    </Box>
                    <Button id="actualizar" variant="contained">
                        Actualizar
                    </Button>
                </Stack>
                <Grid container spacing={2} >
                    <Grid item xs={12} md={12}>
                        <Item sx={{ height: "42vH" }} >
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={7}>
                                    <Typography variant="h5" gutterBottom>
                                        CO2 Combatido
                                    </Typography>
                                    <Co2Graph datos={datos}/>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                  <DataGrid/>
                                </Grid>
                            </Grid>
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


