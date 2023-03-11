import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { Tooltip } from "@mui/material";


export const BlockAnomalies = ( anomalies ) => {
  async function createParcela(nft) {  
    console.log(nft) 
  let url = "/api/parcelacreate";
let plot = {
    latitud: nft.data.latitud,
    longitud: nft.data.longitud,
    m2:100,
    m2used: 0,
    m3: 0,
    address: nft.owner,
  };
  const result = await axios.post(url, plot);
  if (result.data === -1) {
    alert("parcela already exist");
    // const result = await axios.post('/api/fixes/updateowner', {addres:nft.owner});  
    multiplenfts(nft.data)
    alert("parcela was corrected on our database ");
    }
  }
} 
  async function multiplenfts(nft){
    let anomalies=[]
    for (let i = 0; i < max; i++) {
      const parse = await vmContract.tokenIdToParcelasIndex(i);
      if (parse.longitud == nft.latitud && parse.latitud == nft.latitud) {
        const owner = await vmContract.ownerOf(i);
        console.log(owner);
        console.log(i);
        anomalies.push({owner:owner,id:i});
      }
      const realNft = anomalies.shift();
      
      await axios.post("/api/fixes/parcela",{id:realNft.id,toAdd:realNft.owner});

      for (const element of arr) {
      burnNft(element)
      }
    
  }

  
  async function burnNft(nft) {
    //TODO BURN nft.id
  }

  return (
    <Stack spacing={1}>
      {anomalies.data.block.map((nft,index) => (
        <Stack
          key={nft.id}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ bgcolor: index % 2 === 0 ? "#fbfbfb" : "abd2b0" }}
        >
          <p>
            Latitud{nft.data.latitud}, {nft.data.longitud}, {nft.owner}
          </p>
          <Stack direction="row" >
            <Tooltip  title="descripcion boton 2">
              <IconButton color="info" onClick={() => createParcela(nft)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip  title="descripcion boton 3">
              <IconButton
                color="error"
                onClick={() => {
                  burnNft(nft);
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
export default BlockAnomalies;