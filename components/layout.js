import Sidebar from "./AppSidebar";
import React from "react";
import {useUser} from "../contexts/AppContext";
import CssBaseline from "@mui/material/CssBaseline";


export const siteTitle = "Next.js Sample Website";
import "./layout.module.css";
import {useSession} from "next-auth/react";

export default function Layout({children}) {
    const session = useSession();

    return (<main>
        <CssBaseline/>
        {session.data ? (<Sidebar> {children} </Sidebar>) : (<div>
            {children}
        </div>)}
    </main>);
}
