import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useAuth } from "../contexts/AuthContext";

// Diálogo de confirmación para cerrar sesión
export function LogoutDialog({ open, onClose }) {
  const navigate = useNavigate(); // Para redirigir al login
    const [cookies, setCookie, removeCookie] = useCookies(["token"]); // Unicamente aprovechamos removeCookie
  const { setUser } = useAuth(); // Usamos el setUser para limpiar la info del usuario

  // Lógica de logout aislada en este componente
  const logout = () => {
    removeCookie("token", { path: "/" }); // Elimina la cookie de autenticación
    localStorage.removeItem("user");           // Limpia almacenamiento local
    setUser(null);                              // Actualiza contexto de usuario
    navigate("/login");                       // Redirige al login
  };

  // Confirmación de cierre de sesión
  const handleConfirm = () => {
    logout();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cerrar sesión</DialogTitle>
      <DialogContent>
        <Typography>¿Estás seguro de que deseas cerrar sesión?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="error" onClick={handleConfirm}>
          Cerrar Sesión
        </Button>
      </DialogActions>
    </Dialog>
  );
}