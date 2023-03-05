import TokenIcon from "@mui/icons-material/Token";
import GroupsIcon from "@mui/icons-material/Groups";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import HomeIcon from "@mui/icons-material/Home";
import GrassIcon from "@mui/icons-material/Grass";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import AppsIcon from "@mui/icons-material/Apps";
import RecentActorsIcon from '@mui/icons-material/RecentActors';


export const navItems = [
  { Name: "Inicio", Icon: HomeIcon, Url: "/home" },
  { Name: "Clientes", Icon: GroupsIcon, Url: "" },
  { Name: "Parcelas", Icon: TokenIcon, Url: "/plot" },
  { Name: "Crear Parcela", Icon: GrassIcon, Url: "/create" },
  { Name: "Lista de Usuarios", Icon: RecentActorsIcon, Url: "/users" },
  { Name: "Lista de parcelas", Icon: AppsIcon, Url: "/parcelas" },
  { Name: "Metricas", Icon: AutoGraphIcon, Url: "" },
  { Name: "Transfer", Icon: SyncAltIcon, Url: "/transfer" },
];
