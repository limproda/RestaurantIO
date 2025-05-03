import React from "react";
import { Typography, CircularProgress, Box, Paper } from "@mui/material";

export default function SummaryCards({ summary, loading }) {

  // Mientras carga el hook o no hay summary, indicamos con un icono de carga
  if (loading || !summary) {
    return <CircularProgress />;
  }

  // Creamos el array de items
  const items = [
    { label: "Ingresos", value: summary.Income.total, suffix: "€" }, // Elemento de ingresos
    { label: "Gastos", value: summary.Expense.total, suffix: "€" }, // Elemento de gastos
    { label: "Total", value: summary.Total.total, suffix: "€" }, // Elemento de totales
    { label: "Operaciones",value: summary.Total.count }, // Elemento de número de operaciones
  ];

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={2} mb={2}>
      {items.map(({ label, value, suffix }) => (
        <Paper key={label} elevation={3} sx={{ flex: "1 1 150px", minWidth: 150, p: 2 }}> {/* Adaptamos los elementos al tamaño de pantalla*/}
          <Typography variant="h6" gutterBottom>
            {label}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {value.toLocaleString()} {suffix} {/* Añadimos el sufijo y añadimos la puntuación de los números*/}
          </Typography>
          <Typography variant="caption">Últimos 30 días</Typography>
        </Paper>
      ))}
    </Box>
  );
}