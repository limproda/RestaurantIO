import React from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function WorkingTimeTable({ rows = [], loading }) {
  const columns = [
    {
      field: "date",
      headerName: "Fecha",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "display",
      headerName: "Horas trabajadas",
      headerAlign: "center",
      align: "center",
      flex: 2,
      minWidth: 250,
      renderCell: (params) => {
        const hours = params.row.hours || 0;
        const minutes = params.row.minutes || 0;
        return `${hours}h ${minutes}m`;
      },
    },
  ];

  return (
    <div style={{ minHeight: 300, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        showToolbar
        getRowId={(r) => r.id}
      />
    </div>
  );
}
