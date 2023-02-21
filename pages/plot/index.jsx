import {useUser} from "../../contexts/AppContext";
import {useAddress, useVmContract} from "../../blockchain/BlockchainContext";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {Button, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Iconify from '../../components/iconify';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function plot() {
    const user = useUser()
    //const vmContract = useVmContract()
    //const address = useAddress()
    const router  = useRouter()
    const [tokens,setTokens] = useState(null)


    const allTokens = async () =>{
        let max= await vmContract.methods.tokenCounter().call()
        let plots = []
        for (let i=0; i<max; i++){
            //let address_temp= await vmContract.methods.ownerOf(i).call()
            let parse= await vmContract.methods.tokenIdToParcelasIndex(i).call()
            plots.push(parse)
        }
        setTokens(plots)
    }

    //allTokens()

   // if (!tokens){
    if (false){
        return(<div className="App">Loading...</div>)
    }
    else{
        return(
            <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Dashboard
                    </Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                        Refresh
                    </Button>
                </Stack>
                <Grid container spacing={2}>
                    <Grid  item xs={6} md={12}>
                        <Item >xs=6 md=8</Item>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Item>xs=6 md=4</Item>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Item>xs=6 md=4</Item>
                    </Grid>
                    <Grid item xs={6} md={8}>
                        <Item>xs=6 md=8</Item>
                    </Grid>
                </Grid>
            </Box>
        )
    }

}
