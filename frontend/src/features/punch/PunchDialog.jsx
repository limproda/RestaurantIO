import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { usePunch } from "./usePunch";
import { toLocalSpain, toInputDateTimeValue } from "../../utils/dateUtils";

export default function PunchDialog({
  open, // Determina si está visible o no
  mode = "clock", // Modo del diálogo para decidir qué renderizar: Clock, Add, Edit, Delete
  onClose, // Se usa para cambiar de open a close
  onUpdated, // Se usa para notificar al componente padre de que ha habido un cambio
  employeeId, // ID del empleado
  row = {}, // Datos de la fila asociada en edit/delete
}) {
  const { loading, submit } = usePunch();
  // Inicializamos el miniformulario con el tipo y fecha del puncheo
  const [form, setForm] = useState({
    type: "entrada",
    timestamp: toInputDateTimeValue(new Date()),
  });
  // Ayuda a indicar un texto u otro en base al modo
  const titles = {
    clock: "¿Registrar turno?",
    add: "Añadir fichaje",
    edit: "Editar fichaje",
    delete: "Borrar fichaje",
  };

  // Pre‑cargamos valores al entrar en el modo de edición
  useEffect(() => {
    if (mode !== "edit" || !row) return; // Si no es el modo edición o si no hay datos en la columna, no se ejecuta

    // Ponemos la información por defecto en el formulario de edición
    setForm({
      type: "entrada",
      timestamp: row.entryTime
        ? toInputDateTimeValue(new Date(row.entryTime))
        : "",
    });
  }, [mode, row]);

  // Escoge lo que se va a ejecutar en base al modo en el que estemos
  const handleConfirm = async () => {
    await submit({ mode, employeeId, form, row });
    if (onUpdated) onUpdated();
    onClose();
  };

  // Definimos todos los textos en base al modo en el que estemos
  const showForm = () => {
    // Si estamos en el modo edición, mostramos el texto
    if (mode === "clock")
      return (
        <Typography sx={{ p: 2 }}>
          ¿Quieres registrar tu turno ahora?
        </Typography>
      );

      // Si estamos en modo borrado, mostramos los campos con los selectores de tipo
    if (mode === "delete")
      return (
        <>
          <TextField
            select
            fullWidth
            label="Tipo"
            value={form.type} // Indicamos el tipo del form 
            onChange={(e) => setForm({ ...form, type: e.target.value })} // Setter para el tipo del form
            sx={{ mb: 2 }} 
          >
            <MenuItem value="entrada">Entrada</MenuItem>
            <MenuItem value="salida">Salida</MenuItem>
          </TextField>
          <Typography>¿Seguro que deseas borrar este fichaje? No se puede deshacer</Typography>
        </>
      );

    // Si no es modo fichar, ni borrar, entonces debe ser añadir o editar
    return (
      <>
        <TextField
          select
          fullWidth
          label="Tipo"
          value={form.type}
          onChange={(e) => {
            const newType = e.target.value;
            let newTimestamp = form.timestamp;

            // Si el modo es el de edición, debemos escoger qué modificar
            if (mode === "edit") {
              const timestamp = newType === "entrada" ? row.entryTime : row.exitTime; // Asignamos la hora que ya había guardada
              newTimestamp = timestamp ? toInputDateTimeValue(new Date(timestamp)) : "";
            }

            setForm({ type: newType, timestamp: newTimestamp }); // Setter para el formulario
          }}
          sx={{ mb: 2 }}
        >
          <MenuItem value="entrada">Entrada</MenuItem>
          <MenuItem value="salida">Salida</MenuItem>
        </TextField>
        <TextField
          type="datetime-local"
          fullWidth
          label="Fecha y hora"
          value={form.timestamp}
          onChange={(e) => setForm({ ...form, timestamp: e.target.value })}
        />
      </>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth> {/* Mostramos el dialogo */}
      <DialogTitle>{titles[mode]}</DialogTitle>                 {/* Titúlo del dialogo */}
      {mode !== "clock" && <DialogContent>{showForm()}</DialogContent>} {/* Mostramos el formulario si es diferente a fichar*/}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleConfirm}
          color={mode === "delete" ? "error" : "primary"}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Aceptar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
