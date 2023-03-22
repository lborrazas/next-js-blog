import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import style from "./toast.module.css";
import { useSession } from "next-auth/react";
import { Button } from "@mui/material";
import axios from "axios";
import Box from "@mui/material/Box";

export const Toast = ({tipe, message}) => {
  const { data: session } = useSession();
  const router = useRouter();

  async function mandar() {
    const result = await axios.get(
      session.address ? `/api/pdf/${session.address}` : null
    );
    router.push("/" + result.data);
  }

  return (
    <div className={`${style.success}`}>
        {message}
    </div>
  );
};
