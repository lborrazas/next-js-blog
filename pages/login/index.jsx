import {
  useSetAddress,
  useSetVmContract,
  useSetWeb3,
  useVmContract,
} from "../../blockchain/BlockchainContext";
import { forwardRef, useEffect, useState } from "react";
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
import { SiweMessage } from "siwe";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import {
  useAccount,
  useConnect,
  useNetwork,
  useSignMessage,
  useSigner,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

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
  const vmContract = useVmContract();
  const setVmContract = useSetVmContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const { data: signer, isError, isLoading2 } = useSigner();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { data: session, status } = useSession();
  const contract2 = contractCollector(signer);

  // useEffect(async () => {
  //   // if(signer && vmContract){
  //   //   const tokens = await allTokens(contract2);
  //   //   setTokens(tokens);
  //   // }
  // },[vmContract, contract2, isLoading, isError, signer] )

  useEffect(() => {
    //const storedState = localStorage.getItem('myContextState');
    if (!vmContract && !isLoading && signer) {
      setVmContract(contract2);
    }
  }, [vmContract, contract2, isLoading, isError, signer]);

  const handleLogin = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        const callbackUrl = "/protected";
        const message = new SiweMessage({
          domain: window.location.host,
          address: address,
          statement: "Sign in with Ethereum to the app.",
          uri: window.location.origin,
          version: "1",
          chainId: chain?.id,
          nonce: await getCsrfToken(),
        });
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        await signIn("credentials", {
          message: JSON.stringify(message),
          redirect: false,
          signature,
          callbackUrl,
        }).then(
          function (result) {
            if (result.status == "200") {
              setVmContract(contract2);
              localStorage.setItem("myContextState", contract2);
              router.push("/home");
            }
            if (result.status == "401") {
              router.push("/signup");
            }
          },
          function (error) {
            alert(error);
          }
        );
      } catch (error) {
        window.alert(error);
      }
    } else {
      setIsLoading(false);
      alert("please install Metamask");
    }
  };

  const allTokens = async (vmContract) => {
    const max = await contract2.tokenCounter();
    const plots = [];
    for (let i = 0; i < max; i++) {
      // TODO: hacer algo con esta variable
      const address_temp = await contract2.ownerOf(i);
      const parse = await contract2.tokenIdToParcelasIndex(i);

      plots.push(parse);
    }
    return plots;
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (isConnected && !session) {
      handleLogin();
    }
  }, [isConnected]);

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
            onClick={(e) => {
              e.preventDefault();
              if (!isConnected) {
                connect();
              } else {
                handleLogin();
              }
            }}
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
