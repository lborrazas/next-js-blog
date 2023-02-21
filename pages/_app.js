import React from "react";
import "../styles/global.css";
import { BlockchainProvider } from "../blockchain/BlockchainContext";
import { AppProvider } from "../contexts/AppContext";
import Layout from "../components/layout";
import { ThemeProvider } from "@mui/material";

import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#2c6030",
    },
    secondary: {
      main: "#edf2ff",
    },
  },
});

export default function App({ Component, pageProps }) {
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
  );
}
