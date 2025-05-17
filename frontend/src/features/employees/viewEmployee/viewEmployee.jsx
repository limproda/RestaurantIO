import React, { useState } from "react";
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
import PayrollsTable from "../../payrolls/PayrollsTable";
import { usePayrolls } from "../../payrolls/usePayrolls";
import PunchesTable from "../../punch/PunchesTable";
import PunchDialog from "../../punch/PunchDialog";

// Campo con la información
const InfoField = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
    <Icon sx={{ color: "text.secondary" }} />
    <Box>
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </Box>
  </Box>
);

export default function ViewEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employee, loading } = useEmployeeView(id);
  const {
    payrolls,
    loading: payrollsLoading,
    getPayrolls,
    deletePayroll,
  } = usePayrolls(id);
  const date = (d) => (d ? dayjs(d).format("DD/MM/YYYY") : "No especificada");
  const [refreshKey, setRefreshKey] = useState(0);

  // Gestión de borrado de nóminas
  const handleDeletePayroll = async (payrollId) => {
    await deletePayroll(payrollId);
    getPayrolls(); // Permite refrescar las nóminas
  };

  // Gestión puncheos admin
  const [manage, setManage] = useState({ open: false, mode: "add", row: {} });
  const openManage = (mode, row = null) => setManage({ open: true, mode, row });

  if (loading || !employee) return <CircularProgress />; // Spinner de carga

  return (
    <Box>
      {/* Sección de botones */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        mb={3}
      >
        <Typography variant="h1" gutterBottom>
          Detalles del Empleado
        </Typography>
        <Box display="flex" gap="2rem" flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/admin/employees/edit/${employee._id}`)}
          >
            Modificar
          </Button>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
        </Box>
      </Stack>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={2}>
          {/* Avatar */}
          <Grid
            size={{ xs: 12, md: 6 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            {employee.profilePictureUrl ? (
              <Avatar
                src={employee.profilePictureUrl}
                sx={{ width: 250, height: 250, mb: 2 }}
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
              <InfoField
                icon={EmailIcon}
                label="Correo Electrónico"
                value={employee.email}
              />
              <InfoField
                icon={PhoneIcon}
                label="Teléfono"
                value={employee.phone || "No especificado"}
              />
            </Paper>
          </Grid>

          {/* Información Personal */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información Personal
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoField
                icon={CalendarIcon}
                label="Fecha de Nacimiento"
                value={date(employee.bornDate)}
              />
              <InfoField
                icon={CalendarIcon}
                label="Fecha de Registro"
                value={date(employee.createdAt)}
              />
            </Paper>
          </Grid>

          {/* Información Laboral */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información Laboral
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoField
                icon={WorkIcon}
                label="Fecha de Contratación"
                value={date(employee.hireDate)}
              />
              <InfoField
                icon={PaymentsIcon}
                label="Día de Cobro"
                value={`Día ${employee.paymentDay} de cada mes`}
              />
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Sección de Nóminas */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Nóminas del Empleado
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <PayrollsTable
          payrolls={payrolls}
          loading={payrollsLoading}
          showEmployeeColumn={false}
          showDeleteButton={true}
          deletePayroll={handleDeletePayroll}
        />
      </Paper>

      {/* Sección de Puncheos */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Historial de Puncheos
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <PunchesTable
          employeeId={employee.id}
          isAdmin={true}
          onManage={openManage}
          refreshKey={refreshKey}
        />
      </Paper>

      {/* Diálogo de gestión de puncheos */}
      <PunchDialog
        open={manage.open}
        mode={manage.mode}
        row={manage.row}
        employeeId={employee.id}
        onClose={() => setManage({ ...manage, open: false })}
        onUpdated={() => setRefreshKey((k) => k + 1)}
      />
    </Box>
  );
}
