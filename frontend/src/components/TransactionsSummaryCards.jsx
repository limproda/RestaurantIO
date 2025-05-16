import React, { useEffect, useState } from "react";
import { Typography, CircularProgress, Box, Paper } from "@mui/material";
import { getTransactionsSummary } from "../features/transactions/transactionsApi";
import { useNotification } from "./NotificationProvider";

export default function SummaryCards() {
  const [summary, setSummary] = useState(null); // Resumen de transacciones
  const [loading, setLoading] = useState(true); // Estado para controlar el indicador de carga
  const { notify } = useNotification(); // Hook de notificaciones

  useEffect(() => {
    setLoading(true); // Activamos el spinner de carga
    getTransactionsSummary()
      .then((res) => setSummary(res.data.summary)) // Guardamos el resumen recibido
      .catch(() => notify("error", "Error cargando resumen de transacciones"))
      .finally(() => setLoading(false)); // Desactivamos el spinner de carga
  }, [notify]);

  if (loading || !summary) {
    return <CircularProgress />; // Permite mostrar el spinner de carga
  }

  // Definimos los datos que queremos mostrar en cada tarjeta
  const items = [
    { label: "Ingresos", value: summary.Income.total, suffix: "€", color: "success" },
    { label: "Gastos", value: summary.Expense.total, suffix: "€", color: "error" },
    { label: "Total", value: summary.Total.total, suffix: "€", color: summary.Total.total > 0 ? "success" : "error"},
    { label: "Operaciones", value: summary.Total.count },
  ];

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={2} mb={2}>
      {/* Recorremos los items y vamos creando los elementos */}
      {items.map(({ label, value, suffix, color }) => (
        <Paper key={label} elevation={3} sx={{ flex: "1 1 150px", minWidth: 150, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {label}
          </Typography>
          <Typography variant="h5" color={color} gutterBottom>
            {value.toLocaleString()} {suffix}
          </Typography>
          {/* Descripción fija */}
          <Typography variant="caption">Últimos 30 días</Typography>
        </Paper>
      ))}
    </Box>
  );
}
