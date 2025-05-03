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
    submitting,
    handleFieldChange,
    handleDateChange,
    handleSubmit,
    deleteEmployee,
  } = useEmployeeEdit(id);

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
        submitting={submitting}              // Mientras se está enviando, deshabilitamos el botón de enviar
        onFieldChange={handleFieldChange}   // Manejo de los cambios de texto
        onDateChange={handleDateChange}     // Manejo de los cambios de fecha
        onSubmit={handleSubmit}             // Guardar cambios
        onDelete={async () => {
          const ok = window.confirm(
            `¿Seguro que quieres borrar a ${employee.name} ${employee.lastName}? \n Esta opción no se puede deshacer.` // Mensaje de seguridad
          );
          if (!ok) return;
          await deleteEmployee(employee._id);
          notify("success", "Empleado borrado");
          navigate("/admin/employees"); // Volvemos a la tabla con los empleados
        }}
        onCancel={() => navigate("/admin/employees")} // Calcemos edición sin guardar
        showDelete={true} // Mostrar botón de borrado
        passwordRequire={false} // No exigir contraseña, permite que se modfiquen algunos campos, la contraseña no obligatoria
      />
    </Box>
  );
}
