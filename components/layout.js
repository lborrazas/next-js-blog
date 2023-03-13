import Sidebar from "./AppSidebar";
import React, { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useSession } from "next-auth/react";
import "./layout.module.css";
import { useSigner } from "wagmi";
import contractCollector from "../blockchain/ContractCollector";
import {
  useSetVmContract,
  useVmContract,
} from "../blockchain/BlockchainContext";

export const siteTitle = "IxaLab";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const setVmContract = useSetVmContract();
  const vmContract = useVmContract();
  const { data: signer, isError, isLoading } = useSigner();
  const contract2 = contractCollector(signer);

  useEffect(() => {
    //const storedState = localStorage.getItem('myContextState');
    if (!vmContract && !isLoading && signer) {
      setVmContract(contract2);
    }
  }, [vmContract, contract2, isLoading, isError, signer]);

  return (
    <main>
      <CssBaseline />
      {status === "loading" ? (
        <Sidebar />
      ) : status === "authenticated" ? (
        <Sidebar> {children} </Sidebar>
      ) : (
        <div>{children}</div>
      )}
    </main>
  );
}
