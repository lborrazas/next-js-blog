import { useState, useEffect, useRef } from "react";

import { useUser } from "../../contexts/AppContext";
import {
  useAddress,
  useVmContract,
  useWeb3,
} from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
import useSWR from "swr";
import style from "./parcelas.module.css";
import axios from "axios";
import RedirectPage from "../../components/redirect/RedirectPage";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Iconify from "../../components/iconify";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

export default function home({ users }) {
  const router = useRouter();
  const address = useAddress();
  const web3 = useWeb3();
  const user = useUser();
  const latitude = useRef();
  const longitude = useRef();
  const area = useRef();
  const sliderRef = useRef();
  const averageHeight = useRef();
  const userOwner = useRef();
  const vmContract = useVmContract();
  const [errora, setError] = useState(null);
  const [rows, setRows] = useState();

  const shouldRedirect = !user;
  const fetcher = (url) => fetch(url).then((res) => res.json());
  let addressSend = address;
  let titleListView = "Lista de mis parcelas";
  if (user.isAdmin) {
    addressSend = "admin";
    titleListView = "Lista de todas las parcelas";
  }
  const { data, error, isLoading } = useSWR(
    address ? `/api/enhance/mytokens/${addressSend}` : null,
    fetcher
  );

  const filterItems = (query) => {
    return data.filter(
      (el) => el.id.toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  function filterTable(params) {
    let newData = filterItems(params);
    setRows(newData);
  }

  function tenete(params) {
    console.log("rae");
  }

  useEffect(() => {
    if (!isLoading) {
      setRows(data);
    }
  }, [isLoading, data]);

  // let rows = data;

  const columns = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "latitud", headerName: "Latitud", width: 90 },
    { field: "longitud", headerName: "Longitud", width: 100 },
    { field: "m2", headerName: "Metros cuadrados", width: 150 },
    { field: "address", headerName: "Usuario", width: 180 },
    // { field: 'pid', headerName: 'Column 2', width: 150 },
    { field: "m2used", headerName: "Area ocupada", width: 110 },
    { field: "m3", headerName: "Altura promedio", width: 120 },
    { field: "date", headerName: "Fecha", width: 120 },
    {
      field: "update",
      headerName: "Actualizar",
      width: 125,
      renderCell: (params) => (
        <button
          className={`${style.buttonTable} ${style.greenBack}`}
          onClick={() => tenete(params)}
        >
          Actualizar
        </button>
      ),
    },
    {
      field: "assign",
      headerName: "Asignar",
      width: 125,
      renderCell: (params) => (
        <button
          className={`${style.buttonTable} ${style.blueBack}`}
          onClick={() => tenete(params)}
        >
          Asignar
        </button>
      ),
    },
    {
      field: "viewinfo",
      headerName: "Ver info.",
      width: 125,
      renderCell: (params) => (
        <button
          className={`${style.buttonTable} ${style.redBack}`}
          onClick={() => tenete(params)}
        >
          Ver info.
        </button>
      ),
    },
  ];

  if (errora) {
    return <div> failed to load</div>;
  }
  if (!data || rows == undefined) {
    return <div className="App">Loading...</div>;
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
                id="filter"
                label="Buscar"
                placeholder="Buscar"
                onChange={() => filterTable("clef5s")}
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
