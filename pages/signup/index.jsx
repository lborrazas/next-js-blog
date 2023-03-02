import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { User, useSetUser } from "../../contexts/AppContext";
import { useAddress } from "../../blockchain/BlockchainContext";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { keyframes } from "@mui/material";
import styled from "@emotion/styled";

const gradient = keyframes`
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
`;

const PageSignup = styled("div")({
  display: "grid",
  minHeight: "100vh",
  backgroundColor: "rgb(240, 255, 227)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundImage: 'url("public/hexagons.svg")',
});

const SignupContainer = styled("div")({
  margin: "auto",
  width: "500px",
  alignSelf: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "4rem 6rem",
  border: "1px solid #2c6030",
  borderRadius: "8px",
  background: "linear-gradient(-45deg, #ffddf9, #e6bcff, #d4f8ff, #ffddf9)",
  backgroundSize: "400% 400%",
  animation: `${gradient} 10s ease infinite`,
});

export default function SignUp() {
  const [error, setError] = useState("");
  const username = useRef();
  const email = useRef();
  const setUser = useSetUser();
  const address = useAddress();
  const router = useRouter();
  useEffect(() => {
    setError("");
  }, [username, email]);

  const cosasParaSignup = async (username, email) => {
    const user = {
      name: username,
      email: email,
      address: address,
      isAdmin: true,
    };

    await axios.post("/api/usercreate", user);
    const body = { address: address };
    const is_registered = await axios.post("/api/getuser", body);
    setUser(
      new User(
        is_registered.data[0].id,
        is_registered.data[0].name,
        is_registered.data[0].email,
        address,
        is_registered.data[0].isAdmin
      )
    );
    router.push("/home");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("username") === "" || data.get("email") === "") {
      setError("Los campos no pueden ser vacios");
    } else {
      cosasParaSignup(data.get("username"), data.get("email"));
    }
  };

  return (
    <PageSignup>
      <SignupContainer>
        <Typography component="h1" variant="h4">
          IxaTesis
        </Typography>
        <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuario"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
            }}
          >
            Crear cuenta
          </Button>
        </Box>
        {error && <Typography variant="body2">{error}</Typography>}
      </SignupContainer>
    </PageSignup>
  );
}
