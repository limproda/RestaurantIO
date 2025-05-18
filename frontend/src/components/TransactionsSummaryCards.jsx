// TransactionsSummaryCards.jsx
import React from "react";
import { Typography, Box, Paper, CircularProgress } from "@mui/material";

export default function TransactionsSummaryCards({ summary, loading }) {
  if (loading || !summary) {
    return <CircularProgress />;
  }

  const items = [
    { label: "Ingresos",      value: summary.Income.total,  suffix: "€", color: "success" },
    { label: "Gastos",        value: summary.Expense.total, suffix: "€", color: "error"   },
    { label: "Total",         value: summary.Total.total,   suffix: "€", color: summary.Total.total > 0 ? "success" : "error" },
    { label: "Operaciones",   value: summary.Total.count                          },
  ];

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={2} mb={2}>
      {items.map(({ label, value, suffix, color }) => (
        <Paper key={label} elevation={3} sx={{ flex: "1 1 150px", minWidth: 150, p: 2 }}>
          <Typography variant="h6" gutterBottom>{label}</Typography>
          <Typography variant="h5" color={color} gutterBottom>
            {value.toLocaleString()} {suffix}
          </Typography>
          <Typography variant="caption">Últimos 30 días</Typography>
        </Paper>
      ))}
    </Box>
  );
}
