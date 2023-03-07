import { SvgIcon } from "@mui/material";
import { MetaMaskSvg } from "../../assets/svg";

export const MetaMaskIcon = (props) => {
  return (
    <SvgIcon {...props} inheritViewBox>
      <MetaMaskSvg />
    </SvgIcon>
  );
};

export default MetaMaskIcon;
