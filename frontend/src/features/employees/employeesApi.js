import axios from "axios";
import { API_URL } from "../../config/config";

// Obtiene todos los empleados
export const getEmployees = () => {
  return axios.get(`${API_URL}/employees`, { withCredentials: true });
};

// Obtiene un empleado por ID
export const getEmployeeById = (id) => {
  return axios.get(`${API_URL}/employees/${id}`, { withCredentials: true });
};

// Actualiza datos de un empleado
export const patchEmployee = (id, data) => {
  return axios.patch(`${API_URL}/employees/${id}`, data, {
    withCredentials: true,
  });
};

// Elimina un empleador por ID
export const deleteEmployee = (id) => {
  return axios.delete(`${API_URL}/employees/${id}`, { withCredentials: true });
};

// Crea un nuevo empleado
export const createEmployee = (data) => {
  return axios.post(`${API_URL}/employees`, data, {
    withCredentials: true,
  });
};