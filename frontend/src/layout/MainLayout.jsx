import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar, useMediaQuery } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { sidebarWidth, appName } from "../config/config";
import useIsSmallScreen from "../features/responsive/useIsSmallScreen";

export default function MainLayout({ children }) {
  const isSmallScreen = useIsSmallScreen(); // Definimos el tamaño para móviles con un breakpoint de MUI

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar que puede ser tanto fijo como temporal, en móviles */}
      <Sidebar appName={appName} />
      {/* Contenedor principal desplazado a la derecha */}
      <Box
        component="main"
        sx={{
          width: isSmallScreen
            ? "100%" // En móvil, el sidebar ocupa todo el ancho
            : `calc(100% - ${sidebarWidth}px)`, // En escritorio, el contenido empieza después del sidebar
          ml: isSmallScreen ? 0 : `${sidebarWidth}px`, // En móvil no hay margen, en escritorio ocupa el margen del sidebar
        }}
      >
        {/* Topbar */}
        <Topbar />
        <Toolbar />{" "}
        {/* Espaciador que da un margen igual a la altura de la AppBar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 4
          }}
        >
          {" "}
          {/* Contenidos de las páginas */}
          <Outlet /> {/* Aquí se inyectan el resto de las páginas */}
        </Box>
      </Box>
    </Box>
  );
}
