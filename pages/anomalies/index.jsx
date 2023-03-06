import { useState, useEffect } from "react";
import axios from "axios";
import { useAddress, useVmContract } from "../../blockchain/BlockchainContext";

import { AnomalieSkeleton } from "../../components/skeletons/Anomalies";

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
      let parcela = { data: parse, owner: owner };
      plots.push(parcela);
    }
    return plots;
  };

  async function fetchData() {
    // Fetch NFT data from your web3 contract
    const nftData = await allTokens();
    console.log(nftData)  
  
    // Send NFT data to your Prisma database via an API
    const anomalies = await axios.post("/api/anomalies",  nftData );
    console.log(anomalies)
    if (anomalies.data.inner[0] || anomalies.data.block[0] ) {
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
      {/* Display your NFT data here */}
      <ul>
        {anomalies.data.inner.map((nft) => (
          <li key={nft.id}>{nft.name}</li>
        ))}
      </ul>
      <ul>
        {anomalies.data.block.map((nft) => (
          <li key={nft.owner}>Latitud:{nft.data.latitud}  Longitud:{nft.data.longitud} Address:{nft.owner}</li>
        ))}
      </ul>
    </div>
  );
}
