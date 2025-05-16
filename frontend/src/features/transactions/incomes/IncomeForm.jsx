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
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  PickersTextField,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom";
import { incomeCategories } from "../../../../../backend/Models/IncomeModel";
import useIncomes from "./useIncomes";

export default function IncomeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    income,
    loading,
    submitting,
    handleFieldChange,
    handleDateChange,
    handleSubmit,
    handleDelete,
  } = useIncomes();

  // Spinner mientras carga el income
  if (loading || !income) {
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
            value={income.amount}
            onChange={handleFieldChange}
          />
        </Grid>

        {/* Fecha */}
        <Grid size={{ xs: 12, md: 6 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha"
              value={income.date ? dayjs(income.date) : null}
              onChange={handleDateChange("date")}
              slots={{ textField: PickersTextField }}
              slotProps={{ textField: { fullWidth: true, required: true } }}
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
            value={income.concept}
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
            value={income.description || ""}
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
            value={income.category}
            onChange={handleFieldChange}
          >
            {Object.entries(incomeCategories).map(([key, description]) => (
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
            value={income.reference}
            onChange={handleFieldChange}
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
