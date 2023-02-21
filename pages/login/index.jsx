import {
  useSetAddress,
  useSetVmContract,
  useSetWeb3,
} from "../../blockchain/BlockchainContext";
import { useState } from "react";
import contractCollector from "../../blockchain/ContractCollector";
import Web3 from "web3";
import { useRouter } from "next/router";
import { User, useSetUser } from "../../contexts/AppContext";
import useSWR from "swr";
import axios from "axios";
import style from "./login.module.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";

export default function Login() {
  const setWeb3 = useSetWeb3();
  const setAddress = useSetAddress();
  const setVmContract = useSetVmContract();
  const setUser = useSetUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
        let body = { address: account[0] };
        const is_registered = await axios.post("/api/getuser", body);
        if (true) {
          //console.log(is_registered.data[0]);
          setUser(
            new User(
              '1',
                'mate',
                'mate',
                account[0],
                true
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
    <div className={style.loginPage}>
      <div className={style.loginContainer}>
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
      </div>
    </div>
  );
}
