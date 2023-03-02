import { useState, useEffect, useRef } from "react";

import { useUser } from "../../contexts/AppContext";
import { useAddress, useVmContract, useWeb3 } from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
import useSWR from "swr";
import style from "./users.module.css";
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

import { DataGrid } from '@mui/x-data-grid';
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
  const [inputValue, setInputValue] = useState('');

  const shouldRedirect = !user;
  const fetcher = (url) => fetch(url).then((res) => res.json())
  let addressSend = address;
  let titleListView = "";
  if (user.isAdmin) {
    addressSend = "admin"
    titleListView = "Lista de usuarios";
  }
  const { data, error, isLoading } = useSWR(address ? `/api/allusers` : null, fetcher)

  const filterItems = query => {
    return data.filter((el) =>
      (el.id.toLowerCase().indexOf(query.toLowerCase()) > -1 || el.name.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1 || el.email.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1 || el.address.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1)
    );
  }

  function filterTable(event){
    setInputValue(event.target.value);
    let newData = filterItems(event.target.value);
    setRows(newData);
  }

  function redirectUrl(params,p){
    console.log(params);
    router.push(params + "/" + p.id);
  }

  useEffect(() => {
    if (!isLoading) {
      setRows(data);
    }
  }, [isLoading, data]);


  // let rows = data;

  const columns = [
    { field: 'id', headerName: 'Id', width: 300 },
    { field: 'name', headerName: 'Nombre', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'address', headerName: 'Address', width: 400 },
    { field: 'isAdmin', headerName: 'Admin?', width: 90 },
    {
      field: 'viewinfo', headerName: 'Ver info.', width: 125, renderCell: (params) => (
        <button className={`${style.buttonTable} ${style.redBack}`} onClick={() => redirectUrl('info', params)}>Ver info.</button>
      )
    },
  ];

  if (errora) {
    return <div> failed to load</div>;
  }
  if (!data || rows == undefined || titleListView == "") {
    return (<div className="App">Loading...</div>)
  }
  else {
   
    return (
      <Box sx={{ flexGrow: 1 }}>
        {
          shouldRedirect ? (<RedirectPage />) :
            <><Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
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
                      name="filter" />
            </Stack>
              <Item sx={{
                height: "75vH",
                borderColor: 'primary.light',
                '& .MuiDataGrid-cell:hover': {
                  color: 'primary.main',
                },
              }} >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? `${style.odd}` : ''
                  }
                />
              </Item>
            </>
        }
      </Box >
    );
  }
}
