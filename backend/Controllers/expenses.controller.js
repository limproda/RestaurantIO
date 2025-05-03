import Expense from "../Models/ExpenseModel.js";

// Obtenemos todos los gastos
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find(); // Extramoes todos los gastos
    res.json({ success: true, expenses }); // Devolvemos los ingresos en un array en el JSON
  } catch (err) {
    res.status(500).json({ success: false, message: "Error de backend al cargar los gastos" });
  }
};

// Creamos un nuevo gasto
export const createExpense = async (req, res) => {
  try {
    const newExpense = await Expense.create(req.body);
    res.status(201).json({
      success: true,
      message: "Nuevo gasto creado con éxito",
      expense: newExpense,
    }); // Devolvemos el gasto creado
  } catch (err) {
    res.status(400).json({ success: false, message: "Error de backend al crear el gasto" }); // Devolvemos el error si lo hubiese
  }
};

// Obtenemos toda la información asociada a un gasto a través del ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense)
      return res
        .status(404)
        .json({ success: false, message: "Gasto no encontrado" });
    res.json({ success: true, expense }); // Devolvemos el gasto
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error al encontrar el gasto" }); // En caso de error, lo notificamos
  }
};

// Actualizamos la información del gasto a partir del ID
export const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id, // Mandamos el id
      req.body, // Mandamos la nueva información
      { new: true, runValidators: true }); // Devolvemos el nuevo objeto, ya que por defecto devuelve el antiguo y obligamos a Mongoose a validar los datos

    // Si no hay está el gasto, mandamos el error
    if (!updatedExpense)
      return res
        .status(404)
        .json({ success: false, message: "Gasto no encontrado" });
    // Devolvemos el gasto actualizado al frontend
    res.json({
      success: true,
      message: "Gasto actualizado",
      expense: updatedExpense,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar el gasto" }); // En caso de error, mandamos un mensaje
  }
};

// Borramos el gasto a través del ID
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id); // Se busca y se elimina con el ID
    if (!expense)
      return res
        .status(404)
        .json({ success: false, message: "Gasto no encontrado" }); // Mensaje de error
    res.json({ success: true, message: "Gasto eliminado" }); // Mensaje en caso de éxito
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar el gasto" }); // Mensaje de error
  }
};
