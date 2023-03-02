import { useState, useEffect, useRef } from "react";

import { useUser } from "../../contexts/AppContext";
import {
  useAddress,
  useVmContract,
  useWeb3,
} from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
import useSWR from "swr";
import style from "./update.module.css";
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

export default function Update({ users }) {
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

  // ? esto no se usa
  const [errora, setError] = useState(null);

  const shouldRedirect = !user;
  const id = "clef5scf80004f9fcn8gwd3vt";
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(id ? `/api/parcela/${id}` : null, fetcher);
  // body: {"latitude":1,"longitud":1}

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [shouldRedirect, router]);

  const handleSave = async (e) => {
    e.preventDefault();
    console.log(Number(sliderRef.current.innerText));
    let a = await vmContract.methods
      .createCollectible(latitude.current.value, longitude.current.value)
      .send({ from: address });
    const parcela = {
      //address: address,
      latitud: Number(latitude.current.value),
      longitud: Number(longitude.current.value),
      m2: Number(area.current.value),
      m2used: Number(sliderRef.current.innerText),
      m3: Number(averageHeight.current.value),
      address: Number(userOwner.current.value),
    };

    console.log(result);
    if (result.data == -1) {
      alert("parcela already exist");
    } else {
      router.push("/home");
    }
  };
  if (error) {
    return <div> failed to load</div>;
  }
  if (!data) {
    return <div className="App">Loading...</div>;
  } else {
    return (
      <Box sx={{ flexGrow: 1 }}>
        {shouldRedirect ? (
          <RedirectPage />
        ) : (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={5}
            >
              <Typography component="h1" variant="h4">
                Actualizar informacón de la parcela
              </Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Refresh
              </Button>
            </Stack>
            <Item sx={{ height: "50vH" }}>
              <Grid
                container
                component="form"
                onSubmit={handleSave}
                spacing={1}
              >
                <Grid item xs={12}>
                  <InputLabel id="userOwner-label">Dueño</InputLabel>
                  <Select
                    className={`${style.disabledSelect}`}
                    margin="normal"
                    value={data[0].address}
                    fullWidth
                    id="userOwner"
                    label="Dueño"
                    readOnly="false"
                    name="userOwner"
                    autoComplete="userOwner"
                  >
                    <MenuItem selected defaultChecked value={data[0].address}>
                      {data[0].userName}
                    </MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    inputRef={latitude}
                    value={data[0].latitud}
                    margin="normal"
                    required
                    fullWidth
                    id="latitude"
                    label="Latitud"
                    name="latitude"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    inputRef={longitude}
                    value={data[0].longitud}
                    margin="normal"
                    required
                    fullWidth
                    id="longitude"
                    label="Longitud"
                    name="longitude"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography component="h3" variant="h4">
                    Porcentaje de área usada
                  </Typography>
                  <Slider
                    id="areaPercent"
                    value={data[0].m2used}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    ref={sliderRef}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    inputRef={area}
                    value={data[0].m2}
                    margin="normal"
                    required
                    fullWidth
                    id="area"
                    label="Área"
                    name="area"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    inputRef={averageHeight}
                    value={data[0].m3}
                    margin="normal"
                    required
                    fullWidth
                    id="averageHeight"
                    label="Altura promedio"
                    name="averageHeight"
                    autoComplete="averageHeight"
                  />
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
        )}
      </Box>
    );
  }
}
