import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {} from 'dotenv/config';
import cookieParser from "cookie-parser";
import AuthRoute from "./Routes/AuthRoute.js";

// Carga de variables de entorno
const { MONGO_URI, PORT, FRONT_PORT } = process.env;
const app = express();

// Conexión a la base de datos MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error(err));

// La app escucha en el puerto definido 
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

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