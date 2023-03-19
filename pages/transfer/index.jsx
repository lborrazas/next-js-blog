import { useEffect, useState } from "react";
import axios from "axios";
import { useAddress, useVmContract } from "../../blockchain/BlockchainContext";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import useSWR from "swr";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { TransferSkeleton } from "../../components/skeletons/TransferSkeleton";
import { useSession } from "next-auth/react";
import Paper from "@mui/material/Paper";

export default function Transfer() {
  const [errorb, setError] = useState("");
  const [forwardAddress, setForwardAddress] = useState("");
  const address = useAddress();
  const vmContract = useVmContract();
  const { data: session } = useSession();

  const fetcher = (url) => fetch(url).then((res) => res.json());
  //todo el null hace que no haga nada, no parece un comportamiento correcto,
  // salvo que no queiras que haga llamada

  const { data, error , isLoading} = useSWR(
    session.address ? `api/parcela/address/${session.address}` : null,
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

 

  const handleChange = (event) => {
    // SelectChangeEvent
    setParcela(event.target.value);
  };

  useEffect(() => {
    if (!isLoading) {
      setParcela(data);
    }
  }, [isLoading, data]);

  async function transaccion() {
    const max = await vmContract.tokenCounter();
    // TODO: esto nunca se esta usando
    const tokens_temp = [];
    const parcela_id = [];
    for (let i = 0; i < max; i++) {
      const parse = await vmContract.tokenIdToParcelasIndex(i);
      if (
        Number(parse.latitud) === parcela.latitud &&  
        Number(parse.longitud) === parcela.longitud
      ) {
        tokens_temp.push(parse);
        parcela_id.push(i);

      }
    }
    
    console.log(forwardAddress)
    console.log(parcela_id)
    
    await vmContract["safeTransferFrom(address,address,uint256)"](
      session.address,
      forwardAddress,
      parcela_id[0]
    ).then(async (rest) =>{axios.post("/api/transfer", { body: { history_address: forwardAddress, id: parcela.id },})});
    alert(`NFT ${parcela_id[0]} transferred from ${session.address} to ${forwardAddress}`);
    setOpen(false);
  }

  async function handleCLick(addressF) {
    const body = { address: addressF };
    await axios
      .post("/api/getuser", body)
      .then((res) => {
        if (res.data[0]) {
          setMess(res.data[0].name);
          popUP();
        } else {
          setMess(`address is not registered on our database`);
          popUP();
        }
      })
      .catch(() => {});
  }

  const handleSignup = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    if (data.get("parcela") === "" || data.get("address") === "") {
      setError("Los campos no pueden ser vacios");
    } else {
      console.log(data.get("address"))
      setForwardAddress(data.get("address"));
      handleCLick(data.get("address"));
    }
  };

  if (error) {
    return <div>failed to load</div>;
  }
  if (!data) {
    return <TransferSkeleton />;
  }
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography component="h1" variant="h4">
        Transferir parcela
      </Typography>
      <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 1 }}>
        <InputLabel>Parcela</InputLabel>
        <Select
          labelId="parcelas"
          id="parcela"
          value={parcela}
          label="parcela"
          onChange={handleChange}
          fullWidth
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
          id="address"
          label="Address"
          name="address"
          autoComplete="address"
          required
          fullWidth
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
        <DialogTitle>TRANSACCION DE PARCELA</DialogTitle>

        <div>
          <Typography>
            Transaccion dirigida a: <a>{mess}</a>
          </Typography>
        </div>

        <Button onClick={() => setOpen(false)} color="primary">
          Decline
        </Button>
        <Button onClick={() => transaccion()} color="primary">
          Accept
        </Button>
      </Dialog>
      {errorb && <Typography variant="body2">{errorb}</Typography>}
    </Paper>
  );
}
