import styled from "@emotion/styled";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { useState, useEffect } from "react";
import { useUser } from "../../contexts/AppContext";
import { useAddress } from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getCsrfToken, useSession } from "next-auth/react";




export const ExportPDF = () => {

    const router = useRouter();
    const { data: session, status } = useSession();
   

    const shouldRedirect = !session;

    useEffect(() => {
      if (shouldRedirect) {
        router.push("/login");
      }
    }, [shouldRedirect, router]);


    const fetcher = (url) => fetch(url).then((res) => res.json());

    
    const address = session ? session.address : 'qwdsa';

    const { data, error, isLoading } = useSWR(address ? `/api/pdf/${address}` : null, fetcher);

    function downloadPDF(url){
        console.log(url)
    }

    // const link = document.createElement('a');
    // link.href = 'https://www.ejemplo.com/archivo.pdf';
    // link.download = 'archivo.pdf';

    // simular un clic en el enlace
    // document.body.appendChild(link);
    // link.click();


  return (
    <ListItemIcon
                  onClick={() => downloadPDF(data)}
                  sx={{
                    minWidth: 0,
                    mr: "auto",
                    justifyContent: "center",
                  }}
                >
                    <a download href={data ? data.toString() : ''}>
                        <InboxIcon />
                    </a>
    </ListItemIcon>
  );
};

export default ExportPDF;
