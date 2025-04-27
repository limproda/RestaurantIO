import User from "../Models/UserModel.js";

// Buscamos a todos los usuarios con role === "empleado"
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "empleado" });
    res.json(employees); // Devolvemos el array de empleados como JSON
  } catch (err) {
    res.status(500).json({ message: "Error al cargar a los empleados" }); // Si hay un error, devolvemos como 500
  }
};

// Obtenemos la información del empleado a través del ID
export const getEmployeeById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Buscamos al usuario en la base de datos gracias al ID recibido
    if (!user)
      return res.status(404).json({ message: "Empleado no encontrado" });
    res.json(user); // Si se encuentra, se devuelve
  } catch (err) {
    res.status(500).json({ message: "Error al obtener empleado" });
  }
};

// Creación de un nuevo empleado
export const createEmployee = async (req, res) => {
  try {
    const newUser = await User.create(req.body); // Creamos un nuevo usuario con los datos recibidos
    res
      .status(201)
      .json({ success: true, message: "Empleado creado", user: newUser }); // Mensaje de éxito si ha sido todo correcto
  } catch (err) {
    res.status(400).json({ message: err.message }); // Mensaje de error si ha habido algún fallo
  }
};

// Actualización de los datos de un empleado
export const updateEmployee = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("+password"); // Importante, incluir password para que el hook pre("save") lo detecte
    if (!user) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    Object.assign(user, req.body); // Assignamos los campos recibidos

    const updatedUser = await user.save(); // Forzamos el .save(). De esa manera la contraseña se encripta

    // Se envía el usuario actualizado
    res.json({
      success: true,
      message: "Empleado actualizado",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar empleado" }); // Mensaje de error
  }
};

// Borrado de un usuario
export const deleteEmployee = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Se busca con el ID
    if (!user)
      return res.status(404).json({ message: "Empleado no encontrado" }); // Mensaje de error si no se encuentra 
    res.json({ success: true, message: "Empleado eliminado" }); // Mensaje de éxito
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar empleado" }); // Mensaje que engloba el resto de errores
  }
};
