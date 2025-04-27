import React from "react";
import { useNavigate } from "react-router-dom"; 
import { UserForm } from "../../components/UserForm";
import { useUserProfile } from "./useUserProfile";
import { Typography, Box } from "@mui/material";

// Página de ajustes de perfil de usuario
export default function UserProfile() {  
  const navigate = useNavigate(); 
  const {
    profile,            // Datos del usuario
    loading,            // Indicador de carga
    submitting,         // Indicador de envío
    handleFieldChange,   // Actualizar campos de texto
    handleDateChange,   // Actualizar fechas 
    handleSubmit,        // Envío de formulario
  } = useUserProfile(); 

  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
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
        onCancel={() => navigate("/admin/dashboard")}
        showDelete={false}
        passwordRequire={false}
      />
    </Box>
  );
}
