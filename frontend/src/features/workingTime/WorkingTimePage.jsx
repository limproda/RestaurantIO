import { Box, CircularProgress, Typography, Paper, Divider } from "@mui/material";
import { useWorkingTime } from "./useWorkingTime";
import WorkingTimeTable from "./WorkingTimeTable";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../components/NotificationProvider";

export default function WorkingTimePage() {
  const { user, loading } = useAuth();
  const { shifts, loading: dataLoading, error } = useWorkingTime();
  const { notify } = useNotification();

  // Si no hay usuario o estamos cargando, mostramos un spinner
  if (loading || dataLoading) return <CircularProgress />;

  // Si no hay usuario, mostramos un mensaje de error
  if (!user || error) {
    useEffect(() => {
      if (error) notify("error", "Ha habido un error inesperado");
    }, [error, notify]);
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Título */}
        <Typography variant="h1" gutterBottom>
          Horas trabajadas
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Horas trabajadas en el último mes
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Elemento tabla */}
        <WorkingTimeTable rows={shifts} loading={dataLoading} />
      </Paper>
    </Box>
  );
}
