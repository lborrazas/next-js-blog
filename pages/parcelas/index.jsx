import { useState, useEffect, useRef } from "react";

import { useUser } from "../../contexts/AppContext";
import {
  useAddress,
} from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
import useSWR from "swr";
import style from "./parcelas.module.css";
import RedirectPage from "../../components/redirect/RedirectPage";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { UpdatePlotSkeleton } from "../../components/skeletons/PlotSkeleton";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

// TODO: para que queres users? no se usa
export default function Parcelas({ users }) {
  const router = useRouter();
  const address = useAddress();
  const user = useUser();
  // TODO: setear el error para que no?
  const [error, setError] = useState(null);
  const [rows, setRows] = useState();
  const [inputValue, setInputValue] = useState("");

  const shouldRedirect = !user;
  const fetcher = (url) => fetch(url).then((res) => res.json());
  let addressSend = address;
  let titleListView = "Lista de mis parcelas";
  if (user.isAdmin) {
    addressSend = "admin";
    titleListView = "Lista de todas las parcelas";
  }
  const { data, isLoading } = useSWR(
    address ? `/api/enhance/mytokens/${addressSend}` : null,
    fetcher
  );

  const filterItems = (query) => {
    return data.filter(
      (el) =>
        el.id.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
        el.latitud
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1 ||
        el.longitud
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

  function redirectUrl(params, p) {
    router.push(params + "/" + p.id);
  }

  useEffect(() => {
    if (!isLoading) {
      setRows(data);
    }
  }, [isLoading, data]);

  // let rows = data;

  const columns = [
    { field: "id", headerName: "Id" },
    { field: "latitud", headerName: "Latitud" },
    { field: "longitud", headerName: "Longitud" },
    { field: "m2", headerName: "Metros cuadrados" },
    { field: "address", headerName: "Usuario" },
    // { field: 'pid', headerName: 'Column 2', width: 150 },
    { field: "m2used", headerName: "Area ocupada" },
    { field: "m3", headerName: "Altura promedio" },
    { field: "date", headerName: "Fecha" },
    {
      field: "update",
      headerName: "Actualizar",
      //width: 125,
      renderCell: (params) => (
        <Button
          className={`${style.buttonTable} ${style.greenBack}`}
          onClick={() => redirectUrl("update", params)}
        >
          Actualizar
        </Button>
      ),
    },
    {
      field: "viewinfo",
      headerName: "Ver info.",
      width: 125,
      renderCell: (params) => (
        <Button
          className={`${style.buttonTable} ${style.redBack}`}
          onClick={() => redirectUrl("plot", params)}
        >
          Ver info.
        </Button>
      ),
    },
    {
      field: "borrar",
      headerName: "Borrar.",
      width: 125,
      renderCell: (params) => (
        <Button onClick={() => console.log(`TODO${params}`)}>Borrar</Button>
      ),
    },
  ];

  if (error) {
    return <div> failed to load</div>;
  }
  if (!data || !rows) {
    return <UpdatePlotSkeleton />;
  } else {
    return (
      <Box sx={{ flexGrow: 1 }}>
        {shouldRedirect ? (
          <RedirectPage />
        ) : (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={5}
            >
              <Typography component="h1" variant="h4">
                {titleListView}
              </Typography>
              <input
                className={`${style.filterInput}`}
                margin="normal"
                value={inputValue}
                id="filter"
                label="Buscar"
                placeholder="Buscar"
                onChange={filterTable}
                name="filter"
              />
            </Stack>
            <Item
              sx={{
                height: "75vH",
                borderColor: "primary.light",
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0
                    ? `${style.odd}`
                    : ""
                }
              />
            </Item>
          </>
        )}
      </Box>
    );
  }
}
