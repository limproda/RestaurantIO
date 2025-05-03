import { Signup, Login } from "../Controllers/auth.controller.js";
import { userVerification } from "../Middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

// Rutas de autenticación
router.post("/", userVerification); // Ruta de inicio
router.post("/signup", Signup); // Ruta de creación de cuenta
router.post("/login", Login); // Ruta de inicio de sesión


export default router;