import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useExpenseView } from "./useExpenseView";
import { expenseCategories } from "../../../../../backend/Models/ExpenseModel";


const InfoField = ({ icon: Icon, label, value, description, color }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
    <Icon sx={{ color: "text.secondary"}} />
    <Box>
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
      <Typography color={color}>{value}</Typography>
      <Typography variant="caption" color={"text.secondary"}>{description}</Typography>
    </Box>
  </Box>
);

export default function ViewExpensePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { expense, loading } = useExpenseView(id);
  const formatedDate = d => (d ? dayjs(d).format("DD/MM/YYYY") : "No especificada");

  if (loading || !expense) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const {
    amount,
    category,
    reference,
    supplier,
    deductible,
    date,
    expenseCreationDate,
    concept,
    description,
    _id,
  } = expense;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h1">Detalles del Gasto</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/admin/transactions/expense/edit/${_id}`)}
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
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información Principal
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <InfoField icon={MoneyIcon} label="Importe" value={`${amount} €`} color="error.main" />
              <InfoField
                icon={CategoryIcon}
                label="Categoría"
                value={category.charAt(0).toUpperCase() + category.slice(1)}
                description={expenseCategories[category]}
              />

              <InfoField icon={ReceiptIcon} label="Referencia" value={reference} />
              <InfoField icon={BusinessIcon} label="Proveedor" value={supplier || "No especificado"} />
              <InfoField
                icon={CheckCircleIcon}
                label="Deducible"
                value={deductible ? "Sí" : "No"}
                color={deductible ? "success.main" : "error.main"}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fechas
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <InfoField icon={CalendarIcon} label="Fecha del Gasto" value={formatedDate(date)} />
              <InfoField
                icon={CalendarIcon}
                label="Fecha de Registro"
                value={formatedDate(expenseCreationDate)}
              />

              <Typography variant="h6" gutterBottom>
                Otros Detalles
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {concept && <InfoField icon={InfoIcon} label="Concepto" value={concept} />}
              <InfoField
                icon={DescriptionIcon}
                label="Descripción"
                value={description || "Sin descripción"}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
