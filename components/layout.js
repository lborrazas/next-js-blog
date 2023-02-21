import Head from "next/head";
import Image from "next/image";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import Sidebar from "./Sidebar";
import React from "react";
import { useUser } from "../contexts/AppContext";
import MiniDrawer from "./MiniDrawer";
import CssBaseline from "@mui/material/CssBaseline";
export const siteTitle = "Next.js Sample Website";
import "./layout.module.css";

export default function Layout({ children }) {
  const user = useUser();

  return (
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
