import React, { useEffect, useState } from "react";
import { Typography, CircularProgress, Box, Paper } from "@mui/material";
import { getEmployeeSummary } from "../features/workingTime/workingTimeApi";
import { useNotification } from "./NotificationProvider";

export default function SummaryCards() {
  const [summary, setSummary] = useState(null); // Resumen de horas trabajadas
  const [loading, setLoading] = useState(true); // Estado para controlar el indicador de carga
  const { notify } = useNotification(); // Hook de notificaciones

  useEffect(() => {
    setLoading(true); // Activamos el spinner de carga
    getEmployeeSummary()
      .then((res) => setSummary(res.data.summary)) // Guardamos el resumen recibido
      .catch(() =>
        notify("error", "Error cargando resumen de horas trabajadas")
      )
      .finally(() => setLoading(false)); // Desactivamos el spinner de carga
  }, [notify]);

  if (loading || !summary) {
    return <CircularProgress />; // Permite mostrar el spinner de carga
  }

  // Definimos los datos que queremos mostrar en cada tarjeta
  const items = [
    {
      label: "Horas totales trabajadas",
      value: summary.WorkedHours.total,
      suffix: "h",
      color: "success",
    },
    {
      label: "Horas extras",
      value: summary.Overtime.total,
      suffix: "h",
      color: "error",
    },
    {
      label: "Quedan",
      value: summary.Total.total,
      suffix: "días",
      color: "primary",
    },
  ];

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
      gap={2}
      mb={2}
    >
      {/* Recorremos los items y vamos creando los elementos */}
      {items.map(({ label, value, suffix, color }, idx) => (
        <Paper
          key={label}
          elevation={3}
          sx={{ flex: "1 1 150px", minWidth: 150, p: 2 }}
        >
          <Typography variant="h6" gutterBottom>
            {label}
          </Typography>
          <Typography variant="h5" color={color} gutterBottom>
            {value.toLocaleString()} {suffix}
          </Typography>
          {/* Adaptamos la descripción según el índice del elemento */}
          {idx !== items.length - 1 ? (
            <Typography variant="caption">En el mes actual</Typography>
          ) : (
            <Typography variant="caption">Para el siguiente sueldo</Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
}
