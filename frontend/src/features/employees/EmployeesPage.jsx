import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmployeesTable from "./employeesTable";

// Página de gestión de empleados
export default function Employees() {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* Título */}
        <Typography variant="h1" gutterBottom>Gestión de Empleados</Typography>
        {/* Botón de añadir empleado */}
        <Button
          variant="contained"
          onClick={() => navigate("/admin/employees/new")}
        >
          Añadir Empleado
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Tabla con los empleados */}
        <EmployeesTable />
      </Box>
    </Box>
  );
}
