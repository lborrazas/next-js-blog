import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Paper from "@mui/material/Paper";

import RedirectPage from "../../components/redirect/RedirectPage";
import { getCsrfToken, useSession } from "next-auth/react";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";

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
        <Stack spacing={2}>
          <Typography variant="h3" component="h1" sx={{ alignText: "end" }}>
            {`¡Bienvenido ${session.user.name}!`}
          </Typography>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" component="h3">
              {`Rol: ${session.isAdmin ? "Administrador" : "Cliente"}`}
            </Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" component="h3">
              {`Billetera asociada: ${session.address}`}
            </Typography>
          </Paper>
        </Stack>
      )}
    </div>
  );
}
