import { config } from 'dotenv';
import jwt from "jsonwebtoken";

// Cargar variables de entorno
config();

// Aseguramos que la variable de entorno TOKEN_KEY esté definida
if (!process.env.TOKEN_KEY) {
  throw new Error("TOKEN_KEY is not defined in the environment variables. Please add it to your .env file.");
}

// Funcion para crear un token secreto
export function createSecretToken(id) {
  // Generar un token JWT con el ID proporcionado y el tiempo de expiración
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60, // Caduca en: 3 dias en segundos
  });
}