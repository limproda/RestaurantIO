import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import { createSecretToken } from "../util/SecretToken.js";

// Definición de la función Signup para manejar el registro de nuevos usuarios
export const Signup = async (req, res, next) => {
  try {
    // Desgranamos la información recibidida y autocompletamos el resto de campos
    const { email, password, name, lastName, phone } = req.body;
    const newUser = {
      email,
      password,
      name,
      lastName,
      phone,
      role: "empleado",
      bornDate: null,
      createAt: new Date(),
      employeesNumber: null,
      hireDate: null,
      paymentDate: null,
      timeRecord: [],
      payRoll: [],
    };

    //Si el usuario ya existe, devuelvo un mensaje de error
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "El usuario ya está registrado" });
    }

    //Si el usuario no existe, encripta la contraseña y creo el nuevo usuario
    const user = await User.create(newUser);
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "Cuenta creada con éxito", success: true, user });
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Definición de la función Login para manejar el inicio de sesión de usuarios
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' }) // Error si no recibimos todos los campos
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'Usuario no encontrado o incorrecto' }) // Error si el usuario no existe
    }
    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      return res.json({ message: 'Contraseña incorrecta' })  // Error si la contraseña no coincide
    }
    // Si el usuario existe y la contraseña es correcta, se crea un token de sesión
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    // Si el usuario existe y la contraseña es correcta, se devuelve un mensaje de éxito
    res.status(201).json({
      message: "Inicio de sesión correcto",
      success: true,
      // No incluimos la contraseña en la respuesta para mayor seguridad
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        employeesNumber: user.employeesNumber,
        hireDate: user.hireDate,
        paymentDate: user.paymentDate,
        bornDate: user.bornDate,
      },
    });
    next();
  } catch (error) {
    // Si ocurre un error inesperado, se captura y se devuelve un mensaje de error
    console.error("Ha ocurrido un error inesperado, inténtalo de nuevo");
  }
}