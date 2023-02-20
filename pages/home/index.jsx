import {useEffect, useState} from "react";
import {useAddress, useWeb3} from "../../blockchain/BlockchainContext";
import {useUser} from "../../contexts/AppContext";
import { redirect } from 'next/navigation';
import {useRouter} from "next/router";


export default function home() {
    const router = useRouter();
    const address = useAddress()
    const web3 = useWeb3()
    const user = useUser()
    const [error, setError] = useState(null)

    const shouldRedirect = !user


    useEffect(() => {
        if (shouldRedirect) {
            router.push('/login');
        }
    }, [shouldRedirect, router]);

    return (
        <div>
            {shouldRedirect ? (
                <p>Redirecting to login page...</p>
            ) : (
                <>
                <h1>{"Hola " + user.name}</h1>
                <h2>{"Eres admin? "} {user.isAdmin ? "si" : "no"}</h2>
                <h2>{"Tu address" + user.address}</h2>
                </>
            )}
        </div>
    );

}


