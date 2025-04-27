import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext(); // Creamos el contexto para las notificaciones

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    open: false,
    severity: "info", // "error" | "warning" | "info" | "success"
    message: "",
  });

  // Se usa para mostrar la notificación
  const notify = useCallback((severity = "info", message) => {
    setNotification({ open: true, severity, message });
  }, []);

  // Permite cerrar la notificación
  const handleClose = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  // Evita que se renderice el provider, esto permite que los hijos no se actualicen después de cada actualización del estado
  const contextValue = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

// 3. Hook para consumir el contexto
export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("Error en NotificationProvider");
  return ctx;
};
