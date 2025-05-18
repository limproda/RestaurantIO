import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "./useTransactions.jsx";
import TransactionsSummaryCards from "../../components/TransactionsSummaryCards.jsx";
import TransactionsTable from "./TransactionsTable";

// Componente principal para gestionar transacciones (ingresos y gastos)
export default function Transactions() {
  const navigate = useNavigate(); // Permite la navegación para redirigir entre rutas
  const { transactions, summary, loading, deleteTransaction } = useTransactions(); // Devuelve listado, resumen, estado de carga y función de eliminación

  return (
    <Box>
      {/*Título y botones de acción*/}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        {/* Título de la sección */}
        <Typography variant="h1" gutterBottom>
          Gestión de Transacciones
        </Typography>

        {/* Contenedor de los botones 'Añadir ingreso' y 'Añadir gasto' */}
        <Box sx={{ display: "flex", gap: "2rem" }}>
          {/* Botón para navegar a la ruta de creación de un nuevo ingreso */}
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/admin/transactions/new/income")}
          >
            Añadir Ingreso
          </Button>

          {/* Botón para navegar a la ruta de creación de un nuevo gasto */}
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate("/admin/transactions/new/expense")}
          >
            Añadir Gasto
          </Button>
        </Box>
      </Box>

      {/* Sección de tarjetas de resumen */}
      <TransactionsSummaryCards summary={summary} loading={loading} />

      {/* Tabla con el contenido */}
      <Box>
        <TransactionsTable
          transactions={transactions}
          loading={loading}
          deleteTransaction={deleteTransaction}
        />
      </Box>
    </Box>
  );
}
