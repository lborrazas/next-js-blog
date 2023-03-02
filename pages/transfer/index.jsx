import { useRef, useState, useEffect } from "react";
import style from "./transfer.module.css";
import axios from "axios";
import { User, useSetUser } from "../../contexts/AppContext";
import {
  useAddress,
  useVmContract,
  useWeb3,
} from "../../blockchain/BlockchainContext";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import useSWR from "swr";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import RedirectPage from "../../components/redirect/RedirectPage";
import { func } from "prop-types";

export default function transfer() {
  const [errorb, setError] = useState("");
  const username = useRef();
  const [forwardAddress, setForwardAddress] = useState("");
  const address = useAddress();
  const router = useRouter();
  const vmContract = useVmContract();

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    address ? `api/parcela/address/${address}` : null,
    fetcher
  );

  const [parcela, setParcela] = useState({ lat: null, long: null, id: null });
  const [mess, setMess] = useState("");

  const [open, setOpen] = useState(false);

  const popUP = () => {
    setOpen(true);
  };
  const handleClose = (tran_bool) => {
    setOpen(false);
  };

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

  async function transaccion() {
    let max = await vmContract.methods.tokenCounter().call();
    let tokens_temp = [];
    let parcela_id = [];
    for (let i = 0; i < max; i++) {
      let parse = await vmContract.methods.tokenIdToParcelasIndex(i).call();
      console.log("===================");
      console.log(Number(parse.latitud));
      console.log(parcela.latitud);

      console.log(parcela.longitud);
      console.log(Number(parse.longitud));
      console.log("===================");
      if (
        Number(parse.latitud) === parcela.latitud &&
        Number(parse.longitud) === parcela.longitud
      ) {
        tokens_temp.push(parse);
        parcela_id.push(i);
        console.log("entro");
      }
    }
    console.log("_________________________");
    console.log(parcela);
    // axios.post('/api/transfer',{body:{toAdd:forwardAddress,fromAdd:address,id:parcela_id}})
    //await vmContract.methods.safeTransferFrom(address, forwardAddress, id[0]).send({ from: address })
    console.log(parcela_id);
    console.log(
      `NFT ${parcela_id[0]} transferred from ${address} to ${forwardAddress}`
    );
    alert(
      `NFT ${parcela_id[0]} transferred from ${address} to ${forwardAddress}`
    );
  }

  async function handleCLick() {
    const germen_address = "0x5CBf6A1Ce51917A25F14164d5396AdDEAc73D26f";
    let body = { address: forwardAddress };
    const is_registered = await axios.post("/api/getuser", body);

    if (is_registered.data[0]) {
      setMess(`address is nor register on our database`);
      popUP();
    } else {
      setMess(``);
      popUP();
    }
  }

  const handleSignup = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("parcela") === "" || data.get("address") === "") {
      setError("Los campos no pueden ser vacios");
    } else {
      setForwardAddress(data.get("address"));
      handleCLick();
    }
  };
  console.log(parcela);

  if (error) {
    return <div>failed to load</div>;
  }
  if (!data) {
    return <RedirectPage />;
  } else {
    console.log(parcela);
    return (
      <div className={style.signupPage}>
        <div className={style.signupContainer}>
          <Typography component="h1" variant="h4">
            IxaTesis
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignup}
            noValidate
            sx={{ mt: 1 }}
          >
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
                  <MenuItem key={parcela.id} value={parcela}>
                    {" "}
                    Lat:{parcela.latitud}, Long:{parcela.longitud} m2:
                    {parcela.m2}
                  </MenuItem>
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
              Transferir
            </Button>
          </Box>
          <Dialog open={open}>
            <DialogTitle>Popup Modal Title</DialogTitle>

            <Typography>This is the content of the popup modal.</Typography>
            <Typography>{mess}</Typography>

            <Button onClick={() => setOpen(false)} color="primary">
              Decline
            </Button>
            <Button onClick={() => transaccion()} color="primary">
              Accept
            </Button>
          </Dialog>

          {errorb && <Typography variant="body2">{errorb}</Typography>}
        </div>
      </div>
    );
  }
}
