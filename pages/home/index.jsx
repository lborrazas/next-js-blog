import { useEffect, useState } from "react";
import { useAddress, useWeb3 } from "../../blockchain/BlockchainContext";
import { useUser } from "../../contexts/AppContext";
import { redirect } from "next/navigation";
import useSWR from "swr";
import { useRouter } from "next/router";
import Paper from "@mui/material/Paper";
import { styled, useTheme } from "@mui/material/styles";
import style from "./home.module.css";
import Co2Icon from '@mui/icons-material/Co2';

import RedirectPage from "../../components/redirect/RedirectPage";
import { getCsrfToken, useSession } from "next-auth/react";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";

const BigItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#D0F2FF",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  marginTop: theme.spacing(3),
  textAlign: "center",
  height: "400px",
  color: "#04297A",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  marginTop: theme.spacing(3),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const ItemS = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#2b6030",
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

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    session.address ? `api/admin/total/` : null,
    fetcher
  );

  // TODO: rehacer completamente esto
  return (
    <div>
      {shouldRedirect ? (
        <RedirectPage />
      ) : (
        <>
          <Item className={`${style.aaa}`}>
            <h2 className={`${style.itemasInfo}`}>
              {"¡Bienvenido " + session.user.name + "! - "} {session.isAdmin ? "Administrador" : "Cliente"}
            </h2>
            <h2 className={`${style.itemasInfoD}`}>
              {"Billetera asociada: " + session.address}
            </h2>
          </Item>
          <ItemS>
           
          </ItemS>
          <BigItem>
            <div className={`${style.center}`}>
              <h2 className={`${style.allCO2T}`}>
                {"JUNTOS LLEVAMOS MÁS DE "}
              </h2>
              <h2 className={`${style.allCO2M}`}>
               <div className={`${style.icon}`}> {data}<Co2Icon /></div>
              </h2>
              <h2 className={`${style.allCO2B}`}>
                {"CONTRARRESTADO"}
              </h2>
            </div>
          </BigItem>
        </>
      )}
    </div>
  );
}
