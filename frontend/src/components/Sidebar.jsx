import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { usePages } from "../features/navigationMenu/usePages";
import { iconMap } from "../features/navigationMenu/menuIcons";
import { useNavigate } from "react-router-dom";
import useIsSmallScreen from "../features/responsive/useIsSmallScreen";
import { appName } from "../config/config";
import { LogoutDialog } from "./LogoutDialog";

export default function Sidebar({
  mobileOpen, // Booleano que controla el temporary sidebar en móvil
  mobileClose, // Función para cerrarlo
}) {
  const pages = usePages();
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const openLogoutDialog = () => setLogoutDialogOpen(true);
  const closeLogoutDialog = () => setLogoutDialogOpen(false);

  const logOutText = "Cerrar Sesión";

  // Contenido del sidebar
  const sidebarContent = (
    <Box sx={{ width: 240 }}>
      <Typography variant="h6" sx={{ m: 2 }}>
        {appName} {/* Nombre de la aplicación */}
      </Typography>
      <List>
        {/* Recorremos el array de páginas */}
        {pages.map((p) => {
          const Icon = iconMap[p.icon];
          const isLogout = p.name === logOutText; // Comprobador de si es cerrar sesión
          return (
            <ListItemButton
              key={p.path} // Usa path como key para mayor estabilidad
              onClick={() => {
                if (isLogout) {
                  openLogoutDialog();
                } else {
                  navigate(p.path);
                }
                if (isSmallScreen) {
                  mobileClose(); // cerrar en móvil al hacer clic
                }
              }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>{/* Mostramos los iconos */}
              <ListItemText primary={p.name} />{/* Mostramos el nombre */}
            </ListItemButton>
          );
        })}
        <LogoutDialog open={logoutDialogOpen} onClose={closeLogoutDialog} />
      </List>
    </Box>
  );

  // En escritorio el sidebar será permanente
  if (!isSmallScreen) {
    return (
      <Drawer
        variant="permanent"
        open
        slotProps={{
          paper: {
            elevation: 2,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // En móvil el sidebar será temporal y controlado por mobileOpen
  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={mobileClose}
      ModalProps={{ keepMounted: true }} // mejora rendimiento en móvil
      slotProps={{
        paper: {
          elevation: 4,
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
}