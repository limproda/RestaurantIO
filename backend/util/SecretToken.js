import { config } from 'dotenv';
import jwt from "jsonwebtoken";

// Load environment variables
config();

// Ensure TOKEN_KEY is defined
if (!process.env.TOKEN_KEY) {
  throw new Error("TOKEN_KEY is not defined in the environment variables. Please add it to your .env file.");
}

export function createSecretToken(id) {
  // Generate a JWT token with the provided ID and expiration time
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60, // 3 days in seconds
  });
}