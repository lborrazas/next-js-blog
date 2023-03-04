import { useState, useEffect, useRef } from "react";

const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();

import { useUser } from "../../contexts/AppContext";
import { useAddress, useVmContract } from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
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

// TODO: Para que se esta mandando el context?
export async function getServerSideProps(context) {
  const users = await prisma.user.findMany();

  return {
    props: {
      users,
    },
  };
}

export default function Create({ users }) {
  const router = useRouter();
  const address = useAddress();
  const user = useUser();
  const latitude = useRef();
  const longitude = useRef();
  const area = useRef();
  const sliderRef = useRef();
  const averageHeight = useRef();
  const vmContract = useVmContract();

  const [owner, setOwner] = useState();

  // TODO: no se esta cambiando el estado del error
  const [error, setError] = useState(null);

  const shouldRedirect = !user;

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [shouldRedirect, router]);

  const handleSave = async (e) => {
    e.preventDefault();
    const parcela = {
      address: owner,
      latitud: Number(latitude.current.value),
      longitud: Number(longitude.current.value),
      m2: Number(area.current.value),
      m2used: Number(sliderRef.current.innerText),
      m3: Number(averageHeight.current.value),
    };
    const result = await axios.post("/api/parcelacreate", parcela);

    if (result.data === -2) {
      alert("parcela already exist");
    } else {
      // TODO: esto se deberia usar en algun lado?
      const a = await vmContract.methods
        .createCollectible(longitude.current.value, latitude.current.value)
        .send({ from: address });

      router.push("/home");
    }
  };

  const handleChangeOwner = (event) => {
    setOwner(event.target.value);
  };

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
              Crear parcela
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Refresh
            </Button>
          </Stack>
          <Paper elevation={3} sx={{ padding: "30px" }}>
            <Grid container component="form" onSubmit={handleSave} spacing={1}>
              <Grid item xs={12}>
                <InputLabel id="owner-label">Dueño</InputLabel>
                <Select
                  value={owner}
                  fullWidth
                  id="owner-label"
                  label="Dueño"
                  onChange={handleChangeOwner}
                  required
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user}>
                      {user.name}
                    </MenuItem>
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
                  name="latitude"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  inputRef={longitude}
                  margin="normal"
                  required
                  fullWidth
                  id="longitude"
                  label="Longitud"
                  name="longitude"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography component="h3" variant="h6">
                  Porcentaje de área usada
                </Typography>
                <Slider
                  id="areaPercent"
                  defaultValue={0}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                  ref={sliderRef}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  inputRef={area}
                  margin="normal"
                  required
                  fullWidth
                  id="area"
                  label="Área"
                  name="area"
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  inputRef={averageHeight}
                  margin="normal"
                  required
                  fullWidth
                  id="averageHeight"
                  label="Altura promedio"
                  name="averageHeight"
                  autoComplete="averageHeight"
                />
              </Grid>
              <Grid item xs={12} md={3}>
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
          </Paper>
        </>
      )}
    </Box>
  );
}
