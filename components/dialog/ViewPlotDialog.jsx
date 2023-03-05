import Dialog from "@mui/material/Dialog";
import { PlotShowData } from "../plot/PlotShowData";

export const ViewPlotDialog = ({ open, handleClose }) => {
  // TODO: get this value
  const users = [];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-edit-plot"
      aria-describedby="dialog-edit-plot"
      maxWidth="lg"
      fullWidth
    >
      <PlotShowData />
    </Dialog>
  );
};

export default ViewPlotDialog;
