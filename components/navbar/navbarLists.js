import TokenIcon from '@mui/icons-material/Token';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import HomeIcon from '@mui/icons-material/Home';
import GrassIcon from '@mui/icons-material/Grass';

export const navItems = [
    { Name: "Inicio", Icon: HomeIcon, Url: "/home"},
    { Name: "Clientes", Icon: GroupsIcon, Url: ""},
    { Name: "Parcelas", Icon: TokenIcon, Url: "/plot"},
    { Name: "Crear Parcela", Icon: GrassIcon, Url: "/create" },
    { Name: "Actualizar Parcela", Icon: GrassIcon, Url: "/update/3" },
    { Name: "Metricas", Icon: AutoGraphIcon, Url: ""},
]