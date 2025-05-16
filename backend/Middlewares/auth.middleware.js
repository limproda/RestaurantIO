import {} from "dotenv/config";
import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";

// Definición de la función userVerification para verificar el token del usuario
export const userVerification = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "No se ha recibido token" }); // Error de token no recibido
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
      if (err) {
        return res
          .status(401)
          .json({ status: false, message: "Token inválido" }); // Error de token inválido
      }

      const user = await User.findById(data.id);
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "Usuario no encontrado" }); // Error de usuario no encontrado
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Error en userVerification middleware:", error);
    res
      .status(500)
      .json({ status: false, message: "Error interno del servidor" }); // Error interno del servidor
  }
};

// Función para verificar que el usuario es administrador, en caso contrario, denegamos el acceso
export function verifyAdmin(req, res, next) {
  if (req.user.role.toLowerCase() !== "administrador") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
}

// Función para verificar que el usuario o es administrador o es el dueño. Se usa en funciones compartidas
export const verifyAdminOrOwner = (req, res, next) => {
  const { role, id: userId } = req.user;
  const { employeeId } = req.params;

  // Si es admin, se continúa
  if (role.toLowerCase() == "administrador") return next();

  // Si es usuario es él mismo, es decir, el empleado, se continúa
  if (userId === employeeId) return next();

  // Si no, prohibido
  return res.status(403).json({
    success: false,
    message: "No tienes permisos para ver estas nóminas",
  });
};
