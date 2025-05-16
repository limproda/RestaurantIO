import axios from "axios";
import { API_URL } from "../../config/config";

// Obtener todas las nóminas
export const getAllPayrolls = () =>
  axios.get(`${API_URL}/payrolls`, { withCredentials: true })
       .then(res => res.data);

// Obtener una nómina por ID
export const getPayrollById = id =>
  axios.get(`${API_URL}/payrolls/${id}`, { withCredentials: true })
       .then(res => res.data);

// Obtener nóminas por empleado
export const getPayrollsByEmployee = employeeId =>
  axios.get(`${API_URL}/payrolls/employee/${employeeId}`, { withCredentials: true })
       .then(res => res.data);

// Crear una nueva nómina
export const createPayroll = ({ userId, month, year, fileUrl }) =>
  axios.post(
    `${API_URL}/payrolls`,
    { userId, month, year, fileUrl },
    { withCredentials: true }
  ).then(res => res.data);

// Eliminar una nómina
export const deletePayroll = id =>
  axios.delete(`${API_URL}/payrolls/${id}`, { withCredentials: true })
       .then(res => res.data);



       

       