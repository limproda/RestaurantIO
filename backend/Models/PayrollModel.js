import mongoose from "mongoose";

// Definición del esquema de nóminas
const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 1950,
      max: 2100,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Virtual para el nombre del mes usando JS
payrollSchema.virtual("monthName").get(function () {
  return new Intl.DateTimeFormat("es-ES", { month: "long" }).format(
    new Date(2000, this.month - 1, 1)
  );
});

export default mongoose.model("Payroll", payrollSchema);
