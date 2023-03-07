import { useEffect, useState } from "react";
import { useAddress, useWeb3 } from "../../blockchain/BlockchainContext";
import { useUser } from "../../contexts/AppContext";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { navItems } from "../../components/navbar/navbarLists";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

import RedirectPage from "../../components/redirect/RedirectPage";
import { CircularProgress } from "@mui/material";
import {getCsrfToken, useSession} from "next-auth/react";

export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}


export default function home() {
    const router = useRouter();
    const address = useAddress();
    const web3 = useWeb3();
    const { data: session, status } = useSession()

    const [error, setError] = useState(null);


    return (
        <div>
                <>
                    <h1> Hola {session && session.user ? session.user.name : "ha"}</h1>
                </>
        </div>
    );
}