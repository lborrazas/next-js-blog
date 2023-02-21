import Sidebar from "./AppSidebar";
import React from "react";
import { useUser } from "../contexts/AppContext";
import CssBaseline from "@mui/material/CssBaseline";
export const siteTitle = "Next.js Sample Website";
import "./layout.module.css";

export default function Layout({ children }) {
  const user = useUser();

  if (!!user) {
    return (
      <main>
        <CssBaseline />
        <Sidebar>{children}</Sidebar>
      </main>
    );
  } else {
    return (
      <main>
        <CssBaseline />
        <div>{children}</div>
      </main>
    );
  }
  turn (
    <main>
      <CssBaseline />
      {user ? (
        <MiniDrawer> {children} </MiniDrawer>
      ) : (
        <div
        >
          {children}
        </div>
      )}
    </main>
  );
}
