import Sidebar from "./AppSidebar";
import React, {useEffect} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {useSession} from "next-auth/react";

export const siteTitle = "IxaLab";
import "./layout.module.css";
import {useConnect, useSigner} from "wagmi";
import contractCollector from "../blockchain/ContractCollector";
import {useSetVmContract, useVmContract} from "../blockchain/BlockchainContext";
import RedirectPage from "./redirect/RedirectPage";

export default function Layout({children}) {
    const {data: session, status} = useSession()
    const setVmContract = useSetVmContract()
    const vmContract = useVmContract()
    const {data: signer, isError, isLoading} = useSigner()
    const contract2 = contractCollector(signer)

    useEffect(() => {
        //const storedState = localStorage.getItem('myContextState');
        if (!vmContract && !isLoading && signer) {
            console.log("--------------------------")
            setVmContract(contract2)
        
            console.log(contract2)
        }
        
        console.log(vmContract)
        console.log(isLoading)
        console.log(signer)
        console.log("===============")
    }, [vmContract, contract2, isLoading, isError, signer]);


    return (<main>
        <CssBaseline/>
        {
            status == 'loading' ? (
                <h1>
                    <Sidebar>

                    </Sidebar>
                </h1>
            ) : (
                status == 'authenticated' ?
                    (<Sidebar>{children} </Sidebar>) :
                    (
                        <div>
                            {children}
                        </div>
                    )
            )}
    </main>);
}
