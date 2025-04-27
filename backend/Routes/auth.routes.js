import { Signup, Login } from "../Controllers/auth.controllers.js";
import { userVerification } from "../Middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/", userVerification);

export default router;