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

import RedirectPage from "../../components/redirect/RedirectPage";


export default function transfer() {
    const [error, setError] = useState("");
    const username = useRef();
    const email = useRef();

    const setUser = useSetUser();
    const address = useAddress();
    const router = useRouter();
    const vmContract = useVmContract();
    useEffect(() => {

        setError("");
    }, [username, email]);

    const [parcela, setParcela] = useState('');

    const handleChange = (event) => {
        // SelectChangeEvent
        setParcela(event.target.value);
    };


    const myTokens = async () => {

        let max = await vmContract.methods.tokenCounter().call();
        let tokens_temp = [];
        for (let i = 0; i < max; i++) {
            let address_temp = await vmContract.methods.ownerOf(i).call()
            let parse = await vmContract.methods.tokenIdToParcelasIndex(i).call();
            if (address == address_temp) {
                tokens_temp.push(parse);
            }
        }
        return tokens_temp
    }


    const handleSignup = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        if (data.get("username") === "" || data.get("email") === "") {
            setError("Los campos no pueden ser vacios");
        } else {
            cosasParaSignup(data.get("username"), data.get("email"));
        }
    };
    const currentTokens = undefined;

    if (currentTokens) {
        return(<RedirectPage />)
    }
    else {
        return (

            <div className={style.signupPage}>
                <div className={style.signupContainer}>
                    <Typography component="h1" variant="h4">
                        IxaTesis
                    </Typography>
                    <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 1 }}>
                        <InputLabel id="">Age</InputLabel>
                        <Select
                            labelId="parcelas"
                            id="demo-simple-selec"
                            value={parcela}
                            label="parcela"
                            onChange={handleChange}
                        >
                            {
                                currentTokens.map((parcela) => (
                                    <MenuItem value={10}>Lat:{parcela.latitude},Long:{parcela.longitud}</MenuItem>
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
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                            }}
                        >
                            Crear cuenta
                        </Button>
                    </Box>
                    {error && <Typography variant="body2">{error}</Typography>}
                </div>
            </div>
        );
    }
}
