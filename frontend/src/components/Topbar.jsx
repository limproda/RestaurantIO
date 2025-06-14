import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { usePages } from "../features/navigationMenu/usePages";
import { iconMap } from "../features/navigationMenu/menuIcons";
import { useRole } from "../features/role/useRole";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { sidebarWidth, appName } from "../config/config";
import useIsSmallScreen from "../features/responsive/useIsSmallScreen";
import PersonIcon from "@mui/icons-material/Person";
import { LogoutDialog } from "./LogoutDialog";

export default function Topbar({}) {
  const { user, isAdmin } = useRole(); // Obtenemos el usuario logueado y los métodos según el rol
  const pages = usePages(); // Array con las páginas que queremos mostrar, en base al rol
  const navigate = useNavigate(); // Hook de React que permite la navegación
  const isSmallScreen = useIsSmallScreen(); // Definimos el tamaño para móviles con un breakpoint de small de MUI
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado para controlar la apertura o cierre del Sidebar en móvil
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // Permite controlar el diálogo

  const handleToggleSidebar = () => setSidebarOpen((o) => !o); // Alterna el estado del Sidebar para abrir y cerrar
  const openLogoutDialog = () => setLogoutDialogOpen(true);
  const closeLogoutDialog = () => setLogoutDialogOpen(false);

  const logOutText = "Cerrar Sesión";

  return (
    <Box>
      {/* Appbar fijo en la parte superior */}
      <AppBar
        position="fixed"
        sx={{
          width: isSmallScreen ? "100%" : `calc(100% - ${sidebarWidth}px)`,
          ml: isSmallScreen ? 0 : `${sidebarWidth}px`,
        }}
      >
        {/* Toolbar que contiene los elementos */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
          }}
        >
          {/* Si se trata de un móvil, únicamente mostramos el nombre y el botón de hamburguesa */}
          {isSmallScreen ? (
            <>
              <Typography variant="h6" noWrap>
                {appName}
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleToggleSidebar}
              >
                <MenuIcon /> {/* Botón de hamburguesa */}
              </IconButton>
            </>
          ) : (
            <>
              {/* Si es más grande que un móvil, mostramos los iconos de navegación */}
              <Box
                sx={{ display: "flex", flexGrow: 1, justifyContent: "center" }}
              >
                {/* Recorremos el array de páginas, que varía según el rol */}
                {pages.map((p) => {
                  {/* Extraemos los iconos */}
                  const Icon = iconMap[p.icon];
                  const isLogout = p.name === logOutText; // Comprobador de si es cerrar sesión
                  return (
                    <IconButton
                      key={p.name}
                      sx={{ flexDirection: "column", mx: 1 }}
                      onClick={
                        isLogout ? openLogoutDialog : () => navigate(p.path)
                      } // Añadimos en enlace al hacer clic
                    >
                      <Icon />
                      <Typography variant="caption">{p.name}</Typography>{" "}
                      {/* Escribimos debajo el texto del icono */}
                    </IconButton>
                  );
                })}
              </Box>

              {/* Sección de la derecha con el icono del usuario y el nombre*/}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ textAlign: "right", mr: 2 }}>
                  <Typography variant="subtitle2">
                    {user?.fullName || "Invitado"}
                    {/* Nombre completo del usuario */}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ textTransform: "capitalize", color: "#fff" }}
                  >
                    {user?.role} {/* Rol del usuario */}
                  </Typography>
                </Box>
                {/* Imagen de perfil del usuario, será un icono de persona si no hay URL de imagen de perfil */}
                {user?.profilePictureUrl ? (
                  <Avatar
                    src={user.profilePictureUrl}
                    onClick={() => isAdmin ? navigate("/admin/settings") : navigate("/employee/settings")}
                    sx={{ cursor: "pointer" }}
                  />
                ) : (
                  <PersonIcon
                    onClick={() => isAdmin ? navigate("/admin/settings") : navigate("/employee/settings")}
                    sx={{ cursor: "pointer" }}
                  /> // Icono en caso de que no exista foto de perfil
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar que solo se muestra en móviles. Usamos el mismo componente ya definido para ahorrar código */}
      <Sidebar mobileOpen={sidebarOpen} mobileClose={handleToggleSidebar} />
      {/* Diálogo de confirmación de logout */}
      <LogoutDialog open={logoutDialogOpen} onClose={closeLogoutDialog} />
    </Box>
  );
}
