import { Router } from "express";
import {
  userVerification,
  verifyAdmin,
} from "../Middlewares/auth.middleware.js";
import {
  deleteEmployee,
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
} from "../Controllers/employees.controller.js";

const router = Router();

// Verificamos que el usuario tenga un JWT válido y que tenga rol de administrador
router.use(userVerification);
router.use(verifyAdmin);

// GET - Devuelve únicamente usuarios que sean empleados
router.get("/", getAllEmployees);

// POST - Crea un nuevo empleado
router.post("/", createEmployee);

// GET - Devuelve un empleado según el ID
router.get("/:id", getEmployeeById);

// PATCH - Modificar información de los usuarios
router.patch("/:id", updateEmployee);

// Borra un empleado usando el ID
router.delete("/:id", deleteEmployee);

export default router;
