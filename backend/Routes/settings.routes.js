import { Router } from "express";
import { userVerification } from "../Middlewares/auth.middleware.js";
import { getProfile, updateProfile } from "../Controllers/settings.controllers.js";

const router = Router();

router.use(userVerification);

// GET - Devuelve los datos de un usuario autenticado
router.get("/profile", getProfile);

// PATCH - Actualiza los datos de un usuario autenticado
router.patch("/profile", updateProfile);

export default router;
