import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { Button } from "@mui/material";
import axios from "axios";

export const ExportPDF = () => {
  const { data: session } = useSession();
  const router = useRouter();

  async function mandar() {
    const result = await axios.get(
      session.address ? `/api/pdf/${session.address}` : null
    );
    router.push("/" + result.data);
  }

  return (
    <ListItemIcon
      sx={{
        minWidth: 0,
        mr: "auto",
        justifyContent: "center",
      }}
    >
      <Button onClick={mandar}>
        <InboxIcon />
      </Button>
    </ListItemIcon>
  );
};
