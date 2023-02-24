import { useState, useEffect, useRef } from "react";
const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

import { useUser } from "../../contexts/AppContext";
import { useAddress, useVmContract, useWeb3 } from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
import useSWR from "swr";
import style from "./create.module.css";
import axios from "axios";
import RedirectPage from "../../components/redirect/RedirectPage";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import Iconify from "../../components/iconify";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(5),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

export async function getServerSideProps(context) {
  const users = await prisma.user.findMany();

  return {
    props: {
      users,
    },
  }
}

export default function home({ users }) {
  const router = useRouter();
  const address = useAddress();
  const web3 = useWeb3();
  const user = useUser();
  const latitude = useRef();
  const longitude = useRef();
  const area = useRef();
  const sliderRef = useRef();
  const averageHeight = useRef();
  const userOwner = useRef();
  const vmContract = useVmContract();


  const [error, setError] = useState(null);

  const shouldRedirect = !user;

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [shouldRedirect, router]);



  const handleSave = async (e) => {
    e.preventDefault();
    console.log(Number(
      sliderRef.current.innerText)
    );
    let a = await vmContract.methods.createCollectible(latitude.current.value, longitude.current.value).send({ from: address })
    const parcela = {
      address:address,
      latitud: Number(latitude.current.value),
      longitud: Number(longitude.current.value),
      m2: Number(area.current.value),
      m2used: Number(sliderRef.current.innerText),
      m3: Number(averageHeight.current.value),
      address: Number(userOwner.current.value),
    };


    const result = await axios.post("/api/parcelacreate", parcela);
    console.log(result)
    if (result.data == -1){
      alert('parcela already exist')
    }else{
    router.push("/home")
  };

  return (
    <Box sx={{ flexGrow: 1 }}> 
      {
      shouldRedirect ? (<RedirectPage /> ) : 
      <><Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography component="h1" variant="h4">
              Crear parcela
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Refresh
            </Button>
          </Stack>
          <Item  sx={{height: "50vH"}} >
          <Grid container component="form" onSubmit={handleSave} spacing={1}>
            <Grid item xs={12}>
                <InputLabel id="userOwner-label">Dueño</InputLabel>
                <Select
                  margin="normal"
                  value={"null"}
                  fullWidth
                  id="userOwner"
                  label="Dueño"
                  name="userOwner"
                  autoComplete="userOwner"
                >
                  <MenuItem selected defaultChecked value={"null"}>
                    Sin asignar
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem value={user.address}>{user.name}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  inputRef={latitude}
                  margin="normal"
                  required
                  fullWidth
                  id="latitude"
                  label="Latitud"
                  name="latitude" />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  inputRef={longitude}
                  margin="normal"
                  required
                  fullWidth
                  id="longitude"
                  label="Longitud"
                  name="longitude" />
              </Grid>
              <Grid item xs={6}>
                <Typography component="h3" variant="h4">
                  Porcentaje de área usada
                </Typography>
                <Slider
                  id="areaPercent"
                  defaultValue={50}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                  ref={sliderRef} />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  inputRef={area}
                  margin="normal"
                  required
                  fullWidth
                  id="area"
                  label="Área"
                  name="area" />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  inputRef={averageHeight}
                  margin="normal"
                  required
                  fullWidth
                  id="averageHeight"
                  label="Altura promedio"
                  name="averageHeight"
                  autoComplete="averageHeight" />
              </Grid>
              <Grid item xs={3}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                  }}
                >
                  Guardar
                </Button>
                {error && <Typography variant="body2">{error}</Typography>}
              </Grid>
            </Grid>
            </Item>
            </>
    }
    </Box >
  );
}
