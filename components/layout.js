import Sidebar from "./AppSidebar";
import React from "react";
import {useUser} from "../contexts/AppContext";
import CssBaseline from "@mui/material/CssBaseline";


export const siteTitle = "Next.js Sample Website";
import "./layout.module.css";

export default function Layout({children}) {
    const user = useUser();

    return (<main>
        <CssBaseline/>
        {user ? (<Sidebar> {children} </Sidebar>) : (<div>
            {children}
        </div>)}
    </main>);
}
