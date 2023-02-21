import "../styles/global.css";
import { BlockchainProvider } from "../blockchain/BlockchainContext";
import { AppProvider } from "../contexts/AppContext";
import Layout from "../components/layout";
import {ThemeProvider} from "@mui/material";
import palette from "../theme/palette.js"
import { createTheme } from "@mui/material/styles";

let theme = createTheme({
    palette: palette
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
