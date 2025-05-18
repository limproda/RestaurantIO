import { Typography, Box } from "@mui/material";
import { usePayrolls } from "./usePayrolls";
import PayrollsTable from "./PayrollsTable";
import PayrollUpload from "./PayrollUpload";

export default function Payrolls() {
  const { payrolls, loading, deletePayroll, getPayrolls } = usePayrolls();

  return (
      <Box
      >
      <Typography variant="h1" gutterBottom>
        Gestión de Nóminas
      </Typography>
      {/* Componente para subir nuevas nóminas */}
      <PayrollUpload onUploadSuccess={getPayrolls} />

      {/* Tabla con la lista de nóminas */}
      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        Últimas nóminas subidas
      </Typography>
      <PayrollsTable
        payrolls={payrolls}
        loading={loading}
        deletePayroll={deletePayroll}
      />
    </Box>
  );
}
