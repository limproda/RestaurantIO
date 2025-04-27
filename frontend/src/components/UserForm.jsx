import React from "react";
import dayjs from "dayjs";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Grid,
  Avatar,
  Stack,
} from "@mui/material";
import {
  PickersTextField,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PersonIcon from "@mui/icons-material/Person";
import { PasswordField } from "./PasswordField";
import { useRole } from "../features/role/useRole.js";

export function UserForm({
  user,                 // datos del usuario a mostrar
  loading,              // indicador de carga
  submitting,           // indicador de envío
  onFieldChange,        // handler para inputs de texto
  onDateChange,         // handler para DatePicker
  onSubmit,             // handler de submit
  onDelete,             // función opcional de borrado
  onCancel,             // función opcional de cancelación
  showDelete = false,  // muestra botón borrar
  passwordRequire,      // indica si la contraseña es obligatoria
}) {
  if (loading || !user) {
    return <CircularProgress />;
  }

  const { isAdmin } = useRole();

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ p: 3, maxWidth: 600, mx: "auto" }}
    >
      <Grid container spacing={2}>
        {/* Avatar */}
        <Grid size={12} container justifyContent="center">
          {user.profilePictureUrl ? (
            <Avatar
              src={user.profilePictureUrl}
              sx={{ width: 250, height: 250 }}
            />
          ) : (
            <PersonIcon sx={{ fontSize: 250 }} />
          )}
        </Grid>

        {/* Nombre */}
        <Grid container spacing={2} size={{ xs: 12, md: 6 }}>
          <TextField
            label="Nombre"
            name="name"
            required
            value={user.name ?? ""}
            onChange={onFieldChange}
            fullWidth
          />
          <PasswordField
            name="password"
            label="Contraseña"
            placeholder="Escribe tu contraseña nueva"
            value={user.password ?? ""}
            required={passwordRequire}
            onChange={onFieldChange}
          />
        </Grid>

        {/* Apellidos */}
        <Grid container spacing={2} size={{ xs: 12, md: 6 }}>
          <TextField
            label="Apellidos"
            name="lastName"
            required
            value={user.lastName ?? ""}
            onChange={onFieldChange}
            fullWidth
          />
          <PasswordField
            name="confirmPassword"
            label="Repetir contraseña"
            placeholder="Repite la contraseña"
            value={user.confirmPassword ?? ""}
            required={passwordRequire}
            onChange={onFieldChange}
          />
        </Grid>

        {/* Correo */}
        <Grid size={12}>
          <TextField
            label="Correo"
            name="email"
            type="email"
            required
            value={user.email ?? ""}
            onChange={onFieldChange}
            fullWidth
          />
        </Grid>

        {/* Teléfono */}
        <Grid container spacing={2} size={{ xs: 12, md: 6 }}>
          <TextField
            label="Teléfono"
            name="phone"
            type="tel"
            placeholder="Sólo dígitos"
            value={user.phone ?? ""}
            onChange={onFieldChange}
            fullWidth
          />
          {/* Fecha de contratación - UNICAMENTE PARA ROL DE EMPLEADO */}
          {!isAdmin && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de contratación"
                value={user.hireDate ? dayjs(user.hireDate) : null}
                format="DD/MM/YYYY"
                onChange={onDateChange("hireDate")}
                slots={{ textField: PickersTextField }}
                slotProps={{
                  textField: { fullWidth: true },
                  field: { readOnly: true },
                }}
              />
            </LocalizationProvider>
          )}
        </Grid>
        <Grid container spacing={2} size={{ xs: 12, md: 6 }}>
          {/* Fecha de nacimiento */}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de nacimiento"
              value={user.bornDate ? dayjs(user.bornDate) : null}
              format="DD/MM/YYYY"
              onChange={onDateChange("bornDate")}
              slots={{ textField: PickersTextField }}
              slotProps={{
                textField: { fullWidth: true },
                field: { readOnly: true },
              }}
            />
          </LocalizationProvider>

          {/* Día de cobro - UNICAMENTE PARA ROL DE EMPLEADO */}
          {!isAdmin && (
            <TextField
              label="Día de cobro"
              name="paymentDay"
              type="number"
              required
              value={user.paymentDay ?? ""}
              onChange={onFieldChange}
              fullWidth
              inputProps={{ min: 1, max: 31 }}
            />
          )}
        </Grid>

        {/* Botones de acción */}
        <Grid size={12}>
          <Stack direction="row" spacing={2}>
            {onCancel && (
              <Button variant="outlined" fullWidth onClick={onCancel}>
                Cancelar
              </Button>
            )}
            {showDelete && onDelete && (
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={onDelete}
              >
                Borrar
              </Button>
            )}
          </Stack>
        </Grid>
        <Grid size={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={submitting}
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
