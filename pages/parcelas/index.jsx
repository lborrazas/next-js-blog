import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import style from "./parcelas.module.css";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { DataGridSkeleton } from "../../components/skeletons/DataGridSkeleton";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { EditPlotDialog } from "../../components/dialog/EditPlotDialog";
import { useSession } from "next-auth/react";
import TextField from "@mui/material/TextField";

export default function Parcelas() {
  const { data: session } = useSession();
  const address = session.address;
  // TODO: get de los users
  const users = [];
  const [rows, setRows] = useState();
  const [inputValue, setInputValue] = useState("");
  const [selectedPlot, setSelectedPlot] = useState(undefined);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const router = useRouter();

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, isLoading } = useSWR(
    session?.isAdmin
      ? `/api/enhance/mytokens/all`
      : `/api/enhance/mytokens/${session.address}`,
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
          .indexOf(query.toString().toLowerCase()) > -1 ||
        el.userName
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
    router.push(params + "/" + p.row.pid);
  }

  useEffect(() => {
    console.log(data)
    if (!isLoading) {
      setRows(data);
    }
  }, [isLoading, data]);

  const handleEditPlot = (plot) => { 
    setSelectedPlot(plot);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedPlot(undefined);
  };

  const columns = [
    { field: "latitud", headerName: "Latitud", width: 110 },
    { field: "longitud", headerName: "Longitud", width: 120 },
    { field: "m2", headerName: "Metros cuadrados", width: 150 },
    { field: "userName", headerName: "Usuario", width: 190 },
    { field: "m2used", headerName: "Area ocupada", width: 130 },
    { field: "m3", headerName: "Altura promedio", width: 140 },
    { field: "date", headerName: "Fecha", width: 220 },
    {
      field: "update",
      headerName: "Actualizar",
      width: 100,
      renderCell: (params) => (
        <div
          style={{ justifyContent: "center", display: "flex", width: "100%" }}
        >
          <IconButton
            color="primary"
            onClick={() => handleEditPlot(params.row)}
          >
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
    {
      field: "viewinfo",
      headerName: "Información",
      width: 110,
      renderCell: (params) => (
        <div
          style={{ justifyContent: "center", display: "flex", width: "100%" }}
        >
          <IconButton
            color="info"
            onClick={() => {
              router.push({
                pathname: `/plot/${params.row.pid}`,
              });
            }}
          >
            <InfoIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  if (!data || !rows) {
    return <DataGridSkeleton title="Lista de todas las parcelas" />;
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
          Lista de todas las parcelas
        </Typography>
        <TextField
          id="search-filter"
          label="Buscar"
          variant="outlined"
          value={inputValue}
          onChange={filterTable}
        />
      </Stack>
      <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
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
      {selectedPlot && (
        <EditPlotDialog
          open={openEditDialog}
          handleClose={handleCloseEditDialog}
          selectedPlot={selectedPlot}
          users={users}
        />
      )}
    </Box>
  );
}
