const { PrismaClient } = require("./../../node_modules/.prisma/client");
const prisma = new PrismaClient();
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Iconify from "../../components/iconify";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { PlotForm } from "../../components/plot/PlotForm";

// TODO: WTF?
export async function getServerSideProps(context) {
  const users = await prisma.user.findMany();
  return {
    props: {
      users,
    },
  };
}

export default function Create({ users }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography component="h1" variant="h4">
          Crear parcela
        </Typography>
      </Stack>
      <Paper elevation={3} sx={{ padding: "30px" }}>
        <PlotForm users={users} />
      </Paper>
    </Box>
  );
}
