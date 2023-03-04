import {
  useSetAddress,
  useSetVmContract,
  useSetWeb3,
} from "../../blockchain/BlockchainContext";
import { forwardRef, useState } from "react";
import contractCollector from "../../blockchain/ContractCollector";
import Web3 from "web3";
import { useRouter } from "next/router";
import { User, useSetUser, useSetTokens } from "../../contexts/AppContext";
import axios from "axios";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  CircularProgress,
  DialogContent,
  keyframes,
  Slide,
} from "@mui/material";
import styled from "@emotion/styled";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import MetaMaskIcon from "../../components/icons/MetaMaskIcon";
import { renderToStaticMarkup } from "react-dom/server";
import { Hexagons } from "../../assets/svg";

const gradient = keyframes`
  0% {
    background-position: 0 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0 50%
  }
`;

const svgString = encodeURIComponent(renderToStaticMarkup(<Hexagons />));

const PageLogin = styled("div")({
  display: "grid",
  minHeight: "100vh",
  backgroundColor: "rgb(240, 255, 227)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundImage: `url("data:image/svg+xml,${svgString} ")`,
});

const LoginContainer = styled("div")({
  margin: "auto",
  width: "500px",
  alignSelf: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "4rem 6rem",
  border: "1px solid #2c6030",
  borderRadius: "8px",
  background: "linear-gradient(-45deg, #ffddf9, #e6bcff, #d4f8ff, #ffddf9)",
  backgroundSize: "400% 400%",
  animation: `${gradient} 10s ease infinite`,
});

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Login() {
  const setWeb3 = useSetWeb3();
  const setAddress = useSetAddress();

  const setUser = useSetUser();
  const setTokens = useSetTokens();
  const router = useRouter();
  const setVmContract = useSetVmContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const allTokens = async (vmContract) => {
    const max = await vmContract.methods.tokenCounter().call();
    const plots = [];
    for (let i = 0; i < max; i++) {
      // TODO: hacer algo con esta variable
      const address_temp = await vmContract.methods.ownerOf(i).call();
      const parse = await vmContract.methods.tokenIdToParcelasIndex(i).call();
      plots.push(parse);
    }
    return plots;
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const connectWalletHandler = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        setIsLoading(true);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        /*set web3 instance*/
        setWeb3(web3);
        /*get list of accounts*/
        const account = await web3.eth.getAccounts();
        setAddress(account[0]);

        /*Create a contract copy*/
        const vmContract_ = contractCollector(web3);
        setVmContract(vmContract_);
        const body = { address: account[0] };
        const is_registered = await axios.post("/api/getuser", body);
        const tokens = await allTokens(vmContract_);
        setTokens(tokens);
        if (is_registered.data[0]) {
          setUser(
            new User(
              is_registered.data[0].id,
              is_registered.data[0].name,
              is_registered.data[0].email,
              account[0],
              is_registered.data[0].isAdmin
            )
          );
          router.push("/home");
        } else {
          router.push("/signup");
        }
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
      }
    } else {
      setIsLoading(false);
      setOpenDialog(true);
      // alert("please install Metamask");
    }
  };

  return (
    <PageLogin>
      <LoginContainer>
        <Typography component="h1" variant="h4">
          IxaTesis
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button
            onClick={connectWalletHandler}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar Sesión
          </Button>
        )}
        {error && <Typography variant="body2">{error}</Typography>}
      </LoginContainer>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Por favor instale Metamask</DialogTitle>
        <DialogContent sx={{ display: "grid" }}>
          <Button
            sx={{ alignSelf: "center" }}
            variant="outlined"
            startIcon={<MetaMaskIcon />}
            target="_blank"
            href="https://metamask.io/download/"
          >
            Descargar Metamask
          </Button>
        </DialogContent>
      </Dialog>
    </PageLogin>
  );
}
