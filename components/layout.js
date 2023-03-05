import Sidebar from "./AppSidebar";
import React from "react";
import { useUser } from "../contexts/AppContext";
import CssBaseline from "@mui/material/CssBaseline";

export const siteTitle = "IxaLab";
import "./layout.module.css";

export default function Layout({ children }) {
  const user = useUser();

  if (!user) {
    return (
      <main>
        <CssBaseline />
        {children}
      </main>
    );
  }

  return (
    <>
      <CssBaseline />
      <Sidebar>{children}</Sidebar>
    </>
  );
}
