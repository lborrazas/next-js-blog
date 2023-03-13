import { useState, useEffect } from "react";
import { useUser } from "../../contexts/AppContext";
import { useAddress } from "../../blockchain/BlockchainContext";
import { useRouter } from "next/router";
import useSWR from "swr";
import style from "./parcelas.module.css";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { UpdatePlotSkeleton } from "../../components/skeletons/PlotSkeleton";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { EditPlotDialog } from "../../components/dialog/EditPlotDialog";
import { useSession } from "next-auth/react";

export default function Parcelas() {
  77;
  const { data: session, status } = useSession();
  const address = session.address;
  // TODO: get de los users
  const users = [];

  // TODO: setear el error para que no?
  const [error, setError] = useState(null);
  // TODO: esto no deberia existir
  const [rows, setRows] = useState();
  const [inputValue, setInputValue] = useState("");
  const [selectedPlot, setSelectedPlot] = useState(undefined);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const router = useRouter();

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const addressSend = address;
  let titleListView = "Lista de mis parcelas";
  if (session && session.isAdmin) {
    titleListView = "Lista de todas las parcelas";
  }
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

  const handleDeletePlot = (params) => {
    // TODO: delete plot
    console.log(`TODO${params}`);
  };

  const columns = [
    { field: "pid", headerName: "Id", width: 200 },
    { field: "latitud", headerName: "Latitud", width: 90 },
    { field: "longitud", headerName: "Longitud", width: 100 },
    { field: "m2", headerName: "Metros cuadrados", width: 150 },
    { field: "userName", headerName: "Usuario", width: 180 },
    // { field: 'pid', headerName: 'Column 2', width: 150 },
    { field: "m2used", headerName: "Area ocupada", width: 110 },
    { field: "m3", headerName: "Altura promedio", width: 120 },
    { field: "date", headerName: "Fecha", width: 220 },
    {
      field: "update",
      headerName: "Actualizar",
      width: 100,
      renderCell: (params) => (
        <div  style={{ justifyContent: 'center', display: 'flex', width: '100%'}}>
           <IconButton color="primary" onClick={() => handleEditPlot(params.row)}>
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
        <div  style={{ justifyContent: 'center', display: 'flex', width: '100%'}}>
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
  if (error) {
    return <div> failed to load</div>;
  }

  if (!data || !rows) {
    return <UpdatePlotSkeleton />;
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
          {titleListView}
        </Typography>
        <input
          className={`${style.filterInput}`}
          value={inputValue}
          id="filter"
          placeholder="Buscar"
          onChange={filterTable}
          name="filter"
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
