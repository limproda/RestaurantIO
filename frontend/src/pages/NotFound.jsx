import React from "react";
import { Container, Typography, Button, Paper } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const { setUser } = useContext(AuthContext);

  const Logout = () => {
    removeCookie("token", { path: "/" });
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        404 Not Found
      </Typography>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "5rem",
          height: "60vh",
        }}
      >
        <Typography variant="h2">Oops!</Typography>
        <Typography variant="body1">
          La página a la que intentas acceder no existe o no tienes permisos
          para verla.
        </Typography>
        <Button variant="contained" color="primary" onClick={Logout}>
          LOGOUT
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound;
