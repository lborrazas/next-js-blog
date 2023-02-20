import {useState} from "react";
import {useAddress, useWeb3} from "../../blockchain/BlockchainContext";
import {useUser} from "../../contexts/AppContext";

export default function home() {
    const address = useAddress()
    const web3 = useWeb3()
    const user = useUser()
    const [error, setError] = useState(null)

    return (
        <>
        <h1>{"Hola " + user.name}</h1>
        <h2>{"Eres admin? "} {user.isAdmin ? "si" : "no"}</h2>
        <h2>{"Tu address" + user.address }</h2>
        </>
    )
}


