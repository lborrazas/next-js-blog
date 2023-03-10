import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {getCsrfToken} from "next-auth/react"
import {SiweMessage} from "siwe"

const {PrismaClient} = require("./../../../node_modules/.prisma/client");
const prisma = new PrismaClient();

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req, res) {
    const providers = [
        CredentialsProvider({
            name: "Ethereum",
            credentials: {
                message: {
                    label: "Message",
                    type: "text",
                    placeholder: "0x0",
                },
                signature: {
                    label: "Signature",
                    type: "text",
                    placeholder: "0x0",
                },
            },
            async authorize(credentials) {
                try {
                    const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
                    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)

                    const result = await siwe.verify({
                        signature: credentials?.signature || "",
                        domain: nextAuthUrl.host,
                        nonce: await getCsrfToken({req}),
                    })

                    if (result.success) {
                        const userArr = await prisma.user.findMany({
                            where: {
                                address: siwe.address,
                            },
                        })
                        const user = userArr[0]
                        if (user) {
                            return {
                                id: user.address,
                                name: user.name,
                                email: user.isAdmin
                            }
                        }
                    }
                    return null
                } catch (e) {
                    console.log(e)
                    return null
                }
            },
        }),
    ]

    const isDefaultSigninPage =
        req.method === "GET" && req.query.nextauth.includes("signin")

    // Hide Sign-In with Ethereum from default sign page
    if (isDefaultSigninPage) {
        providers.pop()
    }

    return await NextAuth(req, res, {
        // https://next-auth.js.org/configuration/providers/oauth
        providers,
        pages: {
            signIn: "/login"
        },
        session: {
            strategy: "jwt",
        },
        secret: process.env.NEXTAUTH_SECRET,
        callbacks: {
            // async jwt({token, user, account, profile, isNewUser}) {
            //     token.papa = {...user}
            //     console.log(user)
            //     console.log("papa")
            //     console.log(token)
            //     return token
            // },
            async session({session, token, user}) {
                session.user = token
                session.address  = token.sub
                session.isAdmin = token.email
                console.log(token)
                console.log(session)
                return session
            }
            ,
        },
    })
}