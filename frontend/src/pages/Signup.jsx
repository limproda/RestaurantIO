import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useNotification from "../hooks/useNotification";
import Notification from "../components/common/Notification";
import { FRONTEND_URL, API_URL } from "../config";
import AnimatedGradientBox from "../components/layout/AnimatedgradiendBox.jsx";
import logo from "../assets/images/logo.png";

// Importación de componentes de MUI
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MuiLink from "@mui/material/Link";

import {
  Container,
  Stack,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton
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

  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState("");

  // Funciones que alternan la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPassword((prev) => !prev);
  };

  // Previene el comportamiento por defecto al mantener pulsado el botón del ícono
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  // Función para manejar el cambio de los inputs
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica si las contraseñas coinciden
    if (inputValue.password !== inputValue.confirmPassword) {
      showNotification("error", "Las contraseñas no coinciden");
      return;
    }

    // Envío de la solicitud POST a la API para iniciar sesión
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
        showNotification("success", message);
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        // Si la creación falla, muestra la notificación de error
        showNotification("error", message);
      }
    } catch (error) {
      // Si ocurre algún error, muestra la notificación de error
      showNotification("error", error.message);
    }
    // Reinicia los valores de los inputs después de enviar el formulario
    setInputValue({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      lastName: "",
      phone: "",
    });
  };

  return (
    // Contenedor principal con un fondo degradado dinámico y centrado
    <AnimatedGradientBox>
      {/* Contenedor que contiene el formulario de inicio de sesión */}
      <Container maxWidth="sm">
        { /* Paper de MUI que contiene el formulario con un borde y sombra */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
          }}
        >
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          {/* Logo de la aplicación */}
          <img src={logo} alt="Logo" style={{ maxWidth: '300px', width: '100%', margin: 'auto'}}/>
          {/* Título del formulario */}
          <Typography component="h1" variant="h4">
            Crear Cuenta de Empleado
          </Typography>
          <Typography component="h2" subtitle1="h1">
            Si eres un empleado nuevo, completa el formulario
          </Typography>

          {/* Formulario de creación de cuenta */}
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
            { /* Gestión de contraseña */}
            <TextField
              type={showPassword ? "text" : "password"}
              name="password"
              label="Contraseña"
              value={password}
              placeholder="Escribe tu contraseña"
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
              // Gestión de la visibilidad de la contraseña
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility} // Si se pulsa, se cambia el estado de la visibilidad de la contraseña
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            { /* Gestión de confirmar contraseña */}
            <TextField
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              label="Confirmar Contraseña"
              value={inputValue.confirmPassword}
              placeholder="Repite tu contraseña"
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
              // Gestión de la visibilidad de la contraseña
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility} // Si se pulsa, se cambia el estado de la visibilidad de la contraseña
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            { /* Campo de nombre */}
            <TextField
              type="text"
              name="name"
              label="Nombre"
              value={inputValue.name}
              placeholder="Escribe tu nombre"
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
            { /* Campo de apellido */}
            <TextField
              type="text"
              name="lastName"
              label="Apellido"
              value={inputValue.lastName}
              placeholder="Escribe tu apellido"
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
            { /* Campo de teléfono */}
            <TextField
              type="tel"
              name="phone"
              label="Teléfono"
              value={inputValue.phone}
              placeholder="Escribe tu teléfono"
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            {/* Botón de crear cuenta */}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Crear Cuenta
            </Button>
            <MuiLink
              component={Link}
              to="/login"
              variant="body2"
            >
              {"¿Ya tienes una cuenta? Inicia sesión aquí"}
            </MuiLink>
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
    </AnimatedGradientBox>
  );
};

export default Signup;