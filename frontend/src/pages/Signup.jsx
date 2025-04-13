import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useNotification from "../hooks/useNotification";
import Notification from "../components/common/Notification";
import { API_URL } from "../config";

// Importación de componentes de MUI
import {
  Box,
  Container,
  Stack,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const Signup = () => {
  // Hooks de React y definición de variables
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const { notification, showNotification, handleClose } = useNotification();

  // Función para manejar el cambio de los inputs
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) => {
    showNotification("error", err);
  };
  const handleSuccess = (msg) => {
    showNotification("success", msg);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_URL}/signup`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      // Si la respuesta es exitosa, se muestra la notificación de éxito y se redirige al usuario a "/"
      if (success) {
        handleSuccess("Cuenta creada con éxito");
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        // Si la creación falla, muestra la notificación de error
        handleError("Error al crear cuenta, inténtalo de nuevo");
      }
    } catch (error) {
      // Si ocurre algún error, muestra la notificación de error
      handleError("Ha ocurrido un error inesperado, inténtalo de nuevo");
    }
    setInputValue({
      email: "",
      password: "",
    });
  };

  return (
    // Contenedor principal con un fondo degradado y centrado
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #4C6EF5, #B197FC)",
        py: 4,
      }}
    >
      {/* Contenedor que contiene el formulario de inicio de sesión */}
      <Container maxWidth="sm">
        { /* Paper de MUI que contiene el formulario con un borde y sombra */}
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          {/* Título del formulario */}
          <Typography component="h1" variant="h4" gutterBottom>
            Crear Cuenta
          </Typography>
          {/* Formulario de inicio de sesión */}
          <Stack component="form" spacing={4} onSubmit={handleSubmit}>
            <TextField
              type="email"
              name="email"
              label="Correo"
              value={email}
              placeholder="Escribe tu correo"
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
            <TextField
              type="password"
              name="password"
              label="Contraseña"
              value={password}
              placeholder="Escribe tu contraseña"
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
            {/* Botón de inicio de sesión */}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Crear Cuenta
            </Button>
          </Stack>
        </Paper>
        {/* Notificaciones para el usuario */}
        <Notification
          open={notification.open}
          severity={notification.severity}
          message={notification.message}
          onClose={handleClose}
        />
      </Container>
    </Box>
  );
};

export default Signup;
