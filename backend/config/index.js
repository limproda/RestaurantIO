import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const FRONT_PORT = process.env.FRONT_PORT || 5173;
export const MONGO_URI = process.env.MONGO_URI;
export const TOKEN_KEY = process.env.TOKEN_KEY;

export const TZ = "Europe/Madrid"; // Establecemos la zona horaria por defecto
