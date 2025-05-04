import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Grid,
  Avatar,
  Button,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Payments as PaymentsIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useEmployeeView } from "./useEmployeeView";

// Componente genérico sin ícono en el título
const InfoPaper = ({ title, children }) => (
  <Paper variant="outlined" sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Stack spacing={2}>{children}</Stack>
  </Paper>
);

export default function ViewEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employee, loading } = useEmployeeView(id);
  const fmt = (date) =>
    date ? dayjs(date).format("DD/MM/YYYY") : "No especificada";

  if (loading || !employee) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h1">Detalles del Empleado</Typography>
        <Box gap={"2rem"} display={"flex"} flexDirection={"row"}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/admin/employees/edit/${employee._id}`)}
          >
            Modificar
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
        </Box>
      </Stack>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={2}>
          {/* Avatar */}
          <Grid
            textAlign="center"
            display="flex"
            flexDirection="column"
            alignItems="center"
            size={{ xs: 12, md: 6 }}
          >
            {employee.profilePictureUrl ? (
              <Avatar
                src={employee.profilePictureUrl}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
            ) : (
              <PersonIcon sx={{ fontSize: 150, mb: 2 }} />
            )}
            <Typography variant="h5">
              {employee.name} {employee.lastName}
            </Typography>
          </Grid>

          {/* Contacto */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoPaper title="Información de Contacto">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon color="action" />
                <Typography>{employee.email}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon color="action" />
                <Typography>{employee.phone}</Typography>
              </Box>
            </InfoPaper>
          </Grid>

          {/* Personal */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoPaper title="Información Personal">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon color="action" />
                <Typography>Nacimiento: {fmt(employee.bornDate)}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon color="action" />
                <Typography>
                  Creación cuenta: {fmt(employee.createdAt)}
                </Typography>
              </Box>
            </InfoPaper>
          </Grid>

          {/* Laboral */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoPaper title="Información Laboral">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <WorkIcon color="action" />
                <Typography>Contratación: {fmt(employee.hireDate)}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PaymentsIcon color="action" />
                <Typography>Día de cobro: {employee.paymentDay}</Typography>
              </Box>
            </InfoPaper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
