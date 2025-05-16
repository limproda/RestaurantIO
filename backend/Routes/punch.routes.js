import { Router } from "express";
import {
  punchClock,
  getPunchesByEmployee,
  updatePunch,
  deletePunch,
  createPunchManual,
  getShiftsByEmployee
} from "../Controllers/punch.controller.js";
import { userVerification, verifyAdmin, verifyAdminOrOwner } from "../Middlewares/auth.middleware.js";

const router = Router();

// POST - Fichaje automático o manual (propio o admin)
router.post("/punch", userVerification, punchClock);
router.post("/", userVerification, verifyAdminOrOwner, createPunchManual);

// GET - Listar puncheos (propio o admin)
router.get("/employee/:employeeId", userVerification, verifyAdminOrOwner, getShiftsByEmployee);

// PATCH/DELETE - Solo admin puede modificar o borrar
router.patch("/:id", userVerification, verifyAdmin, updatePunch);
router.delete("/:id", userVerification, verifyAdmin, deletePunch);

export default router;
