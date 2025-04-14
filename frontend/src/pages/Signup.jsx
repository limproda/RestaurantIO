import React from "react";
import { Container, Snackbar, Alert } from "@mui/material";
import { useSignup } from "../hooks/useSignup.jsx";
import SignupForm from "../components/common/SignupForm.jsx";
import AnimatedGradientBox from "../components/layout/AnimatedGradiendBox.jsx";

const Signup = () => {
  const {
    inputValue,
    showPassword,
    showConfirmPassword,
    notification,
    handleOnChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleMouseDownPassword,
    handleMouseUpPassword,
    handleSubmit,
    handleCloseNotification
  } = useSignup();

  return (
    // Contenedor principal con un fondo degradado dinámico y centrado
    <AnimatedGradientBox>
      {/* Contenedor que contiene el formulario de registro de usuario */}
      <Container maxWidth="sm">
        {/* Formulario de registro de usuario */}
        <SignupForm
          inputValue={inputValue}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          handleOnChange={handleOnChange}
          togglePasswordVisibility={togglePasswordVisibility}
          toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
          handleMouseDownPassword={handleMouseDownPassword}
          handleMouseUpPassword={handleMouseUpPassword}
          handleSubmit={handleSubmit}
        />
        {/* Notificaciones para el usuario */}
        <Snackbar
          open={notification.open}
          autoHideDuration={5000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={notification.severity} variant="filled" onClose={handleCloseNotification}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </AnimatedGradientBox>
  );
};

export default Signup;