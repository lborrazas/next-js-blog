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

export default function Login() {
  const setWeb3 = useSetWeb3();
  const setAddress = useSetAddress();
  const setVmContract = useSetVmContract();
  const setUser = useSetUser();
  const router = useRouter();
  const [error, setError] = useState(null);

  const connectWalletHandler = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
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
        if (is_registered.data[0]) {
          console.log(is_registered.data[0]);
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
        setError(err.message);
      }
    } else {
      alert("please install Metamask");
    }
  };

  return (
    <div className={style.loginPage}>
      <div className={style.loginContainer}>
        <Typography component="h1" variant="h4">
          IxaTesis
        </Typography>
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
        {error && <Typography variant="body2">{error}</Typography>}
      </div>
    </div>
  );
}
