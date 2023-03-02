import { useEffect } from "react";
import { useUser } from "../../contexts/AppContext";
import { useRouter } from "next/router";
import * as React from "react";

import RedirectPage from "../../components/redirect/RedirectPage";

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
          <h1>{"Hola " + user.name}</h1>
          <h2>
            {"Eres admin? "} {user.isAdmin ? "si" : "no"}
          </h2>
          <h2>{"Manden plata a " + user.address}</h2>
        </>
      )}
    </div>
  );
}
