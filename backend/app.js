import mongoose from "mongoose";
import {} from "dotenv/config";
import { PORT, MONGO_URI } from "./config/index.js";
import app from "./expressApp.js";

// Conexión a la base de datos MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully"); // Mensaje de conexión a la base de datos correcta

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`); // Mensaje de que la app escucha en el puerto definido
    });
  })
  .catch((err) => console.error(err));
