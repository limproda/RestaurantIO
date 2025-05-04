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
import { useTransactions } from "./useTransactions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function TransactionsTable({
  transactions,
  loading,
  deleteTransaction,
}) {
  const navigate = useNavigate(); // Permite navegar entre ventanas

  // Hacemos que React guarde la respuesta obtenida
  const columns = useMemo(
    () => [
      { field: "formattedDate", headerName: "Fecha", width: 120 }, // Columna de la fecha
      { field: "concept", headerName: "Concepto", flex: 1, minWidth: 150 }, // Columna de concepto
      { field: "categoryCapitalized", headerName: "Categoría", width: 150 }, // Columna de categoría
      { field: "type", headerName: "Tipo", width: 100 }, // Columna de tipo
      /* Columna de importe */
      {
        field: "amount",
        headerName: "Importe",
        width: 150,
        sortable: false,
        renderCell: ({ value, row: { type } }) => {
          const isExpense = type.toLowerCase() === "gasto";
          const abs = Math.abs(value).toFixed(2);
          return (
            <Typography color={isExpense ? "error" : "success"}>
              {isExpense ? "-" : ""}
              {abs} €
            </Typography>
          );
        },
      },
      /* Columna de Acciones */
      {
        field: "actions",
        headerName: "Acciones",
        headerAlign: "center",
        align: "center",
        width: 200,
        sortable: false,
        renderCell: (params) => (
          <ButtonGroup variant="outlined" size="small">
            {/* Botón de Ver */}
            <Button
              color="success"
              onClick={() =>
                params.row.type === "ingreso"
                  ? navigate(
                    `/admin/transactions/income/view/${params.row._id}`
                  )
                  : navigate(
                    `/admin/transactions/expense/view/${params.row._id}`
                  )
              }
            >
              Ver
            </Button>
            {/* Botón de Modificar */}
            <Button
              onClick={() =>
                params.row.type === "ingreso"
                  ? navigate(
                    `/admin/transactions/income/edit/${params.row._id}`
                  )
                  : navigate(
                    `/admin/transactions/expense/edit/${params.row._id}`
                  )
              }
            >
              Modificar
            </Button>
            {/* Botón de Borrar */}
            <Button
              color="error"
              onClick={async () => {
                const ok = window.confirm(
                  "¿Seguro que quieres borrar la transacción? \n Esta operación no se puede deshacer."
                );
                if (!ok) return;
                deleteTransaction(params.row._id, params.row.type);
              }}
            >
              Borrar
            </Button>
          </ButtonGroup>
        ),
      },
      {
        field: "deductible",
        headerName: "Deducible",
        width: 100,
        sortable: false,
        headerAlign: "center",
        align: "center",
        renderCell: ({ value, row: { type } }) => {
          if (type.toLowerCase() !== "gasto") return null; // Solo mostramos algo si es un gasto
          // Si es gasto, mostramos check o cruz según el valor booleano de deducible
          return value ? (
            <CheckCircleIcon sx={{ color: "success.main" }} />
          ) : (
            <CancelIcon sx={{ color: "error.main" }} />
          );
        },
      },
    ],
    [navigate]
  );

  // Mientras carga, indicamos con un spinner circular
  if (loading) return <CircularProgress />;

  // Devolvemos la tabla
  return (
    <Box>
      <DataGrid
        rows={transactions}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={50}
        showToolbar
        getRowClassName={
          ({ row }) =>
            row.type.toLowerCase() === "gasto" ? "row-gasto" : "row-ingreso" // Añadimos la clase según si es gasto o ingreso
        }
        sx={{
          "& .row-ingreso": { bgcolor: (theme) => theme.palette.success.light }, // Para los ingresos, color verde suave
          "& .row-gasto": { bgcolor: (theme) => theme.palette.error.light }, // Para los gastos, color rojo suave
          "& .MuiDataGrid-cell": {
            // Centramos el contenido de las celdas
            display: "flex",
            alignItems: "center",
          },
        }}
      />
    </Box>
  );
}
