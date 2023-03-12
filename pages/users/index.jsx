import { useEffect, useState } from "react";
import { useAddress } from "../../blockchain/BlockchainContext";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";
import useSWR from "swr";
import style from "./users.module.css";
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { getCsrfToken, useSession } from "next-auth/react";
import { DataGridSkeleton } from "../../components/skeletons";
import TextField from "@mui/material/TextField";

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default function Home({ users }) {
  const router = useRouter();
  const address = useAddress();
  // TODO: Hay que setear el error
  const [rows, setRows] = useState();
  const [inputValue, setInputValue] = useState("");
  const { data: session } = useSession();

  const fetcher = (url) => fetch(url).then((res) => res.json());
  //todo los null no hacen una mierda
  const { data, isLoading } = useSWR(
    session.address ? `/api/allusers` : null,
    fetcher
  );

  const filterItems = (query) => {
    return data.filter(
      (el) =>
        el.id.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
        el.name
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1 ||
        el.email
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1 ||
        el.address
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
    );
  };

  function filterTable(event) {
    setInputValue(event.target.value);
    const newData = filterItems(event.target.value);
    setRows(newData);
  }

  useEffect(() => {
    if (!isLoading) {
      setRows(data);
    }
  }, [isLoading, data]);

  // let rows = data;

  const columns = [
    { field: "id", headerName: "Id", width: 230 },
    { field: "name", headerName: "Nombre", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "address", headerName: "Address", width: 400 },
    { field: "isAdmin", headerName: "Admin?", width: 90 },
    {
      field: "viewinfo",
      headerName: "Información",
      width: 110,
      display: "flex",
      justifyContent: "center",
      renderCell: (params) => (
        <div
          style={{ justifyContent: "center", display: "flex", width: "100%" }}
        >
          <IconButton
            color="info"
            onClick={() => router.push(`/plot/user/${params.row.address}`)}
          >
            <InfoIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  if (!session.isAdmin || !data || !rows) {
    return <DataGridSkeleton title="Lista de usuarios" />;
  }

  return (
    <Box sx={{ height: "100%" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography component="h1" variant="h4">
          Lista de usuarios
        </Typography>
        <TextField
          id="search-filter"
          label="Buscar"
          variant="outlined"
          value={inputValue}
          onChange={filterTable}
        />
      </Stack>
      <Paper elevation={3} sx={{ padding: "30px", height: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[20]}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? `${style.odd}` : ""
          }
        />
      </Paper>
    </Box>
  );
}
