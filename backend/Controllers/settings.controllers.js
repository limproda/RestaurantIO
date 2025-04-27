import User from "../Models/UserModel.js"; // Importamos el modelo de usuario

// Obtenemos el perfil autenticado del usuario
export const getProfile = async (req, res) => {
  res.json(req.user);
};

// Actualizamos el perfil
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password"); // Obtenemos usuario con contraseña
    if (!user) {
      return res.status(404).json({ message: "Perfil no encontrado" }); // Si no existe, mandamos el error y status de 404
    }

    Object.assign(user, req.body); // Actualizamos los campos
    const updated = await user.save(); // Guardamos cambios

    const obj = updated.toObject(); // Lo convertimos en objeto
    delete obj.password; // Eliminamos la contraseña

    res.json({ success: true, message: "Perfil actualizado", user: obj }); // Devolvemos el usuario actualizado sin la contraseña
  } catch (err) {
    console.error(err); // Mensaje de error en el log
    res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};
