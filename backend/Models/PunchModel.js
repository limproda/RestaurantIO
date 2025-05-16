import mongoose from "mongoose";

// Definición del esquema de fichaje de turnos
const punchSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ["entrada", "salida"], required: true },
});

export default mongoose.model("Punch", punchSchema);
