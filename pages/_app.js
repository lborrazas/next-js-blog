import "../styles/global.css";
import { BlockchainProvider } from "../blockchain/BlockchainContext";
import { AppProvider } from "../contexts/AppContext";
import Layout from "../components/layout";
import { ThemeProvider } from "@mui/material";
import palette from "../theme/palette.js";
import { createTheme } from "@mui/material/styles";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { mainnet, polygon, goerli, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const theme = createTheme({
  palette: palette,
});
export const { chains, provider } = configureChains(
  [mainnet, polygon, goerli, polygonMumbai],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <BlockchainProvider>
          <AppProvider>
            <ThemeProvider theme={theme}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </AppProvider>
        </BlockchainProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
