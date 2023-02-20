import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import Sidebar from "./Sidebar";
import React from "react";
import {useUser} from "../contexts/AppContext";
import MiniDrawer from "./MiniDrawer";
import CssBaseline from "@mui/material/CssBaseline";
const name = 'Mate';
export const siteTitle = 'Next.js Sample Website';

export default function Layout({ children }) {

    const user = useUser()

    return (
        <>
            <CssBaseline />
                {user ? <MiniDrawer> {children} </MiniDrawer> : <main>{children}</main>}
        </>
        );
}