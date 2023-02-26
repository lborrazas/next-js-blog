import { getCsrfToken, signIn, useSession } from "next-auth/react"
import { SiweMessage } from "siwe"
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi"
import Layout from "../components/layout"
import { InjectedConnector } from 'wagmi/connectors/injected'
import React, { useEffect, useState } from "react"
import Sidebar from "../components/AppSidebar";
import { useRouter } from "next/router";

function Siwe() {
    const router = useRouter()
    const { signMessageAsync } = useSignMessage()
    const { chain } = useNetwork()
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    const { data: session, status } = useSession()

    const handleLogin = async () => {
        try {
            const callbackUrl = "/protected"
            const message = new SiweMessage({
                domain: window.location.host,
                address: address,
                statement: "Sign in with Ethereum to the app.",
                uri: window.location.origin,
                version: "1",
                chainId: chain?.id,
                nonce: await getCsrfToken(),
            })
            const signature = await signMessageAsync({
                message: message.prepareMessage(),
            })
            console.log(message)
            signIn("credentials", {
                message: JSON.stringify(message),
                redirect: false,
                signature,
                callbackUrl,
            })
            console.log(session)
        } catch (error) {
            window.alert(error)
        }
    }

    useEffect(() => {
        console.log(isConnected);
        if (isConnected && !session) {
            handleLogin()
        }
    }, [isConnected])


    return (
        <Layout>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    if (!isConnected) {
                        connect()
                    } else {
                        handleLogin()
                    }
                }}
            >
                Sign-in
            </button>
            {session ? (<h1> "gato " {session.user.name} </h1>) :  (<div>
                "puto"
            </div>)}
        </Layout>
    )
}

export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}

Siwe.Layout = Layout

export default Siwe