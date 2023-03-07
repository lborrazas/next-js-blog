import {
    useSetAddress,
    useSetVmContract,
    useSetWeb3,
} from "../../blockchain/BlockchainContext";
import {useState} from "react";
import contractCollector from "../../blockchain/ContractCollector";
import Web3 from "web3";
import {useRouter} from "next/router";
import {User, useSetUser} from "../../contexts/AppContext";
import useSWR from "swr";
import axios from "axios";
import style from "./login.module.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {CircularProgress} from "@mui/material";
import {SiweMessage} from "siwe";
import {getCsrfToken, signIn, useSession} from "next-auth/react";
import {useAccount, useConnect, useNetwork, useSignMessage, useSigner} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";

export default function Login() {
    const setWeb3 = useSetWeb3();
    const setVmContract = useSetVmContract();
    const setUser = useSetUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const {address, isConnected} = useAccount()
    const {chain} = useNetwork()
    const {signMessageAsync} = useSignMessage()
    const { data: signer, isError, isLoading2 } = useSigner()
    const {connect} = useConnect({
        connector: new InjectedConnector(),
    });
    const {data: session, status} = useSession()
    const contract2 = contractCollector(signer)


    const handleLogin = async () => {
        if (
            typeof window !== "undefined" &&
            typeof window.ethereum !== "undefined"
        ) {
            try {
                alert("sss")
                const callbackUrl = "/protected"
                const message = new SiweMessage({
                    domain: window.location.host,
                    address: address,
                    statement: "Sign in with Ethereum to the app.",
                    uri: window.location.origin,
                    version: "1",
                    chainId: chain?.id,
                    nonce: await getCsrfToken(),
                })
                    const signature = await signMessageAsync({
                        message: message.prepareMessage(),
                    })
                    console.log(message)
                    await signIn("credentials", {
                        message: JSON.stringify(message),
                        redirect: false,
                        signature,
                        callbackUrl,
                    }).then(
                        function (result) {
                            if(result.status == "200"){
                                setVmContract(contract2);
                                router.push("/home")
                            }
                            if(result.status == "401") {
                                router.push("/signup")
                            }
                        },
                        function (error) {
                           alert(error)
                        }
                    )
                    console.log(session)
            } catch (error) {
                window.alert(error)
            }
        } else {
            setIsLoading(false);
            alert("please install Metamask");
        }
    }

    const connectWalletHandler = async () => {
        if (
            typeof window !== "undefined" &&
            typeof window.ethereum !== "undefined"
        ) {
            try {
                setIsLoading(true);
                await window.ethereum.request({method: "eth_requestAccounts"});
                let web3 = new Web3(window.ethereum);
                /*set web3 instance*/
                setWeb3(web3);
                console.log(web3);
                /*get list of accounts*/
                const account = await web3.eth.getAccounts();
                setAddress(account[0]);

                /*Create a contract copy*/
                const vmContract_ = contractCollector();
                setVmContract(vmContract_);
                console.log(account[0])
                let body = {address: account[0]};
                const is_registered = await axios.post("/api/getuser", body);
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
        <div className={style.loginPage}>
            <div className={style.loginContainer}>
                <Typography component="h1" variant="h4">
                    IxaTesis
                </Typography>
                {isLoading ? (
                    <CircularProgress/>
                ) : (
                    <Button
                        onClick={handleLogin}
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
