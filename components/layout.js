import Sidebar from "./AppSidebar";
import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {useSession} from "next-auth/react";

export const siteTitle = "IxaLab";
import "./layout.module.css";

export default function Layout({children}) {
    const session = useSession();

    return (<main>
        <CssBaseline/>
        {session.data ? (<Sidebar> {children} </Sidebar>) : (<div>
            {children}
        </div>)}
    </main>);
}
