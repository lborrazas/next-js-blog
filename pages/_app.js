import '../styles/global.css';
import {BlockchainProvider} from "../blockchain/BlockchainContext";
import {AppProvider, useUser} from "../contexts/AppContext";

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import Layout, {siteTitle} from '../components/layout';
import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import {ThemeProvider} from "@mui/material";
import palette from "../theme/palette.js"

import { createTheme } from '@mui/material/styles';

let theme = createTheme({
    palette: palette
});




export default function App({Component, pageProps}) {

    return (
        <BlockchainProvider>
            <AppProvider>
                <ThemeProvider theme={theme}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ThemeProvider>
            </AppProvider>
        </BlockchainProvider>
    )

}
