import { useEffect } from "react";
import { useUser } from "../../contexts/AppContext";
import { useRouter } from "next/router";
import style from "./home.module.css";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import * as React from "react";

import RedirectPage from "../../components/redirect/RedirectPage";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  marginTop: theme.spacing(3),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const router = useRouter();
  const user = useUser();

  const shouldRedirect = !user;

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
          <h1 className={`${style.helloMessage}`}>{"¡Bienvenido " + user.name + "!"}</h1>
            <Item className={`${style.aaa}`}>
              <h2 className={`${style.itemasInfo}`}>
                {"Rol: "}{user.isAdmin ? "Administrador" : "Cliente"}
              </h2>
            </Item>
            <Item>
              <h2 className={`${style.itemasInfo}`}>{"Billetera asociada: " + user.address}</h2>
            </Item>
         
         
        </>
      )}
    </div>
  );
}
