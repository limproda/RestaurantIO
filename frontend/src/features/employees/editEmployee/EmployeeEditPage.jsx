import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../../components/NotificationProvider";
import { useEmployeeEdit } from "./useEmployeeEdit";
import { UserForm as EmployeeForm } from "../../../components/UserForm";
import { Typography, Box } from "@mui/material";

// Página de edición de un empleado que ya existe
export default function EmployeesEditPage() {
  const { id } = useParams(); // Obtenemos el ID y el rol
  const navigate = useNavigate(); // Para redirigir
  const { notify } = useNotification(); // Alertas personalizadas

  // Cargamos el hook
  const {
    employee,
    loading,
    error,
    newProfilePreview,           // Preview de la nueva foto de perfil si se cambia
    submitting,
    handleFieldChange,
    handleDateChange,
    handleSubmit,
    handleProfilePicChange,      // Foto de perfil
    handleCancel,                // Cancelar edición
    deleteEmployee,
  } = useEmployeeEdit(id);

  // Manejo de error de carga
  if (error) {
    notify("error", "Error cargando datos del empleado");
    navigate(-1);
    return null;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {/* Título de la página */}
      <Typography variant="h1">Editar información de empleado</Typography>

      {/* Formulario reutilizable para datos de employee */}
      <EmployeeForm
        user={employee}                     // Datos del empleado a modificar
        loading={loading}                   // Elemento de carga
        submitting={submitting}            // Mientras se está enviando, deshabilitamos el botón de enviar
        onFieldChange={handleFieldChange}   // Manejo de los cambios de texto
        onDateChange={handleDateChange}     // Manejo de los cambios de fecha
        onSubmit={handleSubmit}             // Guardar cambios
        handleProfilePicChange={handleProfilePicChange} // Foto de perfil
        newProfilePreview={newProfilePreview}           // Preview de la nueva foto
        onDelete={async () => {
          const ok = window.confirm(
            `¿Seguro que quieres borrar a ${employee.name} ${employee.lastName}? \n Esta opción no se puede deshacer.` // Mensaje de seguridad
          );
          if (!ok) return;
          await deleteEmployee(employee._id);
          notify("success", "Empleado borrado");
          navigate(-1); // Volvemos a la vista anterior
        }}
        onCancel={handleCancel} // Cancelar edición sin guardar
        showDelete={true}  // Mostrar botón de borrado
        passwordRequire={false} // No exigir contraseña, permite modificar algunos campos
      />
    </Box>
  );
}
