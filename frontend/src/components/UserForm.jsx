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

export function UserForm({
  user,                       // Datos del usuario a mostrar
  loading,                    // Indicador de carga
  submitting,                 // Indicador de envío
  onFieldChange,              // Handler para inputs de texto
  handleProfilePicChange,     // Handler para la foto de perfil
  newProfilePreview,          // Preview de la nueva foto seleccionada antes de ser guardada
  onDateChange,               // Handler para DatePicker
  onSubmit,                   // Handler de submit
  onDelete,                   // Función opcional de borrado
  onCancel,                   // Función opcional de cancelación
  showDelete = false,         // Muestra el botón de borrar
  passwordRequire,            // Indica si la contraseña es obligatoria
  readOnly = false,           // Indica si el formulario es de solo lectura
}) {
  if (loading || !user) {
    return <CircularProgress />;
  }

  const isAdmin = user.role?.toLowerCase() === "administrador";

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ p: 3, maxWidth: 600, mx: "auto" }}
    >
      <Grid container spacing={2}>
        {/* Avatar */}
        <Grid size={12} container justifyContent="center">
          {/* mostrar preview si existe, si no la URL, si no icono */}
          {newProfilePreview ? (
            <Avatar
              src={newProfilePreview}
              sx={{ width: 250, height: 250 }}
            />
          ) : user.profilePictureUrl ? (
            <Avatar
              src={user.profilePictureUrl}
              sx={{ width: 250, height: 250 }}
            />
          ) : (
            <PersonIcon sx={{ fontSize: 250 }} />
          )}

          {/* Input oculto usado para subir el fichero de la foto */}
          <input
            id="profile-picture-input"
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            style={{ display: "none" }}
            onChange={handleProfilePicChange}
            disabled={readOnly || submitting}
          />
          <label
            htmlFor="profile-picture-input"
            style={{ width: "100%", textAlign: "center", marginTop: 8 }}
          >
            <Button component="span" disabled={readOnly || submitting} sx={{ mb: "1rem"}}>
              {submitting ? "Subiendo..." : "Cambiar foto"}
            </Button>
          </label>
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
            disabled={readOnly}
          />
          <PasswordField
            name="password"
            label="Contraseña"
            placeholder="Escribe tu contraseña nueva"
            value={user.password ?? ""}
            required={passwordRequire}
            onChange={onFieldChange}
            disabled={readOnly}
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
            disabled={readOnly}
          />
          <PasswordField
            name="confirmPassword"
            label="Repetir contraseña"
            placeholder="Repite la contraseña"
            value={user.confirmPassword ?? ""}
            required={passwordRequire}
            onChange={onFieldChange}
            disabled={readOnly}
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
            disabled={readOnly}
          />
        </Grid>

        {/* Teléfono */}
        <Grid container spacing={2} size={{ xs: 12, md: 6 }}>
          <TextField
            label="Teléfono"
            name="phone"
            type="tel"
            required
            placeholder="Sólo dígitos"
            value={user.phone ?? ""}
            onChange={onFieldChange}
            fullWidth
            disabled={readOnly}
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
              disabled={readOnly}
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
            disabled={submitting || readOnly}
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}