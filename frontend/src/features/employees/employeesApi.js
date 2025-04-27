import axios from "axios";
import { API_URL } from "../../config/config";

// Obtenemos todos los empleados
export const getEmployees = () => {
  return axios.get(`${API_URL}/employees`, { withCredentials: true });
};

// Obtenemos un empleado por ID
export const getEmployeeById = (id) => {
  return axios.get(`${API_URL}/employees/${id}`, { withCredentials: true });
};

// Actualizamos datos de un empleado
export const patchEmployee = (id, data) => {
  return axios.patch(`${API_URL}/employees/${id}`, data, {
    withCredentials: true,
  });
};

// Eliminamos un empleado por ID
export const deleteEmployee = (id) => {
  return axios.delete(`${API_URL}/employees/${id}`, { withCredentials: true });
};

// Creamos un nuevo empleado
export const createEmployee = (data) => {
  return axios.post(`${API_URL}/employees`, data, {
    withCredentials: true,
  });
};