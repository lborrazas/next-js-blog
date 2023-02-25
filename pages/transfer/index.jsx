import { useRef, useState, useEffect } from "react";
import style from "./transfer.module.css";
import axios from "axios";
import { User, useSetUser } from "../../contexts/AppContext";
import { useAddress, useVmContract, useWeb3 } from "../../blockchain/BlockchainContext";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import useSWR from 'swr';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import RedirectPage from "../../components/redirect/RedirectPage";
import { func } from "prop-types";


export default function transfer() {
    const [errorb, setError] = useState("");
    const username = useRef();
    const [forwardAddress, setForwardAddress] = useState("");
    const address = useAddress();
    const router = useRouter();
    const vmContract = useVmContract();

    const fetcher = (url) => fetch(url).then((res) => res.json())
    const { data, error } = useSWR(address ? `api/parcela/${address}` : null, fetcher)

    const [parcela, setParcela] = useState({ lat: null, long: null, id: null });


   // const [open, setOpen] = useState(false);

    //const handleOpen = () => {
     //   setOpen(true);
    //};

    //const handleClose = (tran) => {
     //   if (tran) {

            //transaccion(tran)
       // }
       // setOpen(false);
    //};

    const handleChange = (event) => {
        // SelectChangeEvent
        setParcela(event.target.value);

    };


    async function transaccion(add) {
        let max = await vmContract.methods.tokenCounter().call();
        let tokens_temp = [];
        let id = [];
        for (let i = 0; i < max; i++) {
            let address_temp = await vmContract.methods.ownerOf(i).call()
            let parse = await vmContract.methods.tokenIdToParcelasIndex(i).call();
            if (parse.latitud == parcela.lat && parse.longitud == parcela.long) {
                tokens_temp.push(parse);
                id.push(i)
            }
        }
        contract.methods.safeTransferFrom(address, add, id[0]).send({ from: address }).then((receipt) => {
            console.log(`NFT ${id[0]} transferred from ${address} to ${add}`);
            alert(`NFT ${id[0]} transferred from ${address} to ${add}`);
        });
    }



    async function handleCLick(add) {
        germen_address = '0x5CBf6A1Ce51917A25F14164d5396AdDEAc73D26f'
        if (add == germen_address) {
            let body = { address: add };
            const is_registered = await axios.post("/api/getuser", body);
            if (is_registered[0]) {
                popUP(`${add} is nor register on our database`, add)
            }
            else { popUP(``, add) }
        }
        else { console.log('no esta bien la address') }
    }


    const handleSignup = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        if (data.get("parcela") === "" || data.get("address") === "") {
            setError("Los campos no pueden ser vacios");
        } else {
            // handleCLick(data.get("address"));
        }
    };
    console.log(parcela)

    if (error) {
        return <div>failed to load</div>;
    }
    if (!data) {
        return (<RedirectPage />)
    }
    else {
        console.log(parcela)
        return (

            <div className={style.signupPage}>
                <div className={style.signupContainer}>
                    <Typography component="h1" variant="h4">
                        IxaTesis
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <InputLabel id="">Parcela</InputLabel>
                        <Select
                            labelId="parcelas"
                            id="parcela"
                            name="parcela"
                            value={parcela}
                            label="parcela"
                            onChange={handleChange}
                        >
                            {
                                data.map((parcela) => (
                                    <MenuItem key={parcela.id} value={parcela}>  Lat:{parcela.latitud}, Long:{parcela.longitud} m2:{parcela.m2}</MenuItem>
                                    // <Box>{parcela.id}</Box>
                                ))
                                //
                            }


                        </Select>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="address"
                            label="Address"
                            name="address"
                            autoComplete="address"
                            value={forwardAddress}
                        />
                        <Button
                            onClick={() => handleSignup()}
                            type="submit"
                            fullWidth
                            variant="contained"

                            sx={{
                                mt: 3,
                                mb: 2,
                            }}
                        >
                            Transferir
                        </Button>
                    </Box>
                    <Dialog open={false} >
                        <DialogTitle>Popup Modal Title</DialogTitle>

                        <TextField>
                            This is the content of the popup modal.
                        </TextField>

                        <Button onClick={(false)} color="primary">
                            Decline
                        </Button>
                        <Button onClick={(true)} color="primary">
                            Accept
                        </Button>

                    </Dialog>


                    {errorb && <Typography variant="body2">{errorb}</Typography>}
                </div>
            </div>
        );
    }
}
