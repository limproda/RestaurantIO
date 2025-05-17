import { Router } from "express";
import {
  punchClock,
  updatePunch,
  deletePunch,
  createPunchManual,
  getShiftsByEmployee,
  getPunchesByEmployee,
} from "../Controllers/punch.controller.js";
import { getWorkingTimeByEmployee, getTransactionsSummary } from "../Controllers/worktime.controller.js";
import { userVerification, verifyAdmin, verifyAdminOrOwner } from "../Middlewares/auth.middleware.js";

const router = Router();

// POST - Fichaje automático o manual (propio o admin)
router.post("/punch", userVerification, punchClock);
router.post("/", userVerification, verifyAdminOrOwner, createPunchManual);

// GET - Listar puncheos (propio o admin) y obtener resumen de un empleado 
router.get("/employee/:employeeId", userVerification, verifyAdminOrOwner, getShiftsByEmployee);
router.get("/employee/punches", userVerification, getPunchesByEmployee);

// GET - Obtener horas trabajadas por empleado
router.get("/working-time", userVerification, getWorkingTimeByEmployee);

// PATCH/DELETE - Solo admin puede modificar o borrar
router.patch("/:id", userVerification, verifyAdmin, updatePunch);
router.delete("/:id", userVerification, verifyAdmin, deletePunch);

// RUTAS DE SUMMARY
router.get("/summary", userVerification, getTransactionsSummary); // Resumen mensual (mes + horas)
export default router;
