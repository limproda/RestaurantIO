// src/features/employees/pages/EmployeeCreatePage.jsx
import React from "react";
import { useNewEmployee } from "./useNewEmployee";
import { UserForm as EmployeeForm } from "../../../components/UserForm";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";

// Página de creación de un nuevo empleado
export default function newEmployee() {
  // Importamos del hook
  const {
    employee,             // Datos iniciales del formulario
    submitting,           // Indicador para el envío de la información
    handleFieldChange,    // Handler para los inputs de texto
    handleDateChange,      // Handler para los inputs de fecha
    handleSubmit,         // Función para el envío
  } = useNewEmployee();

  const navigate = useNavigate(); // Permitimos la navegación

  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      <Typography variant="h1">Añadir nuevo empleado</Typography>
      <EmployeeForm
        user={employee}                                   // Datos para el formulario
        loading={false}                                   // No hay carga inicial, siempre tenemos objeto
        submitting={submitting}                           // Deshabilitamos el botón de enviar mientras carga
        onFieldChange={handleFieldChange}                  // Para manejar el cambio de inputs
        onDateChange={handleDateChange}                   // Para manejar el cambio de dates
        onSubmit={handleSubmit}                            // Para enviar
        onCancel={() => navigate("/admin/employees")}       // Para navegar si se cancela
        showDelete={false}                                 // El botón de borrar no se muestra
        passwordRequire={true}                             // Contraseña obligatoria
      />  
    </Box>
  );
}
