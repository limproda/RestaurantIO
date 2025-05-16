import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Button,
  Avatar,
  ButtonGroup,
} from "@mui/material";
import { useEmployees } from "./useEmployees";
import { useNotification } from "../../components/NotificationProvider.jsx";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";

// Tabla de empleados con opciones de modificar y eliminar
export default function EmployeesTable() {
  const { employees, loading, error, deleteEmployee } = useEmployees();
  const navigate = useNavigate();
  const { notify } = useNotification();

  // Efecto para mostrar notificación si hay error cargando
  useEffect(() => {
    if (error) notify("Error", "Error cargando empleados");
  }, [error, notify]);

  const columns = [
    // { field: "id", headerName: "ID", width: 200},
    // Columna con el avatar de la foto de perfil o el icono de persona
    {
      field: "profilePictureUrl",
      headerName: "Foto",
      width: 80,
      sortable: false,
      headerAlign: "center", // centra el encabezado
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center", // Centrado vertical
            justifyContent: "center", // Centrado horizontal
            height: "100%",
          }}
        >
          {params.value ? <Avatar src={params.value} /> : <PersonIcon />}
        </Box>
      ),
    },
    { field: "name", headerName: "Nombre", width: 120 },
    { field: "lastName", headerName: "Apellidos", width: 180 },
    { field: "email", headerName: "Correo", flex: 1, minWidth: 230 },
    { field: "phone", headerName: "Teléfono", width: 150 },
    // Columnas con las acciones de modificar y borrar
    {
      field: "actions",
      headerName: "Acciones",
      headerAlign: "center",
      align: "center",
      width: 250,
      sortable: false,
      renderCell: (params) => (
        <ButtonGroup variant="outlined" size="small">
          {/* Opción de Ver */}
          <Button
            size="small"
            variant="outlined"
            color="success"
            onClick={() => navigate(`/admin/employees/view/${params.row._id}`)} // Navega a la página de edición de empleado
          >
            Ver
          </Button>
          {/* Opción de Modificar */}
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate(`/admin/employees/edit/${params.row._id}`)} // Navega a la página de edición de empleado
          >
            Modificar
          </Button>
          {/* Opción de Borrar */}
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={async () => {
              const ok = window.confirm(
                `¿Seguro que quieres borrar a ${params.row.name} ${params.row.lastName}? \n Esta opción no se puede deshacer.`
              );
              if (!ok) return;
              await deleteEmployee(params.row._id); // Elimina el empleado
            }}
          >
            Borrar
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  if (loading) return <CircularProgress />; // Icono de carga

  return (
    <Box>
      <DataGrid
        rows={employees}
        columns={columns}
        getRowId={(row) => row._id} // Clave primaria
        showToolbar
        disableRowSelectionOnClick
      />
    </Box>
  );
}
