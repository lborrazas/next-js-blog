import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { useVmContract } from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Toast } from "../toast/toast";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export const PlotForm = ({ selectedPlot, handleClose, users }) => {
  const router = useRouter();
  const vmContract = useVmContract();

  const [owner, setOwner] = useState(selectedPlot ? selectedPlot.userName : "");

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClosein = () => {
    setOpen(false);
  };

  const handleChangeOwner = (e) => {
    setOwner(e.target.value);
  };

  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(document.getElementById("submitid"));
    let plot;
    let url;
    let url2;
    if (!selectedPlot) {
      url = "/api/parcelacreate";
      url2 = "/api/getparcela";
      plot = {
        latitud: data.get("latitude"),
        longitud: data.get("longitude"),
        m2: data.get("area"),
        m2used: +data.get("area-used"),
        // TODO: wtf esta propiedad, m3?
        m3: +data.get("average-height"),
        address: owner.address,
      };
      if (
        data.get("average-height") &&
        data.get("latitude") &&
        data.get("longitude") &&
        data.get("area") &&
        data.get("area-used") &&
        owner.address
      ) {
        const result = await axios.post(url2, plot);
        // TODO: como que -2 ??????????????
        console.log("creando")
        console.log(result)
        if (result.data[1]) {
          alert("parcela already exist"); //TODO ALERT POR ALGO MAS LINDO SI SACAN EL ALERT SAQUEN EL SET OPEN A MENOS QUE PONDAN EL MENSAJE FUERA DEL DIALOG
          setOpen(false); // YO NO ME ENCARGO DEL MANEJOD E ERROES
        } else {
          const id = await vmContract.tokenCounter().then(
            async (res)=>{const id= Number(res._hex) 
              const a = await vmContract.createCollectible(
                   plot.longitud,
                   plot.latitud,
                   plot.m2
                 ).then(async (res) => {
                  plot = {
                    latitud: data.get("latitude"),
                    longitud: data.get("longitude"),
                    m2: data.get("area"),
                    m2used: +data.get("area-used"),
                    // TODO: wtf esta propiedad, m3?
                    m3: +data.get("average-height"),
                    address: owner.address,
                    blockId:id
                  };
                   console.log(res)
                   await axios.post(url, plot)});
                 await router.push("/home");
            })
          setOpen(false);
        }
      } else {
        alert("campos vacios");
        setOpen(false);
      }
    } else {
      url = "/api/parcelaupdate";
      plot = {
        pid: selectedPlot.pid,
        m2used: +data.get("area-used"),
        m3: +data.get("average-height"),
        address: selectedPlot.address,
      };
      const result = await axios.post(url, plot);
      {
        handleClose();
      }
    }
    setShowMessage(true);
    setTimeout(() => {
      // setShowMessage(false);
      // window.location.reload(true);
    }, 50000); // 3 segundos de duración del mensaje
  };

  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit}
      spacing={1}
      id="submitid"
    >
      {showMessage && (<Toast tipe={"success"} message={"Parcela update success!"}></Toast>)}

      <Grid item xs={12}>
        <InputLabel id="owner-select">Dueño</InputLabel>
        <Select
          defaultValue={selectedPlot ? selectedPlot.userName : ""}
          disabled={!!selectedPlot}
          labelId="owner-select"
          value={owner}
          fullWidth
          id="owner-select"
          label="Dueño"
          onChange={handleChangeOwner}
          required
        >
          {selectedPlot && (
            <MenuItem key={selectedPlot.userName} value={selectedPlot.userName}>
              {selectedPlot.userName}
            </MenuItem>
          )}
          {!selectedPlot &&
            users?.map((user) => (
              <MenuItem key={user.id} value={user}>
                {user.name}
              </MenuItem>
            ))}
        </Select>
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled={!!selectedPlot}
          defaultValue={selectedPlot ? selectedPlot.latitud : ""}
          id="latitude"
          label="Latitud"
          name="latitude"
          type="number"
          InputProps={{
            inputProps: {
              step: 1,
              min: 0,
              pattern: "\\d+",
            },
          }}
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled={!!selectedPlot}
          defaultValue={selectedPlot ? selectedPlot.longitud : ""}
          required
          fullWidth
          id="longitude"
          label="Longitud"
          type="number"
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
          type="number"
          name="area-used"
          aria-label="Default"
          valueLabelDisplay="auto"
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          disabled={!!selectedPlot}
          defaultValue={selectedPlot ? selectedPlot.m2 : ""}
          required
          fullWidth
          id="area"
          label="Área"
          type="number"
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
          type="number"
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
            <DialogTitle id="alert-dialog-title">Create Parcela</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Continuar con la creación de la parcela?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosein}>Disagree</Button>
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
