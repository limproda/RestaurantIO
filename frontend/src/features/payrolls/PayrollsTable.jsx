import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Button,
  ButtonGroup,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toTimeES, toDateES } from "../../utils/dateUtils";

// Componente que muestra una tabla de nóminas y sus ajustes. Es reutilizable tanto para la pestaña general como para la pestaña asociada a un usuario
export default function PayrollsTable({
  payrolls = [],
  loading,
  deletePayroll,
  showEmployeeColumn = true,
  showActions = true,
  showDeleteButton = true,
}) {
  const navigate = useNavigate();

  // Recorremos los payrolls y transformamos el nombre del empleado de un "objeto" a una cadena de texto para poder usarlo en el toolbar de la tabla
  const rows = useMemo(() => {
    if (!Array.isArray(payrolls)) return [];

    return payrolls.map((p) => ({
      ...p,
      employeeName: p?.employee
        ? `${p.employee.name || ""} ${p.employee.lastName || ""}`
        : "",
    }));
  }, [payrolls]);

  // Definición de las columnas de la tabla usando useMemo para optimizar el rendimiento
  const columns = useMemo(() => {
    const cols = [];

    // Columna del empleado (opcional según la tabla)
    if (showEmployeeColumn) {
      cols.push({
        field: "employeeName", // El campo será el nuevo campo creado
        headerName: "Empleado",
        minWidth: 220,
        flex: 1,
        renderCell: (params) => {
          const fullName = params.value; // Por defecto es el string para ver si existe el nombre
          const id = params.row.employee?._id; // ID usado par ala navegación
          return fullName ? (
            <Button
              onClick={() => navigate(`/admin/employees/view/${id}`)}
              sx={{ textTransform: "none" }}
            >
              {fullName}
            </Button>
          ) : null;
        },
      });
    }

    // Columnas de mes y año
    cols.push(
      {
        field: "monthName",
        headerName: "Mes",
        width: 120,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "year",
        headerName: "Año",
        width: 120,
        headerAlign: "center",
        align: "center",
      }
    );

    // Columna de acciones (opcional)
    if (showActions) {
      cols.push({
        field: "actions",
        headerName: "Acciones",
        minWidth: showDeleteButton ? 250 : 200,
        headerAlign: "center",
        align: "center",
        sortable: false,
        flex: 1,
        // Renderiza los botones de acción para cada nómina
        renderCell: (params) => (
          <ButtonGroup variant="outlined" size="small">
            <Button
              color="success"
              onClick={() => window.open(params.row.url, "_blank")}
              aria-label="Ver PDF de la nómina"
            >
              Ver PDF
            </Button>
            {showDeleteButton && (
              <Button
                color="error"
                onClick={() => deletePayroll(params.row._id)}
                aria-label="Eliminar nómina"
              >
                Borrar
              </Button>
            )}
          </ButtonGroup>
        ),
      });
    }

    // Columna de fecha de creación
    cols.push({
      field: "createdAt",
      headerName: "Fecha de Creación",
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      flex: 1,
      // Formatea la fecha en formato español
      renderCell: ({ value }) => (value ? toDateES(new Date(value)) : ""),
    });

    return cols;
  }, [
    navigate,
    deletePayroll,
    showEmployeeColumn,
    showActions,
    showDeleteButton,
  ]);

  // Muestra un indicador de carga mientras se obtienen los datos
  if (loading) return <CircularProgress />;

  // Si no hay datos, muestra un mensaje
  if (!rows.length) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography>No hay nóminas disponibles</Typography>
      </Box>
    );
  }

  // Renderiza la tabla con todas sus funcionalidades
  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        showToolbar
        disableRowSelectionOnClick
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        pagination
        loading={loading}
        error={null}
        components={{
          NoRowsOverlay: () => (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography>No hay nóminas disponibles</Typography>
            </Box>
          ),
        }}
      />
    </Box>
  );
}
