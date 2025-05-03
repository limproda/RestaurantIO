import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {} from "dotenv/config";
import cookieParser from "cookie-parser";
import authRoute from "./Routes/auth.routes.js";
import employeesRoutes from "./Routes/employees.routes.js";
import settingsRoutes from "./Routes/settings.routes.js";
import transactionsRoutes from "./Routes/transactions.routes.js";

import { PORT, FRONT_PORT, MONGO_URI, TOKEN_KEY } from "./config/index.js";

// Carga de variables de entorno
const app = express();

// Middleware para permitir el acceso a la API desde el frontend
app.use(
  cors({
    origin: [`http://localhost:${FRONT_PORT}`],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser()); // Middleware para parsear cookies
app.use(express.json()); // Middleware para parsear el cuerpo de las peticiones
app.use("/", authRoute); // Rutas de autenticación
app.use("/employees", employeesRoutes);  // Rutas para gestionar empleados
app.use("/settings", settingsRoutes);    // Rutas para modificar el perfil de usuario
app.use("/transactions", transactionsRoutes);    // Rutas para las transacciones

// Conexión a la base de datos MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully"); // Conexión a la base de datos correcta
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`); // La app escucha en el puerto definido
    });
  })
  .catch((err) => console.error(err));
