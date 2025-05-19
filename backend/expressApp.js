import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import authRoute from "./Routes/auth.routes.js";
import employeesRoutes from "./Routes/employees.routes.js";
import settingsRoutes from "./Routes/settings.routes.js";
import transactionsRoutes from "./Routes/transactions.routes.js";
import payrollsRoutes from "./Routes/payrolls.routes.js";
import punchRoutes from "./Routes/punch.routes.js";

const __dirname = path.resolve(); // Obtener el directorio actual
const app = express();

app.use(cookieParser()); // Middleware para parsear cookies
app.use(express.json()); // Middleware para parsear el cuerpo de las peticiones

// Sirve para permitir el acceso a la API desde el frontend en modo desarrollo
if (process.env.NODE_ENV === "development") {
  const { FRONT_PORT } = process.env;
  app.use(
    cors({
      origin: [`http://localhost:${FRONT_PORT}`],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    })
  );
}

app.use("/api", authRoute); // Rutas de autenticación
app.use("/api/employees", employeesRoutes); // Rutas para gestionar empleados
app.use("/api/settings", settingsRoutes); // Rutas para modificar el perfil de usuario
app.use("/api/transactions", transactionsRoutes); // Rutas para las transacciones
app.use("/api/payrolls", payrollsRoutes); // Rutas de las nóminas
app.use("/api/punches", punchRoutes); // Rutas para los registros de hora

// Servir el frontend en producción
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Middleware para servir archivos estáticos
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html")); // Enviar el archivo index.html para cualquier otra ruta
  });
}

export default app;