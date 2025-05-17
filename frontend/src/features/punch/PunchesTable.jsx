import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  ButtonGroup,
} from "@mui/material";
import { getPunchesByEmployee } from "./punchApi";
import { toTimeES, toDateES } from "../../utils/dateUtils";

  // Columnas base que se muestran tanto para empleados como administradores
  const columns = [
    { field: "date", headerName: "Fecha", flex: 1, align: "center", headerAlign: "center" },
    { field: "entry", headerName: "Entrada", width: 120, align: "center", headerAlign: "center" },
    { field: "exit", headerName: "Salida", width: 120, align: "center", headerAlign: "center" },
    { field: "worked", headerName: "Horas Trabajadas", flex: 1, align: "center", headerAlign: "center" },
  ];

export default function PunchesTable({ employeeId, isAdmin = false, onManage, refreshKey = 0 }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRows = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const data = await getPunchesByEmployee(employeeId);
      if (!data.success) throw new Error(data.message);
      // Recorremos la información recibida y creamos las filas formateadas
      setRows(
        data.shifts.map((s) => ({
          ...s,
          id: s.id,
          date: toDateES(new Date(s.date)),
          entry: s.entryTime ? toTimeES(new Date(s.entryTime)) : "—",
          exit: s.exitTime ? toTimeES(new Date(s.exitTime)) : "—",
          worked: s.duration || "—",

        }))
      );
    } catch (err) {
      setError(err.message || "Error al cargar los fichajes."); // Mensaje en caso de error
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    getRows();
  }, [getRows, refreshKey]);

  // Columna extra de modificaciones para el administrador
  const adminColumns = isAdmin
    ? [
        ...columns,
        {
          field: "actions",
          headerName: "Acciones",
          width: 200,
          headerAlign: "center",
          align: "center",
          sortable: false,
          renderCell: (params) => (
            <ButtonGroup direction="row" spacing={1}>
              <Button size="small" variant="outlined" onClick={() => onManage("edit", params.row)}>
                Editar
              </Button>
              <Button size="small" color="error" variant="outlined" onClick={() => onManage("delete", params.row)}>
                Borrar
              </Button>
            </ButtonGroup>
          ),
        },
      ]
    : columns; // Si el usuario no es admin, las columnas se mantienen

  if (loading) return <CircularProgress />;

  return (
    <>
      {isAdmin && (
        <Button variant="contained" sx={{ mb: 2 }} onClick={() => onManage("add")}>Añadir Fichaje Manual</Button> // Botón de añadir fichae de manera manual
      )}
      <Box sx={{ minHeight: 300, width: "100%" }}>
        <DataGrid rows={rows} columns={adminColumns} disableRowSelectionOnClick showToolbar getRowId={(r) => r.id} />
      </Box>
    </>
  );
}