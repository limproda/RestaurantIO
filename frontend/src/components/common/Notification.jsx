import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Componente Notificacion para mostrar mensajes emergentes
const Notification = ({ open, severity, message, onClose }) => {
  return (
    // Snackbar de MUI que se usa para mostrar el mensaje en pantalla
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}>
      {/* Componente de Alerta de MUI según severidad */}
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message} {/* Muestra el mensaje pasado al componente */}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
