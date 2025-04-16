import React from "react";
import { Link } from "react-router-dom";
// Importación de la imagen del logo
import restaurantioLogo from "../../assets/images/logo.png";

// Importación de componentes de MUI
import {
    TextField,
    Button,
    Typography,
    Stack,
    Paper,
    InputAdornment,
    IconButton,
    Link as MuiLink,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginForm = ({
    email,
    password,
    showPassword,
    togglePasswordVisibility,
    handleMouseDownPassword,
    handleMouseUpPassword,
    handleOnChange,
    handleSubmit,
}) => {
    return (
        // Paper de MUI que contiene el formulario con un borde y sombra 
        <Paper elevation={10} sx={{ p: 4, width: '100%' }}>
            {/* Formulario de creación de cuenta */}
            < Stack component="form" spacing={4} onSubmit={handleSubmit} >
                {/* Logo de la aplicación */}
                < img src={restaurantioLogo} alt="Logo de Restaurantio" style={{ maxWidth: '300px', width: '100%', margin: 'auto' }} />
                { /* Título del formulario */}
                <Typography component="h1" variant="h4" gutterBottom>
                    Iniciar Sesión
                </Typography>
                { /* Gestión de correo */}
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
            </Stack >
        </Paper >

    );
};

export default LoginForm;