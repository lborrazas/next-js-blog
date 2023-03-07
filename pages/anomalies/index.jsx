import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { useAddress, useVmContract } from "../../blockchain/BlockchainContext";
import { BlockAnomalies } from "../../components/anomalies/BlockAnomalies";
import { ExterAnomalies } from "../../components/anomalies/ExterAnomalies";
import { InnerAnomalies } from "../../components/anomalies/InnerAnomalies";
import { AnomalieSkeleton } from "../../components/skeletons/Anomalies";
import Paper from "@mui/material/Paper";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [anomalies, setAnomalies] = useState(false);
  const [nfts, setNfts] = useState(null);
  const vmContract = useVmContract();

  const allTokens = async () => {
    const max = await vmContract.methods.tokenCounter().call();
    const plots = [];
    for (let i = 0; i < max; i++) {
      const parse = await vmContract.methods.tokenIdToParcelasIndex(i).call();
      const owner = await vmContract.methods.ownerOf(i).call();
      const parcela = { data: parse, owner: owner, id: i };
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
    <div>
      <Paper elevation={3} sx={{ padding: "30px" }}>
        <Box>
          <BlockAnomalies data={anomalies.data}></BlockAnomalies>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ padding: "30px" }}>
        <Box>
        <ExterAnomalies data={anomalies.data}></ExterAnomalies>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ padding: "30px" }}>
        <Box>
          <InnerAnomalies data={anomalies.data}></InnerAnomalies>
        </Box>
      </Paper>
    </div>
  );
}
