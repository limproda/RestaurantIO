import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { useNotification } from "../../components/NotificationProvider";
import { useEmployees } from "../employees/useEmployees";
import { usePayrolls } from "./usePayrolls";

// Componente para subir nóminas de empleados
export default function PayrollUpload({ onUploadSuccess }) {
  // Estados para manejar el formulario
  const [file, setFile] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // Hooks para notificaciones, empleados y nóminas
  const { notify } = useNotification();
  const { employees, loading: loadingEmployees } = useEmployees();
  const { uploadPayroll, uploading } = usePayrolls();

  // ref al input para poder vaciarlo
  const fileInputRef = useRef(null);

  const minYear = 1950;
  const maxYear = 2100;

  // Obtener los nombres de los meses en español
  const months = Array.from({ length: 12 }, (_, i) => {
    return new Intl.DateTimeFormat("es-ES", { month: "long" })
      .format(new Date(2000, i, 1))
      .replace(/^\w/, (c) => c.toUpperCase()); // Capitalizar primera letra
  });

  // Maneja el cambio de archivo, validando que sea en formato PDF
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      notify("error", "Por favor, selecciona un archivo PDF");
    }
  };

  // Maneja la subida de la nómina
  const handleUpload = async () => {
    if (!file) {
      notify("error", "Por favor, selecciona un archivo primero"); // Si no hay archivo, mostramos mensaje de error
      return;
    }

    if (!selectedUser) {
      notify("error", "Por favor, selecciona un empleado"); // Si no hay empleado, mostramos mensaje de error
      return;
    }

    if (year < minYear || year > maxYear) {
      notify("error", `Año inválido. Debe estar entre ${minYear} y ${maxYear}`);
      return;
    }
    // Subimos la nómina
    const success = await uploadPayroll({
      file,
      userId: selectedUser,
      month,
      year,
    });

    if (success) {
      setFile(null); // Limpiamos el archivo
      setSelectedUser(""); // Limpiamos el empleado
    }
    if (fileInputRef.current) fileInputRef.current.value = ""; // Para vaciar el input y que onChange vuelva a funcionar
    if (onUploadSuccess) onUploadSuccess(); // Avisamos al elemento padre de recargar los componentes
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      {/* Sección de subida de nóminas */}
      <Typography variant="h2" gutterBottom sx={{ textAlign: "center" }}>
        Subir Nómina
      </Typography>

      <Stack spacing={3}>
        {/* Selector desplegable de empleado */}
        <FormControl fullWidth required>
          <InputLabel>Empleado</InputLabel>
          <Select
            value={selectedUser} // Valor seleccionado
            label="Empleado" // Etiqueta del selector
            onChange={(e) => setSelectedUser(e.target.value)} // Cambiamos el valor seleccionado
            disabled={loadingEmployees} // Deshabilitamos el selector si está cargando
          >
            {employees?.map(
              (
                employee // Recorremos el array de empleados
              ) => (
                <MenuItem key={employee._id} value={employee._id}>
                  {employee.name} {employee.lastName}{" "}
                  {/* Mostramos el nombre y apellido del empleado */}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        {/* Selector de mes */}
        <FormControl fullWidth required error={!month}>
          <InputLabel>Mes</InputLabel>
          <Select
            value={month}
            label="Mes"
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {months.map(
              (
                monthName,
                index // Recorremos el array de meses
              ) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {monthName} {/* Mostramos el nombre del mes */}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        {/* Campo de año */}
        <TextField
          label="Año"
          type="number"
          required
          value={year}
          error={!year || year < minYear || year > maxYear} // Si year no está seleccionado, mostramos error
          slotProps={{
            input: {
              min: minYear,
              max: maxYear,
            },
          }}
          onChange={(e) => setYear(Number(e.target.value))} // Cambiamos el valor del año al año seleccionado
          fullWidth
        />
        {/* Botón para seleccionar archivo PDF */}
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadIcon />}
          disabled={uploading}
        >
          Seleccionar PDF
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".pdf"
            onChange={handleFileChange}
          />{" "}
          {/* Campo oculto para seleccionar archivo PDF */}
        </Button>
        {file && <Typography>Archivo seleccionado: {file.name}</Typography>}{" "}
        {/* Mostramos el nombre del archivo una vez seleccionado */}
        {/* Botón para subir la nómina */}
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || !selectedUser || uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : null}
        >
          {uploading ? "Subiendo..." : "Subir Nómina"}
        </Button>
        <Alert severity="info">Solo se permiten archivos en formato PDF</Alert>
      </Stack>
    </Box>
  );
}
