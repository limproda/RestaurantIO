import React from "react";
import { Link } from "react-router-dom";
import {
  Stack, Paper, Typography, TextField, Button, InputAdornment, IconButton, Link as MuiLink
} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import restaurantioLogo from "../../assets/images/logo.png";

const SignupForm = ({
  inputValue,
  showPassword,
  showConfirmPassword,
  handleOnChange,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility,
  handleMouseDownPassword,
  handleMouseUpPassword,
  handleSubmit,
}) => (
  // Paper de MUI que contiene el formulario con un borde y sombra
  <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      {/* Logo de la aplicación */}
      <img src={restaurantioLogo} alt="Logo de Restaurantio" style={{ maxWidth: '300px', width: '100%', margin: 'auto' }} />
      {/* Título del formulario */}
      <Typography component="h1" variant="h4">Crear Cuenta de Empleado</Typography>
      <Typography>Si eres un empleado nuevo, completa el formulario</Typography>

      {/* Formulario de creación de cuenta */}
      <TextField
        type="email"
        name="email"
        label="Correo"
        value={inputValue.email}
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
        value={inputValue.password}
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
      <TextField type="text" name="name" label="Nombre" value={inputValue.name} onChange={handleOnChange} fullWidth />
      { /* Campo de apellido */}
      <TextField type="text" name="lastName" label="Apellido" value={inputValue.lastName} onChange={handleOnChange} fullWidth />
      { /* Campo de teléfono */}
      <TextField type="tel" name="phone" label="Teléfono" value={inputValue.phone} onChange={handleOnChange} fullWidth />
      {/* Botón de crear cuenta */}
      <Button type="submit" variant="contained" color="primary" fullWidth>Crear Cuenta</Button>
      {/* Enlace para iniciar sesión si ya tiene cuenta */}
      <MuiLink component={Link} to="/login" variant="body2">{"¿Ya tienes una cuenta? Inicia sesión aquí"}</MuiLink>
    </Stack>
  </Paper>
);

export default SignupForm;