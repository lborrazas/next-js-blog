import { useRef, useState } from "react";
import style from "./transfer.module.css";
import axios from "axios";
import { useAddress, useVmContract } from "../../blockchain/BlockchainContext";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import useSWR from "swr";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import RedirectPage from "../../components/redirect/RedirectPage";
import { TransferSkeleton } from "../../components/skeletons/TransferSkeleton";

export default function Transfer() {
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
    const max = await vmContract.methods.tokenCounter().call();
    const tokens_temp = [];
    const parcela_id = [];
    for (let i = 0; i < max; i++) {
      const parse = await vmContract.methods.tokenIdToParcelasIndex(i).call();
      if (
        Number(parse.latitud) === parcela.latitud &&
        Number(parse.longitud) === parcela.longitud
      ) {
        tokens_temp.push(parse);
        parcela_id.push(i);
      }
    }
    axios.post("/api/transfer", {
      body: { toAdd: forwardAddress, id: parcela.id },
    });
    await vmContract.methods
      .safeTransferFrom(address, forwardAddress, Number(parcela_id[0]))
      .send({ from: address });
    alert(
      `NFT ${parcela_id[0]} transferred from ${address} to ${forwardAddress}`
    );
  }

  async function handleCLick() {
    const body = { address: forwardAddress };
    await axios
      .post("/api/getuser", body)
      .then((res) => {
        // para el linter? eslint y prettier
        // porque los agregue como dependencias, y se tenian que instalar jajaja
        // si miras en .prettierrc.json y .eslintrc.json tenes las config
        // vs code por defecto no te las toma no, tenes que instalarle los plugins
        // para que sepa que hacer con eso
        //oice
        if (!res.data[0]) {
          setMess(`address is nor register on our database`);
          popUP();
        } else {
          setMess(``);
          popUP();
        }
      })
      .catch((err) => {
        console.error(err);
      });
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

  if (error) {
    return <div>failed to load</div>;
  }
  if (!data) {
    return <TransferSkeleton />;
  } else {
    return (
      <div className={style.signupPage}>
        <div className={style.signupContainer}>
          <Typography component="h1" variant="h4">
            Transferir parcela
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignup}
            noValidate
            sx={{ mt: 1 }}
          >
            <InputLabel id="parcela">Parcela</InputLabel>
            <Select
              labelId="parcelas"
              id="parcela"
              name="parcela"
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
            <DialogTitle>Popup Modal Title</DialogTitle>

            <Typography>Continuar con la transaccion.</Typography>
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
