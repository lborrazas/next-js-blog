import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { useAddress, useVmContract } from "../../blockchain/BlockchainContext";
import { BlockAnomalies } from "../../components/anomalies/BlockAnomalies";
import { ExterAnomalies } from "../../components/anomalies/ExterAnomalies";
import { InnerAnomalies } from "../../components/anomalies/InnerAnomalies";
import { AnomaliesSkeleton } from "../../components/skeletons/AnomaliesSkeleton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import {} from "wagmi";

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

    // Send NFT data to your Prisma database via an API
    const anomalies = await axios.post("/api/anomalies", nftData);

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
    return <AnomaliesSkeleton />;
  }
  if (!anomalies) {
    return <p>No anomalies detected</p>;
  }

  return (
    <Stack>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box>
          <InnerAnomalies data={anomalies.data}></InnerAnomalies>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box>
          <BlockAnomalies data={anomalies.data}></BlockAnomalies>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box>
          <ExterAnomalies data={anomalies.data}></ExterAnomalies>
        </Box>
      </Paper>
    </Stack>
  );
}
