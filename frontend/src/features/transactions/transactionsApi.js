import axios from "axios";
import { TRANS_URL } from "../../config/config"; // URL de las transacciones

// GASTOS
// Obtenemos todos los gastos
export const getAllExpenses = () => {
  return axios.get(`${TRANS_URL}/expenses`, { withCredentials: true });
};

// Creamos un nuevo gasto
export const createExpense = (data) => {
  return axios.post(`${TRANS_URL}/expenses`, data, { withCredentials: true });
};

// Obtenemos el gasto por ID
export const getExpenseById = (id) => {
  return axios.get(`${TRANS_URL}/expenses/${id}`, { withCredentials: true });
};

// Actualizamos el gasto por ID
export const updateExpense = (id, data) => {
  return axios.patch(`${TRANS_URL}/expenses/${id}`, data, {
    withCredentials: true,
  });
};

// Eliminamos un gasto por ID
export const deleteExpense = (id) => {
  return axios.delete(`${TRANS_URL}/expenses/${id}`, { withCredentials: true });
};

// INGRESOS
// Obtenemos todos los ingresos
export const getAllIncomes = () => {
  return axios.get(`${TRANS_URL}/incomes`, { withCredentials: true });
};

// Creamos un nuevo ingreso
export const createIncome = (data) => {
  return axios.post(`${TRANS_URL}/incomes`, data, { withCredentials: true });
};

// Obtenemos un ingreso por ID
export const getIncomeById = (id) => {
  return axios.get(`${TRANS_URL}/incomes/${id}`, { withCredentials: true });
};

// Eliminamos un ingreso por ID
export const deleteIncome = (id) => {
  return axios.delete(`${TRANS_URL}/incomes/${id}`, { withCredentials: true });
};

// Actualizamos un ingreso por ID
export const updateIncome = (id, data) => {
  return axios.patch(`${TRANS_URL}/incomes/${id}`, data, {
    withCredentials: true,
  });
};

// Obtener todos las transacciones
export const getAllTransactions = () => {
  return axios.get(`${TRANS_URL}`, { withCredentials: true });
};

// Obtener resumen de transacciones

export const getTransactionsSummary = () => {
  return axios.get(`${TRANS_URL}/summary`, { withCredentials: true });
};
