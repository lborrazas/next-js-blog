import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { useAddress, useVmContract } from "../../blockchain/BlockchainContext";
import { BlockAnomalies } from "../../components/anomalies/BlockAnomalies";
import { ExterAnomalies } from "../../components/anomalies/ExterAnomalies";
import { InnerAnomalies } from "../../components/anomalies/InnerAnomalies";
import { AnomalieSkeleton } from "../../components/skeletons/Anomalies";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import style from "./style.module.css";
import {} from "wagmi";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [anomalies, setAnomalies] = useState(false);
  const [nfts, setNfts] = useState(null);
  const vmContract = useVmContract();

  const allTokens = async () => {
    const max = await vmContract.tokenCounter();
    const plots = [];
    for (let i = 0; i < max; i++) {
      const parse = await vmContract.tokenIdToParcelasIndex(i);
      const owner = await vmContract.ownerOf(i);
      const pasar = {
        latitud: parse.latitud,
        longitud: parse.longitud,
      };
      const parcela = { data: pasar, owner: owner, id: i };
      plots.push(parcela);
    }
    return plots;
  };

  async function fetchData() {
    // Fetch NFT data from your web3 contract
    const nftData = await allTokens();
    console.log(nftData);

    // Send NFT data to your Prisma database via an API
    const anomalies = await axios.post("/api/anomalies", nftData);
    console.log(anomalies);
    if (anomalies.data.inner[0] || anomalies.data.block[0]) {
      setAnomalies(anomalies);
    } else {
      setAnomalies(anomalies);
    }

    // Update state with the retrieved data
    setNfts(nftData);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <AnomalieSkeleton />;
  }
  if (!anomalies) {
    return <p>No anomalies detected</p>;
  }

  return (
    <Stack>
      <h2 className={`${style.title}`}>Anomalias Internas 
        <Tooltip className={`${style.button}`} title="Anomalas dentro de nuestra base de datos">
          <IconButton>
            <InfoIcon />
          </IconButton>
      </Tooltip>
      </h2>
      <Paper className={`${style.marginTable}`} elevation={3} sx={{ padding: "30px" }}>
        <Box>
          <InnerAnomalies data={anomalies.data}></InnerAnomalies>
        </Box>
      </Paper>
      <h2 className={`${style.title}`}>Anomalias en la blockchain 
        <Tooltip className={`${style.button}`} title="Nfts repetidos en el contrato">
          <IconButton>
            <InfoIcon />
          </IconButton>
      </Tooltip>
      </h2>
      <Paper className={`${style.marginTable}`} elevation={3} sx={{ padding: "30px" }}>
        <Box>
          <BlockAnomalies data={anomalies.data}></BlockAnomalies>
        </Box>
      </Paper>
      <h2 className={`${style.title}`}>Anomalias Externas 
        <Tooltip className={`${style.button}`} title="Parcelas que no tiene nft correspondiente">
          <IconButton>
            <InfoIcon />
          </IconButton>
      </Tooltip>
      </h2>
      <Paper className={`${style.marginTable}`} elevation={3} sx={{ padding: "30px" }}>
        <Box>
          <ExterAnomalies data={anomalies.data}></ExterAnomalies>
        </Box>
      </Paper>
    </Stack>
  );
}
