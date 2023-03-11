import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { Tooltip } from "@mui/material";


export const ExterAnomalies = (anomalies) => {
  async function deleteParcela(nft) {
    console.log(nft)
    await axios.post("/api/fixes/deleteparcela", nft);
  }
  return (
    <Stack spacing={1}>
      {anomalies.data.exter.map((nft, index) => (
        <Stack
          key={nft.id}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ bgcolor: index % 2 === 0 ? "#fbfbfb" : "abd2b0" }}
        >
          <p>   
            Latitud{nft.latitud} Longitud {nft.longitud} Dueño {nft.address}
          </p>
          <Stack direction="row">
            <Tooltip  title="descripcion boton 4">
              <IconButton
                color="error"
                onClick={() => {
                  deleteParcela(nft);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
export default ExterAnomalies;
