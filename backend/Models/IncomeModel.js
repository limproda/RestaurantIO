import mongoose from "mongoose";

// Definimos las categorías para los ingresos
export const incomeCategories = {
  restaurante: "Ventas derivadas del negocio",
  propinas: "Propinas derivadas de la voluntad de los clientes",
  eventos: "Eventos gastronómicos especiales",
  catering: "Servicios de suministro de comida y bebida",
  otros: "Cualquier otro tipo de ingreso",
};
// Definición del esquema de ingresos
const incomeSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    concept: {
      type: String,
    },
    category: {
      type: String,
      enum: Object.keys(incomeCategories),
      required: true,
    },
    description: {
      type: String,
    },
    reference: {
      type: String,
      required: true,
    },
    incomeCreationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Para acelerar las consultas, podemos usar índices
incomeSchema.index({ date: 1 });
incomeSchema.index({ category: 1 });

incomeSchema.pre("save", function (next) {
  this.amount = Math.round(Math.abs(this.amount) * 100) / 100;
  next();
});

// Campos virtuales: Se calculan, no se almacenan en la base de datos, tenemos:
// 1. Fechas en formato legible DD/MM/AAAA
incomeSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString("es-ES");
});

incomeSchema.virtual("formattedCreationDate").get(function () {
  return this.incomeCreationDate.toLocaleString("es-ES");
});

// 2. Extración de Día/Mes/Año
incomeSchema.virtual("day").get(function () {
  return this.date.getDate();
});

incomeSchema.virtual("month").get(function () {
  return this.date.getMonth() + 1;
});

incomeSchema.virtual("year").get(function () {
  return this.date.getFullYear();
});

// Campos virual para el type:
incomeSchema.virtual("type").get(() => "ingreso");

// Campo para poner en mayúscula la primera letra
incomeSchema.virtual("categoryCapitalized").get(function () {
  return this.category
    .charAt(0)
    .toUpperCase() + this.category.slice(1).toLowerCase();
});
export default mongoose.model("Income", incomeSchema);
