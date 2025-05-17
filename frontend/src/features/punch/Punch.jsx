import React, { useState } from "react";
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import PunchDialog from "./PunchDialog";
import PunchesTable from "./PunchesTable";
import { useAuth } from "../../contexts/AuthContext";
import { useRole } from "../role/useRole";

export default function Punch() {
  const { user } = useAuth();
  const { isAdmin } = useRole();

  const [clockOpen, setClockOpen] = useState(false);
  const [manage, setManage] = useState({ open: false, mode: "add", row: null });

  const openManage = (mode, row = null) => setManage({ open: true, mode, row });
  const [refreshKey, setRefreshKey] = useState(0);
  const handleUpdated = () => setRefreshKey((k) => k + 1);

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
          Control de Turnos
        </Typography>
        {/* Botón de fichar ahora */}
        <Button variant="contained" onClick={() => setClockOpen(true)}>
          Fichar Ahora
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Historial de Turnos
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <PunchesTable
          employeeId={user._id}
          isAdmin={isAdmin}
          onManage={openManage}
          refreshKey={refreshKey}
        />
      </Paper>

      {/* Diálogo de gestión (solo admin) */}
      {isAdmin && (
        <PunchDialog
          open={manage.open}
          mode={manage.mode}
          row={manage.row}
          employeeId={user?._id}
          onClose={() => setManage({ ...manage, open: false })}
          onUpdated={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {/* Diálogo de fichar ahora */}
      <PunchDialog
        open={clockOpen}
        mode="clock"
        onClose={() => setClockOpen(false)}
        onUpdated={handleUpdated}
      />
    </Box>
  );
}
