import React, { useState } from 'react';
import { Container } from '@mui/material';
import { useLogin } from './useLogin';
import LoginForm from './LoginForm';
import AnimatedGradientBox from '../../components/AnimatedGradiendBox.jsx';

const Login = () => {
  // Destructuración de hooks y variables
  const {
    inputValue,
    showPassword,
    togglePasswordVisibility,
    handleOnChange,
    handleSubmit,
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
      </Container>
    </AnimatedGradientBox>
  );
};

export default Login;