import mongoose from "mongoose";

export const incomeCategories = {
  restaurante: "Ventas derivadas del negocio",
  propinas: "Propinas derivadas de la voluntad de los clientes",
  eventos: "Eventos gastronómicos especiales",
  catering: "Servicios de suministro de comida y bebida",
  otros: "Cualquier otro tipo de ingreso",
};

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
    descripcion: {
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
incomeSchema.index({ categoty: 1 });

// Campos virtuales: Se calculan, no se almacenan en la base de datos
// 1. Fechas en formato legible DD/MM/AAAA
incomeSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString("es-ES");
});

incomeSchema.virtual("formattedCreationDate").get(function () {
  return this.expenseCreationDate.toLocaleString("es-ES");
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
