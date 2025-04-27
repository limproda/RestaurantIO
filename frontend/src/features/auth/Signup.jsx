import React from "react";
import { Container, Snackbar, Alert } from "@mui/material";
import { useSignup } from "./useSignup.jsx";
import SignupForm from "./SignupForm.jsx";
import AnimatedGradientBox from '../../components/AnimatedGradiendBox.jsx';

const Signup = () => {
  const {
    inputValue,
    showPassword,
    showConfirmPassword,
    handleOnChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleMouseDownPassword,
    handleMouseUpPassword,
    handleSubmit,
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
      </Container>
    </AnimatedGradientBox>
  );
};

export default Signup;