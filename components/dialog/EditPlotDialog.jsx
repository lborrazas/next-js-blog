import Dialog from "@mui/material/Dialog";
import { PlotForm } from "../plot/PlotFormUpdate";
import Box from "@mui/material/Box";

export const EditPlotDialog = ({ open, handleClose, users, selectedPlot }) => {
  console.log(users);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-edit-plot"
      aria-describedby="dialog-edit-plot"
      maxWidth="lg"
      fullWidth
    >
      <Box sx={{ padding: "30px" }}>
        <PlotForm users={users} selectedPlot={selectedPlot} />
      </Box>
    </Dialog>
  );
};

export default EditPlotDialog;
