import React from "react";
import { useParams } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import { Typography, Box } from "@mui/material";

export default function Income() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  // Devuelve el elemento de gastos
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h1" gutterBottom>
        {isEditing ? "Editar gasto" : "Añade un gasto"} {/* Devuelve un texto u otro en base a si es una edición o no */}
      </Typography>
      <ExpenseForm />
    </Box>
  );
}
