import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Notification from "../components/common/Notification.jsx";
import useNotification from "../hooks/useNotification";
import AnimatedGradientBox from "../components/layout/AnimatedgradiendBox.jsx";
import { API_URL } from "../config";
import { useMediaQuery, useTheme } from "@mui/material";
import logo from "../assets/images/logo.png";

// Importación de componentes de MUI
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import MuiLink from "@mui/material/Link";
import {
  Container,
  Stack,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const Login = () => {
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

  // Función que alterna la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
    // Envío de la solicitud POST a la API para iniciar sesión
    try {
      const { data } = await axios.post(
        `${API_URL}/login`,
        { ...inputValue },
        { withCredentials: true }
      );
      const { success, message } = data;
      // Si la respuesta es exitosa, se muestra la notificación de éxito y se redirige al usuario a "/"
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        // Si la creación falla, muestra la notificación de error
        handleError(message);
      }
    } catch (error) {
      // Si ocurre algún error, muestra la notificación de error
      console.log(error);
      handleError("Ha ocurrido un error inesperado, inténtalo de nuevo");
    }
    // Reinicia los valores de los inputs después de enviar el formulario
    setInputValue({
      email: "",
      password: "",
    });
  };

  // Funciones para manejar los mensajes de error y éxito
  const handleError = (msg) => {
    showNotification("error", msg);
  };

  const handleSuccess = (msg) => {
    showNotification("success", msg);
  };

  return (
    // Contenedor principal con un fondo degradado dinámico y centrado
    <AnimatedGradientBox>
      {/* Contenedor que contiene el formulario de inicio de sesión */}
      <Container maxWidth="sm">
        { /* Paper de MUI que contiene el formulario con un borde y sombra */}
        <Paper
          elevation={10}
          sx={{
            p: 4,
            width: "100%",
          }}
        >
          {/* Formulario de creación de cuenta */}
          <Stack component="form" spacing={4} onSubmit={handleSubmit}>
            {/* Logo de la aplicación */}
            <img src={logo} alt="Logo" style={{ maxWidth: '300px', width: '100%', margin: 'auto' }} />
            { /* Título del formulario */}
            <Typography component="h1" variant="h4" gutterBottom>
              Iniciar Sesión
            </Typography>
            { /* Gestión de correo */ }
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
            {/* Botón de iniciar sesión */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Iniciar Sesión
            </Button>
            <MuiLink
              component={Link}
              to="/signup"
              variant="body2"
            >
              {"¿Empleado nuevo? Crea una cuenta aquí"}
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

export default Login;