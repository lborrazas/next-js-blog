import {
  useSetAddress,
  useSetVmContract,
  useSetWeb3,
} from "../../blockchain/BlockchainContext";
import { useState } from "react";
import contractCollector from "../../blockchain/ContractCollector";
import Web3 from "web3";
import { useRouter } from "next/router";
import { User, useSetUser, useSetTokens } from "../../contexts/AppContext";
import axios from "axios";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import styled from "styled-components";

export default function Login() {
  const setWeb3 = useSetWeb3();
  const setAddress = useSetAddress();

  const setUser = useSetUser();
  const setTokens = useSetTokens();
  const router = useRouter();
  const setVmContract = useSetVmContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const allTokens = async (vmContract) => {
    let max = await vmContract.methods.tokenCounter().call();
    let plots = [];
    for (let i = 0; i < max; i++) {
      let address_temp = await vmContract.methods.ownerOf(i).call();
      let parse = await vmContract.methods.tokenIdToParcelasIndex(i).call();
      plots.push(parse);
    }
    return plots;
  };

  const connectWalletHandler = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        setIsLoading(true);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        let web3 = new Web3(window.ethereum);
        /*set web3 instance*/
        setWeb3(web3);
        console.log(web3);
        /*get list of accounts*/
        const account = await web3.eth.getAccounts();
        setAddress(account[0]);

        /*Create a contract copy*/
        const vmContract_ = contractCollector(web3);
        setVmContract(vmContract_);
        console.log(account[0]);
        let body = { address: account[0] };
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
      alert("please install Metamask");
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
            sx={{
              mt: 3,
              mb: 2,
            }}
          >
            Iniciar Sesión
          </Button>
        )}
        {error && <Typography variant="body2">{error}</Typography>}
      </LoginContainer>
    </PageLogin>
  );
}

const PageLogin = styled.div`
  display: grid;
  min-height: 100vh;
  background-color: rgb(240, 255, 227);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: url("../../public/hexagons.svg");
`;

const LoginContainer = styled.div`
  margin: auto;
  width: 500px;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 6rem;
  border: 1px solid #2c6030;
  border-radius: 8px;
  background: linear-gradient(-45deg, #ffddf9, #e6bcff, #d4f8ff, #ffddf9);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;
