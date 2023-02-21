import { useRef, useState, useEffect } from "react";
import style from "./signup.module.css";
import axios from "axios";
import { User, useSetUser } from "../../contexts/AppContext";
import { useAddress, useWeb3 } from "../../blockchain/BlockchainContext";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function SignUp() {
  const [error, setError] = useState("");
  const username = useRef();
  const email = useRef();
  const setUser = useSetUser();
  const address = useAddress();

  useEffect(() => {
    setError("");
  }, [username, email]);

  const cosasParaSignup = async (username, email) => {
    let user = {
      name: username,
      email: email,
      address: address,
      isAdmin: true,
    };
    console.log(address);

    await axios.post("/api/usercreate", user);
    let body = { address: address };
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
    <div className={style.signupPage}>
      <div className={style.signupContainer}>
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
      </div>
    </div>
  );
}
