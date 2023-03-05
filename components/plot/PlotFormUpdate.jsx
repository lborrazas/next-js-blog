import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { useVmContract } from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
import style from "./style.module.css";


export const PlotForm = ({ selectedPlot, users }) => {
  const router = useRouter();
  const vmContract = useVmContract();

  const [owner, setOwner] = useState("");

  const handleChangeOwner = (e) => {
    setOwner(e.target.value);
  };

  function updateHistory(){
    let m2used = data.get("area-used");
    // TODO: wtf esta propiedad, m3?
    let m3 = data.get("average-height");
    let id = data.get("id");
    let address = data.get("address");

    history = {
        "id": id,
        "m2used": m2used,
        "m3": m3,
        "address": address,
    }
    console.log(plot.m3);
    console.log(plot.m2used);
    console.log(selectedPlot);
    // const fetcher = (url) => fetch(url).then((res) => res.json());
    // const { data, error } = useSWR(id ? `/api/parcelaupdate` : history, fetcher);

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const plot = {
      address: owner,
      latitud: data.get("latitude"),
      longitud: data.get("longitude"),
      m2: data.get("area"),
      m2used: data.get("area-used"),
      // TODO: wtf esta propiedad, m3?
      m3: data.get("average-height"),
    };
    // const result = await axios.post("/api/parcelacreate", plot);
    // TODO: como que -2 ??????????????
    // if (result.data === -2) {
      // alert("parcela already exist");
    // } else {
      // TODO: esto se deberia usar en algun lado?
      // const a = await vmContract.methods
        // .createCollectible(plot.longitud, plot.latitud)
        // .send({ from: plot.address });
      // await router.push("/home");
    // }
  };

  return (
    <Grid container component="form" onSubmit={handleSubmit} spacing={1}>
      <Grid item xs={12}>
        <InputLabel id="owner-select">Dueño</InputLabel>
        <Select
          className={`${style.disabledSelect}`}
          labelId="owner-select"
          value={selectedPlot.address}
          fullWidth
          id="owner-select"
          label="Dueño"
          readOnly="true"
          onChange={handleChangeOwner}
          required
        >
            <MenuItem selected defaultChecked key={selectedPlot.address} value={selectedPlot.address}>
              {selectedPlot.userName}
            </MenuItem>
        </Select>
      </Grid>
      <Grid item xs={6}>
        <TextField
          defaultValue={selectedPlot ? selectedPlot.latitud : ""}
          value={selectedPlot ? selectedPlot.latitud : ""}
          className={`${style.disabledSelect}`}
          id="latitude"
          label="Latitud"
          name="latitude"
          readOnly="true"
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          defaultValue={selectedPlot ? selectedPlot.longitud : ""}
          value={selectedPlot ? selectedPlot.longitud : ""}
          className={`${style.disabledSelect}`}
          required
          fullWidth
          id="longitude"
          label="Longitud"
          readOnly="true"
          name="longitude"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography component="h3" variant="h6">
          Porcentaje de área usada
        </Typography>
        <Slider
          defaultValue={selectedPlot ? selectedPlot.m2used : 0}
          id="area-used"
          name="area-used"
          aria-label="Default"
          valueLabelDisplay="auto"
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          defaultValue={selectedPlot ? selectedPlot.m2 : ""}
          value={selectedPlot ? selectedPlot.m2 : ""}
          className={`${style.disabledSelect}`}
          required
          fullWidth
          id="area"
          label="Área"
          name="area"
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          defaultValue={selectedPlot ? selectedPlot.m3 : ""}
          required
          fullWidth
          id="average-height"
          label="Altura promedio"
          name="average-height"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={() => updateHistory()}
          sx={{
            mt: 3,
            mb: 2,
          }}
        >
          GUARDAR
        </Button>
      </Grid>
    </Grid>
  );
};
