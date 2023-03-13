import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

export const BlockAnomalies = (anomalies) => {
  async function createParcela(nft) {}
  async function burnNft(nft) {
    //TODO BURN nft.id
  }
  return (
    <Stack spacing={1}>
      {anomalies.data.block.map((nft, index) => (
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
          <Stack direction="row">
            <IconButton color="info" onClick={() => createParcela(nft)}>
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                burnNft(nft);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
export default BlockAnomalies;
