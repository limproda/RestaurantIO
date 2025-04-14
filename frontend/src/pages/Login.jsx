import React, { useState } from 'react';
import { Container } from '@mui/material';
import { useLogin } from '../hooks/useLogin';
import LoginForm from '../components/common/LoginForm.jsx';
import AnimatedGradientBox from '../components/layout/AnimatedGradiendBox.jsx';
import { Alert, Snackbar } from '@mui/material';

const Login = () => {
  // Destructuración de hooks y variables
  const {
    inputValue,
    showPassword,
    togglePasswordVisibility,
    handleOnChange,
    handleSubmit,
    notification,
    handleCloseNotification,
  } = useLogin();

  return (
    // Contenedor principal con un fondo degradado dinámico y centrado
    <AnimatedGradientBox>
      {/* Contenedor que contiene el formulario de inicio de sesión */}
      <Container maxWidth="sm">

        {/* Formulario del Login */}
      <LoginForm
          email={inputValue.email}
          password={inputValue.password}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          handleOnChange={handleOnChange}
          handleSubmit={handleSubmit}
        />
        {/* Notificaciones para el usuario */}
        <Snackbar
          open={notification.open}
          autoHideDuration={5000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled">
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </AnimatedGradientBox>
  );
};

export default Login;