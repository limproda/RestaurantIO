import { Router } from "express";
import { userVerification } from "../Middlewares/auth.middleware.js";
import { getProfile, updateProfile } from "../Controllers/settings.controllers.js";

const router = Router();

// GET - Devuelve los datos de un usuario autenticado
router.get("/profile", userVerification, getProfile);

// PATCH - Actualiza los datos de un usuario autenticado
router.patch("/profile", userVerification, updateProfile);

export default router;
