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
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Payments as PaymentsIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useEmployeeView } from "./useEmployeeView";

// Mostrar la información del empleado
export default function ViewEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employee, loading } = useEmployeeView(id);
  const date = (d) => (d ? dayjs(d).format("DD/MM/YYYY") : "No especificada"); // Le damos formato a la fecha. Si no existe, indicamos que no existe

  if (loading || !employee) return <CircularProgress />;

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h1">Detalles del Empleado</Typography>
        <Box display="flex" gap="2rem">
          {/* Botón de modificar */}
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/admin/employees/edit/${employee._id}`)}
          >
            Modificar
          </Button>
          {/* Botón de volver */}
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Volver
          </Button>
        </Box>
      </Stack>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={2}>
          {/* Avatar */}
          <Grid
            size={{ xs: 12, md: 6 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            {/* Si no hay avatar de foto de perfil, podemos el icono */}
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

          {/* Información Contacto */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información de Contacto
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon color="action" />
                <Typography>{employee.email}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <PhoneIcon color="action" />
                <Typography>{employee.phone}</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Información Personal */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información Personal
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarIcon color="action" />
                <Typography>Nacimiento: {date(employee.bornDate)}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <CalendarIcon color="action" />
                <Typography>
                  Creación cuenta: {date(employee.createdAt)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Información Laboral */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información Laboral
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" alignItems="center" gap={1}>
                <WorkIcon color="action" />
                <Typography>Contratación: {date(employee.hireDate)}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <PaymentsIcon color="action" />
                <Typography>Día de cobro: {employee.paymentDay}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}