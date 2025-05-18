import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Paper, useTheme } from "@mui/material";
import TransactionsSummaryCards from "../../components/TransactionsSummaryCards";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import FilePresentRoundedIcon from "@mui/icons-material/FilePresentRounded";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useRole } from "../role/useRole";
import PunchDialog from "../punch/PunchDialog";
import EmployeeSummaryCards from "../../components/EmployeeSummaryCards";
import { useTransactions } from "../transactions/useTransactions";

function Dashboard() {
  const { isAdmin } = useRole();
  const navigate = useNavigate();
  const [openPunch, setOpenPunch] = useState(false);
  if (isAdmin) {
    const { summary, loading } = useTransactions(); // Devuelve listado, resumen, estado de carga y función de eliminación
  }
  // Opciones del administrador
  const adminItems = [
    {
      label: "Transacciones",
      Icon: DonutSmallRoundedIcon,
      link: "/admin/transactions",
    },
    {
      label: "Gestionar Empleados",
      Icon: PeopleRoundedIcon,
      link: "/admin/employees",
    },
    {
      label: "Gestionar Nóminas",
      Icon: FilePresentRoundedIcon,
      link: "/admin/payroll",
    },
  ];
  // Opciones de los empleados
  const userItems = [
    {
      label: "Ver horas trabajadas",
      Icon: CalendarMonthIcon,
      link: "/employee/punches/working-time",
    },
    {
      label: "Registrar turno",
      Icon: AccessTimeIcon,
      action: () => setOpenPunch(true),
    },
    {
      label: "Nóminas",
      Icon: FilePresentRoundedIcon,
      link: "/employee/payroll",
    },
  ];

  const itemsToShow = isAdmin ? adminItems : userItems; // Asignamos los items según el rol

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3 }}>
        Panel de Control
      </Typography>
      <Box display="flex" flexDirection="column" gap="2rem">
        {isAdmin && <TransactionsSummaryCards summary={summary} loading={loading} />}
        {/* Mostramos el resumen de información del administrador */}
        {!isAdmin && <EmployeeSummaryCards />}
        {/* Mostramos el resumen de información del empleado */}
        <Grid container spacing={2} columns={12} sx={{ mt: "3rem" }}>
          {itemsToShow.map(({ label, Icon, link, action }, idx) => (
            <Grid
              key={idx}
              container
              size={{ xs: 12, md: 4 }}
              justifyContent="center"
            >
              <Paper
                onClick={() => {
                  if (action) action();
                  else navigate(link);
                }}
                elevation={4}
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  height: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 2,
                  cursor: "pointer", // Cambia el icono del cursor
                  "&:hover": {
                    boxShadow: 6, // Efecto de elevación al pasar el cursor
                    color: "primary.main",
                  },
                }}
              >
                <Icon sx={{ fontSize: 80, mb: 1 }} />
                <Typography variant="subtitle1" align="center">
                  {label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <PunchDialog open={openPunch} onClose={() => setOpenPunch(false)} />
    </Box>
  );
}

export default Dashboard;
