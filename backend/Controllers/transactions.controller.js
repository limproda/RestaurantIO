import Income from "../Models/IncomeModel.js";
import Expense from "../Models/ExpenseModel.js";

// Obtenemos todos los ingresos y los gastos de la base de datos
export const getAllTransactions = async (req, res, next) => {
  try {
    const incomeDocs = await Income.find().sort({ date: -1 }); // Extraremos los ingresos en orden descendente
    const expenseDocs = await Expense.find().sort({ date: -1 }); // Extraemos los gastos en ordeen descendente

    // Convertimos los documentos a objetos de tipo JSON y añadimos los virtuals
    const incomes = incomeDocs.map((doc) => doc.toObject({ virtuals: true }));
    const expenses = expenseDocs.map((doc) => doc.toObject({ virtuals: true }));

    // Unimos ambos documentos en un solo de transacciones
    const transactions = [...incomes, ...expenses];
    // Ordenamos las transacciones por fecha de forma descendente
    transactions.sort((a, b) => {
      // 1) Parsear las fechas a objetos Date
      const fechaA = new Date(a.date);
      const fechaB = new Date(b.date);

      // 2) Compararlas con if/else
      if (fechaA < fechaB) {
        return 1; // Si el return es 1, significa que la fecha es más antigua y sort la va a poner detrás
      }
      if (fechaA > fechaB) {
        return -1; // Si el return es -1, significa que la fecha es más reciente y sort la va a poner delante
      }
      return 0; // iguales
    });

    res.json({ success: true, transactions: transactions }); // Enviamos la respuesta
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener transacciones", err }); // Mensaje que engloba el resto de errores
  }
};

// Función usada para obtener un resumen de las transacciones en los últimos 30 días
export const getTransactionsSummary = async (req, res, next) => {
  // Calculamos la fecha límite
  const thirtyDays = new Date();
  thirtyDays.setDate(thirtyDays.getDate() - 30); // Calculamos la el día actual y le restamos 30 días
  try {
    // Sumamos todos los ingresos
    const [incomeAgg] = await Income.aggregate([
      { $match: { date: { $gte: thirtyDays } } }, // Filtramos por fecha mayor o igual que la indicada
      {
        $group: {
          // Agrupamos por null para sumar todos los ingresos
          _id: null, // No segmentamos la colección, agrupamos todo
          totalIncome: { $sum: "$amount" }, // Sumamos los campos amount
          countIncome: { $sum: 1 }, // Añadimos uno al contador
        },
      },
    ]);

    // Sumamos todos los gastos
    const [expenseAgg] = await Expense.aggregate([
      { $match: { date: { $gte: thirtyDays } } },
      {
        $group: {
          // Agrupamos por null para sumar todos los gastos
          _id: null, // No segmentamos la colección, agrupamos todo
          totalExpense: { $sum: "$amount" }, // Sumamos los campos amount
          countExpense: { $sum: 1 }, // Añadimos uno al contador
        },
      },
    ]);

    // Extraemos los valores de las agregaciones, si no existen, los inicializamos a 0
    const totalIncome = incomeAgg?.totalIncome || 0;
    const totalExpense = expenseAgg?.totalExpense || 0;
    const countIncome = incomeAgg?.countIncome || 0;
    const countExpense = expenseAgg?.countExpense || 0;

    // Contruimos el array del resumen
    const summaryItems = {
      Income: { total: totalIncome, count: countIncome }, // Resumen de ingresos
      Expense: { total: totalExpense, count: countExpense }, // Resumen de gastos
      Total: { total: totalIncome + totalExpense, count: countIncome + countExpense }, // Resumen de saldo neto
    };
    // Enviamos la respuesta al cliente
    res.json({
      success: true,
      summary: summaryItems,
    });
  } catch (err) {
    next(err);
  }
};
