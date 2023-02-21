import { useState, useEffect, useRef } from "react";

import { useUser } from "../../contexts/AppContext";
import { useAddress, useVmContract, useWeb3 } from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
import style from "./create.module.css";
import axios from "axios";
import RedirectPage from "../../components/redirect/RedirectPage";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function home() {
  const router = useRouter();
  const address = useAddress();
  const web3 = useWeb3();
  const user = useUser();
  const latitude = useRef();
  const longitude = useRef();
  const area = useRef();
  const sliderRef = useRef();
  const averageHeight = useRef();
  const vmContract = useVmContract();

  const [error, setError] = useState(null);

  const shouldRedirect = !user;

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [shouldRedirect, router]);

 

  const handleSave = async(e) => {
    e.preventDefault();
    console.log(Number( 
      sliderRef.current.innerText)
    );
    let a = await vmContract.methods.createCollectible(latitude.current.value,longitude.current.value).send({ from: address })
    const parcela = {
      latitud: Number(latitude.current.value),
      longitud: Number(longitude.current.value),
      m2:Number(area.current.value),
      m2used:Number(sliderRef.current.innerText),
      m3:Number(averageHeight.current.value),
    };
   

    await axios.post("/api/parcelacreate", parcela);

    router.push("/home")
    

  };

  return (
    <div>
      {shouldRedirect ? (
        <RedirectPage />
      ) : (
        <>
          <Typography component="h1" variant="h4">
            Crear parcela
          </Typography>
          <Grid container component="form" onSubmit={handleSave} spacing={2}>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
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
            <Grid item xs={4}>
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
            <Grid item xs={6}>
              <Typography component="h3" variant="h4">
                Porcentaje de área usada
              </Typography>
              <Slider
                id="areaPercent"
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
                ref={sliderRef}
              />
            </Grid>
            <Grid item xs={4}>
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
        </>
      )}
    </div>
  );
}
