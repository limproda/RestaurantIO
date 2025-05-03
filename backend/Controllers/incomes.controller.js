import Income from "../Models/IncomeModel.js";

// Obtenemos todos los ingresos
export const getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find(); // Extraemos todos los ingresos
    res.json({ success: true, incomes }); // Devolvemos los ingresos en formato array dentro del JSON
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error de backend al cargar los ingresos" }); // Devolvemos el error si lo hubiese
  }
};

// Creamos un nuevo ingreso
export const createIncome = async (req, res) => {
  try {
    const newIncome = await Income.create(req.body);
    res.status(201).json({
      success: true,
      message: "Ingreso creado con éxito",
      income: newIncome,
    }); // Devolvemos el objeto creato con el mensaje
  } catch (err) {
    res.status(400).json({ message: "Ha habido un error creando el ingreso" }); // Devolvemos el error si lo hubiese
  }
};

// Obtenemos toda la información del ingreso a través del ID
export const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id); // Buscamos el ingreso
    if (!income)
      return res
        .status(404)
        .json({ success: false, message: "Ingreso no encontrado" }); // Si no se encuentra, mandamos error
    res.json({ success: true, income }); // Devolvemos el ingreso
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error al encontrar el ingreso" }); // En caso de error, lo notificamos
  }
};

// Actualizamos la información del ingreso a través del ID
export const updateIncome = async (req, res) => {
  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Si no hay ingreso, se notifica el error
    if (!updatedIncome)
      return res
        .status(404)
        .json({ success: false, message: "Ingreso no encontrado" }); //
    res.json({
      success: true,
      message: "Ingreso actualizado",
      income: updatedIncome,
    }); // En caso de éxito, devolvemos el ingreso actualizado al frontend
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar el ingreso" }); // Mensaje en caso de error
  }
};

// Borramos el ingreso a través de su ID
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id); // Buscamos el ingreso y se elimina
    if (!income)
      return res
        .status(404)
        .json({ success: false, message: "Ingreso no encontrado" }); // Mensaje de error
    res.json({ success: true, message: "Ingreso eliminado" }); // Mensaje en caso de éxito
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar el gasto " }); // Mensaje de error
  }
};
