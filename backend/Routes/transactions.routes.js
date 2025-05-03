import { Router } from "express";
import {
  userVerification,
  verifyAdmin,
} from "../Middlewares/auth.middleware.js";
import {
  getAllIncomes,
  createIncome,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from "../Controllers/incomes.controller.js";
import {
  getAllExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../Controllers/expenses.controller.js";
import {
  getAllTransactions,
  getTransactionsSummary,
} from "../Controllers/transactions.controller.js";

const router = Router(); // Creamos el router de express

// Verificamos que el usuario tenga un JWT válido y que tenga rol de administrador
router.use(userVerification);
router.use(verifyAdmin);

// RUTAS DE INGRESOS
router.get("/incomes", getAllIncomes); // GET - Devolvemos un array con todos los ingresos
router.post("/incomes", createIncome); // POST - Creamos un nuevo ingreso
router.get("/incomes/:id", getIncomeById); // GET - Devolvemos un ingreso gracias a su ID
router.patch("/incomes/:id", updateIncome); // PATCH - Actualizamos el ingreso gracias a su ID
router.delete("/incomes/:id", deleteIncome); // DELETE - Borramos un ingreso a través del ID

// RUTAS DE GASTOS
router.get("/expenses", getAllExpenses); // GET - Devolvemos un array con todos los gastos
router.post("/expenses", createExpense); // POST - Creamos un nuevo gasto
router.get("/expenses/:id", getExpenseById); // GET - Devolvemos un gasto a través de su ID
router.patch("/expenses/:id", updateExpense); // PATCH - Actualizamos un gasto a través de su ID
router.delete("/expenses/:id", deleteExpense); // DELETE - Borramos un gasto a través de su ID

// RUTAS DE TRANSACCIONES
router.get("/", getAllTransactions);
router.get("/summary", getTransactionsSummary);

export default router;
