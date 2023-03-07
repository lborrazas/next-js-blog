import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { useAddress, useVmContract } from "../../blockchain/BlockchainContext";

export const InnerAnomalies = (anomalies) => {
  const vmContract = useVmContract();
  async function fixDB(nft) {
    const max = await vmContract.methods.tokenCounter().call();
    const plots = [];
    for (let i = 0; i < max; i++) {
      const parse = await vmContract.methods.tokenIdToParcelasIndex(i).call();
      if (parse.longitud == nft.latitud && parse.latitud == nft.latitud) {
        const owner = await vmContract.methods.ownerOf(i).call();
        console.log(owner);
        console.log(i);
        plots.push(owner);
      }
    }
    console.log(plots);
    console.log(nft.history_address);
    if (!plots[1]) {
      if (plots[0] === nft.history_address) {
        alert("esta mal en parcela mock: descomenta el codigo papa");
        //await axios.post("/api/fixes/parcela", nft);
      } else {
        //TODO
        alert("esta mal en history  mock: descomenta el codigo papa");
        //await axios.post("/api/fixes/history", nft);
      }
    }
    else{alert('La anomalia puede ser de otro tipo,buscala en las otras listas y solucionala, si vuelve a aparecer en esta lista este mesnaje no deberia aparecer')}
  }

  return (
    <Stack spacing={1}>
      {anomalies.data.inner.map((nft, index) => (
        <Stack
          key={nft.id}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ bgcolor: index % 2 === 0 ? "#fbfbfb" : "abd2b0" }}
        >
          <p>
            Latitud{nft.latitud}, Longitud {nft.longitud}, {nft.address}
          </p>
          <Stack direction="row">
            <IconButton color="primary" onClick={() => fixDB(nft)}>
              <BuildRoundedIcon />
            </IconButton>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
export default InnerAnomalies;
