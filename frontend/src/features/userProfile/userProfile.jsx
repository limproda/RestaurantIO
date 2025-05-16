import React from "react";
import { useNavigate } from "react-router-dom";
import { UserForm } from "../../components/UserForm";
import { useUserProfile } from "./useUserProfile";
import { useRole } from "../role/useRole";
import { Typography, Box } from "@mui/material";

// Página de ajustes de perfil de usuario
export default function UserProfile() {
  const navigate = useNavigate();
  const { isAdmin } = useRole(); // Determina si el usuario es administrador o no

  const {
    profile, // Datos del usuario
    loading, // Indicador de carga
    submitting, // Indicador de envío
    handleFieldChange, // Actualizar campos de texto
    handleDateChange, // Actualizar fechas
    handleSubmit, // Envío de formulario
    handleProfilePicChange, // Manejo de la foto de perfil
    newProfilePreview, // Preview de la nueva foto seleccionada
    clearNewProfile, // Limpia la preview al cancelar
  } = useUserProfile();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {/* Título de la página */}
      <Typography variant="h1">Ajustes de tu Perfil</Typography>

      {/* Formulario con los datos y las acciones */}
      <UserForm
        user={profile}
        loading={loading}
        submitting={submitting}
        onFieldChange={handleFieldChange}
        onDateChange={handleDateChange}
        onSubmit={handleSubmit}
        handleProfilePicChange={handleProfilePicChange} // Foto de perfil
        newProfilePreview={newProfilePreview} // Preview local
        onCancel={() => {
          // Cancelar y limpiar preview
          clearNewProfile();
          navigate(isAdmin ? "/admin/dashboard" : "/employee/dashboard");
        }}
        showDelete={false}
        passwordRequire={false}
      />
    </Box>
  );
}
