import React, { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Topbar from "../components/Topbar";
import HomeIcon from "@mui/icons-material/Home";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import FilePresentRoundedIcon from "@mui/icons-material/FilePresentRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
const TopbarContainer = ({ appName = "RestaurantIO" }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const pages =
    user.role === "empleado"
      ? [
          { name: "Panel", icon: <HomeIcon /> },
          { name: "Horas", icon: <CalendarMonthIcon /> },
          { name: "Turnos", icon: <AccessTimeIcon /> },
          { name: "Nóminas", icon: <FilePresentRoundedIcon /> },
          { name: "Ajustes", icon: <SettingsIcon /> },
        ]
      : [
          { name: "Panel", icon: <HomeIcon /> },
          { name: "Transacciones", icon: <DonutSmallRoundedIcon /> },
          { name: "Empleados", icon: <PeopleRoundedIcon /> },
          { name: "Nóminas", icon: <FilePresentRoundedIcon /> },
          { name: "Ajustes", icon: <SettingsIcon /> },
        ];

  const handleToggleDrawer = () => setDrawerOpen((prev) => !prev);
  const handleNavigate = (pageName) => navigate(`/${pageName.toLowerCase()}`);
  return (
    <Topbar
      pages={pages}
      appName={appName}
      isMobile={isMobile}
      drawerOpen={drawerOpen}
      onToggleDrawer={handleToggleDrawer}
      onNavigate={handleNavigate}
      user={user}
    />
  );
};

export default TopbarContainer;
