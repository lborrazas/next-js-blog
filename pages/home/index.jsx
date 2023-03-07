import { useEffect, useState } from "react";
import { useAddress, useWeb3 } from "../../blockchain/BlockchainContext";
import { useUser } from "../../contexts/AppContext";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import style from "./home.module.css";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import { navItems } from "../../components/navbar/navbarLists";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import * as React from "react";

import RedirectPage from "../../components/redirect/RedirectPage";
import { CircularProgress } from "@mui/material";
import { getCsrfToken, useSession } from "next-auth/react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  marginTop: theme.spacing(3),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const shouldRedirect = !session;

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [shouldRedirect, router]);

  // TODO: rehacer completamente esto

  return (
    <div>
      {shouldRedirect ? (
        <RedirectPage />
      ) : (
        <>
          <h1 className={`${style.helloMessage}`}>
            {"¡Bienvenido " + session.user.name + "!"}
          </h1>
          <Item className={`${style.aaa}`}>
            <h2 className={`${style.itemasInfo}`}>
              {"Rol: "}
              {session.user.isAdmin ? "Administrador" : "Cliente"}
            </h2>
          </Item>
          <Item>
            <h2 className={`${style.itemasInfo}`}>
              {"Billetera asociada: " + session.address}
            </h2>
          </Item>
        </>
      )}
    </div>
  );
}
