import { Router } from "express";
import {
    getAllPayrolls,
    createPayroll,
    deletePayroll,
    getPayrollsByEmployee
} from "../Controllers/payrolls.controller.js";
import { userVerification, verifyAdmin, verifyAdminOrOwner } from "../Middlewares/auth.middleware.js";

const router = Router();

// Verificamos que el usuario tenga un JWT válido y que tenga rol de administrador
router.use(userVerification);

// GET - Obtener todas las nóminas
router.get("/", verifyAdmin, getAllPayrolls);

// GET - Obtener nóminas por empleado
router.get("/employee/:employeeId", verifyAdminOrOwner, getPayrollsByEmployee);

// POST - Crear una nueva nómina
router.post("/", verifyAdmin, createPayroll);

// DELETE - Eliminar una nómina
router.delete("/:id",verifyAdmin, deletePayroll);

export default router; 