import mongoose from "mongoose";

export const expenseCategories = {
  ingredientes: "Materias primas  del restaurante como alimentos, verduras...",
  bebidas: "Vinos, cervezas, refrescos...",
  salarios: "Nóminas de cocineros, camareros...",
  alquiler: "Renta del local",
  facturas: "Luz, agua, gas, internet...",
  limpieza: "Detergentes, desinfectantes...",
  mobiliario: "Como sillas, mesas...",
  electrodomesticos: "Equipamiento de cocina...",
  impuestos: "IVA y otros impuestos...",
  uniformes: "Ropas de trabajo",
  formaciones: "Formaciones para los empleados",
  mantenimiento: "Reparaciones y revisiones",
  marketing: "Publicidad, redes sociales…",
  seguros: "Seguro de responsabilidad civil, de local...",
  otros: "Cualquier otro tipo de gasto",
};

//Definición del esquema de gastos
const expenseSchema = new mongoose.Schema(
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
      enum: Object.keys(expenseCategories),
      required: true,
    },
    description: {
      type: String,
    },
    reference: {
      type: String,
      required: true,
    },
    supplier: {
      type: String,
    },
    deductible: {
      type: Boolean,
    },
    expenseCreationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Para acelerar las consultas, podemos crear índices
expenseSchema.index({ date: 1 });
expenseSchema.index({ category: 1 });

// Antes de guardar la cantidad en la base de datos, la redondeamos a 2 decimales
expenseSchema.pre("save", function (next) {
  this.amount = Math.round(this.amount * 100) / 100;
  next();
});

// Campos virtuales: Se calculan, no se almacenan en la base de datos
// 1. Fechas en formato legible DD/MM/AAAA
expenseSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString("es-ES");
});

expenseSchema.virtual("formattedCreationDate").get(function () {
  return this.expenseCreationDate.toLocaleString("es-ES");
});

// 2. Extración de Día/Mes/Año
expenseSchema.virtual("day").get(function () {
  return this.date.getDate();
});

expenseSchema.virtual("month").get(function () {
  return this.date.getMonth() + 1;
});

expenseSchema.virtual("year").get(function () {
  return this.date.getFullYear();
});

// 3. Texto para gastos deducibles
expenseSchema.virtual("deductibleText").get(function () {
  return this.deductible ? "Sí" : "No";
});

export default mongoose.model("Expense", expenseSchema);
