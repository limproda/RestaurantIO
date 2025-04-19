import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {} from 'dotenv/config';
import cookieParser from "cookie-parser";
import AuthRoute from "./Routes/auth.routes.js";
import { PORT, FRONT_PORT, MONGO_URI, TOKEN_KEY, } from "./config/index.js"

// Carga de variables de entorno
const app = express();

// Middleware para permitir el acceso a la API desde el frontend
app.use(
  cors({
    origin: [`http://localhost:${FRONT_PORT}`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware para parsear cookies
app.use(cookieParser());
// Middleware para parsear el cuerpo de las peticiones
app.use(express.json());
// Rutas de autenticación
app.use("/", AuthRoute);

// La app escucha en el puerto definido 
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Conexión a la base de datos MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error(err));