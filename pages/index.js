import {useSetAddress, useSetVmContract, useSetWeb3} from "../blockchain/BlockchainContext";
import {useState} from "react";
import contractCollector from "../blockchain/ContractCollector";
import Web3 from "web3";
import {useRouter} from "next/router";
import {User, useSetUser} from "../contexts/AppContext";

export default function Login() {
    const setWeb3 = useSetWeb3()
    const setAddress = useSetAddress()
    const setVmContract = useSetVmContract()
    const setUser = useSetUser()
    const router = useRouter();
    const [error, setError] = useState(null)

    const connectWalletHandler = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({method: "eth_requestAccounts"})
                let web3 = new Web3(window.ethereum)
                /*set web3 instance*/
                setWeb3(web3)
                console.log(web3)
                /*get list of accounts*/
                const account = await web3.eth.getAccounts()
                setAddress(account[0])

                /*Create a contract copy*/
                const vmContract_ = contractCollector(web3)
                setVmContract(vmContract_)
                router.push("/home")
                setUser(new User(1, "mate", "matematica", account[0], true))
            } catch (err) {
                setError(err.message)
            }

        } else {
            alert("please install Metamask")
        }
    }

    return (
        <button onClick={connectWalletHandler}> {"Hola Mate"} </button>
    )

}
