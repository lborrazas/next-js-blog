import Dialog from "@mui/material/Dialog";
import { PlotForm } from "../plot/PlotForm";
import Box from "@mui/material/Box";

export const EditPlotDialog = ({ open, handleClose, users, selectedPlot }) => {
  console.log(selectedPlot)
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
        <PlotForm
          users={users}
          handleClose={handleClose}
          selectedPlot={selectedPlot}
        />
      </Box>
    </Dialog>
  );
};

export default EditPlotDialog;
