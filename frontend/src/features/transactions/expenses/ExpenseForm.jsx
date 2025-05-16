import React from "react";
import dayjs from "dayjs";
import {
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  PickersTextField,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom";
import { expenseCategories } from "../../../../../backend/Models/ExpenseModel";
import useExpenses from "./useExpenses";

export default function ExpenseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    expense,
    loading,
    submitting,
    handleFieldChange,
    handleDateChange,
    handleSubmit,
    handleDelete,
  } = useExpenses();

  // Spinner de carga mientras carga el expense
  if (loading || !expense) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3, maxWidth: 600, mx: "auto" }}
    >
      <Grid container spacing={2}>
        {/* Importe */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Importe"
            name="amount"
            type="number"
            required
            fullWidth
            value={expense.amount}
            onChange={handleFieldChange}
          />
        </Grid>

        {/* Fecha */}
        <Grid size={{ xs: 12, md: 6 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha"
              value={expense.date ? dayjs(expense.date) : null}
              onChange={handleDateChange("date")}
              slots={{ textField: PickersTextField }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Concepto */}
        <Grid size={12}>
          <TextField
            label="Concepto"
            name="concept"
            required
            fullWidth
            value={expense.concept}
            onChange={handleFieldChange}
          />
        </Grid>

        {/* Descripción */}
        <Grid size={12}>
          <TextField
            label="Descripción"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={expense.description || ""}
            onChange={handleFieldChange}
          />
        </Grid>

        {/* Categoría */}
        <Grid size={12}>
          <TextField
            select
            label="Categoría"
            name="category"
            required
            fullWidth
            value={expense.category}
            onChange={handleFieldChange}
          >
            {Object.entries(expenseCategories).map(([key, description]) => (
              <MenuItem key={key} value={key}>
                <Tooltip
                  title={description}
                  arrow
                  placement="right"
                  disableInteractive
                >
                  {/* Hacemos que este span llene todo el MenuItem */}
                  <Box
                    component="span"
                    sx={{ display: "block", width: "100%", height: "100%" }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                  </Box>
                </Tooltip>
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Referencia */}
        <Grid size={12}>
          <TextField
            label="Referencia"
            name="reference"
            required
            fullWidth
            value={expense.reference}
            onChange={handleFieldChange}
          />
        </Grid>
        {/* Proveedor */}
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            label="Proveedor"
            name="supplier"
            fullWidth
            value={expense.supplier || ""}
            onChange={handleFieldChange}
          />
        </Grid>

        {/* Deducible */}
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(expense.deductible)}
                onChange={(e) =>
                  handleFieldChange({
                    target: { name: "deductible", value: e.target.checked },
                  })
                }
                name="deductible"
              />
            }
            label="¿Deducible?"
          />
        </Grid>

        {/* Botones de acción */}
        <Grid size={12}>
          <Stack direction="row" spacing={2}>
            {/* Botón de cancelar */}
            <Button variant="outlined" fullWidth onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            {/* Botón de eliminar */}
            {id && (
              <Grid size={12}>
                <Box>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={handleDelete}
                    disabled={submitting}
                  >
                    Eliminar
                  </Button>
                </Box>
              </Grid>
            )}
          </Stack>
        </Grid>
        <Grid size={12}>
          {/* Botón de actualizar/crear */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={submitting}
          >
            {id ? "Actualizar" : "Crear"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
