import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Definición del esquema de usuario
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Evitamos que la contraseña se devuelva al hacer las operaciones
    },
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["administrador", "empleado"],
      default: "empleado",
    },
    phone: {
      type: String,
      required: true,
    },
    bornDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    employeesNumber: {
      type: Number,
      default: 0,
    },
    hireDate: {
      type: Date,
    },
    paymentDay: {
      type: Number,
      min: 1,
      max: 31,
      default: 1,
    },
    profilePictureUrl: {
      type: String,
      default: null,
    },
    timeRecord: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TimeRecord",
      },
    ],

    payRoll: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payroll",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Método para comparar contraseñas
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Si la contraseña no ha sido modificada, continuar
  try {
    const salt = await bcrypt.genSalt(10); // Generación de un salt con 10 rondas
    this.password = await bcrypt.hash(this.password, salt); // Hasheo de la contraseña con el salt
    next(); // Continuamos con el siguiente middleware
  } catch (err) {
    return next(err); // Si hay un error, lo pasamos al siguiente middleware
  }
});

// Campo virtual para el nombre completo
userSchema.virtual("fullName").get(function () {
  const first = this.name || "";
  const last = this.lastName || "";
  return `${first} ${last}`.trim();
});
export default mongoose.model("User", userSchema);
