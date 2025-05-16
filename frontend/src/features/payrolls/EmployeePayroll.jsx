import PayrollsTable from "./PayrollsTable";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { usePayrolls } from "./usePayrolls";
import { useRole } from "../role/useRole";

export default function employeePayroll() {
  const { user } = useRole(); // Obtenemos el usuario logueado y los métodos según el rol
  const { payrolls, loading: payrollsLoading } = usePayrolls(user.id);

  return (
    <Box>
      <Box>
        <Typography variant="h1" gutterBottom>
          Tus nóminas
        </Typography>
        {/* Sección de Nóminas */}
        <Paper elevation={3} sx={{ p: 4 }} gutterBottom>
          <Typography variant="h6" gutterBottom>
            Listado de Nóminas
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {/* Tabla de Nóminas */}
          <PayrollsTable
            payrolls={payrolls}
            loading={payrollsLoading}
            showEmployeeColumn={false}
            showDeleteButton={false}
          />
        </Paper>
      </Box>
    </Box>
  );
}
