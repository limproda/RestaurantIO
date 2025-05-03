import React from "react";
import { useParams } from "react-router-dom";
import IncomeForm from "./IncomeForm";
import { Typography, Box } from "@mui/material";

export default function Income() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Devuelve el elemento de ingresos
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h1" gutterBottom>
        {isEditing ? "Edita un ingreso" : "Añade un ingreso"} {/* Devuelve un texto u otro en base a si es una edición o no */}
      </Typography>
      <IncomeForm />
    </Box>
  );
}
