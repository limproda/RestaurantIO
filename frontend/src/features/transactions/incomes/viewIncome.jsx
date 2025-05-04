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
    Description as DescriptionIcon,
    CalendarToday as CalendarIcon,
    Category as CategoryIcon,
    Receipt as ReceiptIcon,
    Info as InfoIcon,
    Edit as EditIcon,
    ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useIncomeView } from "./useIncomeView";
import { incomeCategories } from "../../../../../backend/Models/IncomeModel";

const InfoField = ({ icon: Icon, label, value, description, color }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Icon sx={{ color: "text.secondary"}} />
        <Box>
            <Typography variant="body1" color="text.secondary">
                {label}
            </Typography>
            <Typography color={color}>{value}</Typography>
            <Typography variant="caption" color="text.secondary">{description}</Typography>
        </Box>
    </Box>
);

export default function ViewIncomePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { income, loading } = useIncomeView(id);
    const formatedDate = (date) =>
        date ? dayjs(date).format("DD/MM/YYYY") : "No especificada";

    if (loading || !income) {
        return (
            <Box
                sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" mb={3}>
                <Typography variant="h1">Detalles del Ingreso</Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/admin/transactions/income/edit/${income._id}`)}
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
                            <InfoField
                                icon={MoneyIcon}
                                label="Importe"
                                value={`${income.amount}€`}
                                color="success.main"
                            />
                            <InfoField
                                icon={CategoryIcon}
                                label="Categoría"
                                value={income.category.charAt(0).toUpperCase() + income.category.slice(1)}
                                description={incomeCategories[income.category]}
                            />
                            <InfoField
                                icon={ReceiptIcon}
                                label="Referencia"
                                value={income.reference}
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
                            <InfoField
                                icon={CalendarIcon}
                                label="Fecha del Ingreso"
                                value={formatedDate(income.date)}
                            />
                            <InfoField
                                icon={CalendarIcon}
                                label="Fecha de Registro"
                                value={formatedDate(income.incomeCreationDate)}
                            />
                            <Typography variant="h6" gutterBottom>
                                Otros Detalles
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {income.concept && (
                                <InfoField
                                    icon={InfoIcon}
                                    label="Concepto"
                                    value={income.concept}
                                />
                            )}
                            <InfoField
                                icon={DescriptionIcon}
                                label="Descripción"
                                value={income.description || "Sin descripción"}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
} 