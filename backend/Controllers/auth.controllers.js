import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import { createSecretToken } from "../util/token.util.js";

// Definición de la función Signup para manejar el registro de nuevos usuarios
export const Signup = async (req, res, next) => {
  try {
    // Desgranamos la información recibidida y autocompletamos el resto de campos
    const { email, password, name, lastName, phone } = req.body;
    const newUser = {
      email,
      password, // En este punto la contraseña ya está encriptada
      name,
      lastName,
      phone,
      role: "empleado",
      bornDate: null,
      createAt: new Date(),
      employeesNumber: null,
      hireDate: null,
      paymentDate: null,
      profilePictureUrl: null,
      timeRecord: [],
      payRoll: [],
    };

    // Si el usuario ya existe, devuelve un mensaje de error
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "El usuario ya está registrado" });
    }

    // Si el usuario no existe, creamos el nuevo usuario
    const savedUser = await User.create(newUser);
    const token = createSecretToken(savedUser._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      path: "/",
    });

    // Preparamos el objeto pero sin contraseña
    const userObj = savedUser.toObject();
    delete userObj.password;

    return res
      .status(201)
      .json({ success: true, message: "Cuenta creada con éxito", user: userObj });
  } catch (error) {
    console.error("Error al crear la cuenta: ", error);
    next(error);
  }
};

// Definición de la función Login para manejar el inicio de sesión de usuarios
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Todos los campos son requeridos" }); // Error si no recibimos todos los campos
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Usuario no encontrado o incorrecto" }); // Error si el usuario no existe
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res
        .status(401)
        .json({ success: false, message: "Contraseña incorrecta" }); // Error si la contraseña no coincide
    }
    // Si el usuario existe y la contraseña es correcta, se crea un token de sesión
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      path: "/",
    });

    // Preparamos el objeto pero sin contraseña
    const userObj = user.toObject();
    delete userObj.password;

    // Si el usuario existe y la contraseña es correcta, se devuelve un mensaje de éxito
    return res.status(201).json({
      success: true,
      message: "Inicio de sesión correcto",
      user: userObj, // Incluimos todo excepto la contraseña
    });
  } catch (error) {
    // Si ocurre un error inesperado, se captura y se devuelve un mensaje de error
    console.error("Ha ocurrido un error inesperado, inténtalo de nuevo: ", error.message);
    next(error);
  }
};