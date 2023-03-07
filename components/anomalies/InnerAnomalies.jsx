import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

export const InnerAnomalies = ( anomalies ) => {
  async function fixDB(nft) {
    const plots = [];
    for (let i = 0; i < max; i++) {
      const parse = await vmContract.methods.tokenIdToParcelasIndex(i).call();
      if(parse.longitud   ==nft.latitud && parse.latitud ==nft.latitud){
        const owner = await vmContract.methods.ownerOf(i).call();
        plots.push(owner);
    }
    //if ownwr = history_address => updateParcela  
    //if ownwr = parcela_address => updateHistory  
    }

  }

  return (
    <Stack spacing={1}>
      {anomalies.data.inner.map((nft,index) => (
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