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
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export const PlotForm = ({ selectedPlot, users }) => {
  const router = useRouter();
  const vmContract = useVmContract();

  const [owner, setOwner] = useState("");

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeOwner = (e) => {
    setOwner(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ENTRO");
    console.log(e.currentTarget);
    
    const data = new FormData(document.getElementById('submitgrid'));
    const plot = {
      address: owner.address,
      latitud: data.get("latitude"),
      longitud: data.get("longitude"),
      m2: data.get("area"),
      m2used: data.get("area-used"),
      // TODO: wtf esta propiedad, m3?
      m3: data.get("average-height"),
    };
    const result = await axios.post("/api/parcelacreate", plot);
    console.log(result)
    // TODO: como que -2 ??????????????
    if (result.data === -1) {
      alert("parcela already exist");
    } else {
      // TODO: esto se deberia usar en algun lado?
      //const a = await vmContract.methods
       // .createCollectible(plot.longitud, plot.latitud)
      //  .send({ from: plot.address });
      //await router.push("/home");
    }
  };

  return (
    <Grid container component="form" onSubmit={handleSubmit} spacing={1} id='submitgrid'>
      <Grid item xs={12}>
        <InputLabel id="owner-select">Dueño</InputLabel>
        <Select
          labelId="owner-select"
          value={owner}
          fullWidth
          id="owner-select"
          label="Dueño"
          onChange={handleChangeOwner}
          required
        >
          {users?.map((user) => (
            <MenuItem key={user.id} value={user}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={6}>
        <TextField
          defaultValue={selectedPlot ? selectedPlot.latitud : ""}
          id="latitude"
          label="Latitud"
          name="latitude"
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          defaultValue={selectedPlot ? selectedPlot.longitud : ""}
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
        {!selectedPlot ? (
          <Button
            onClick={handleClickOpen}
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
            }}
          >
            Guardar
          </Button>
        ) : (
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
        )}
      </Grid>
      {!selectedPlot ? (
        <Grid>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Create Parcela"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Continuar con la creación de la parcela?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Disagree</Button>
              <Button onClick={handleSubmit} variant="contained" autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      ) : (
        <div></div>
      )}
    </Grid>
  );
};
