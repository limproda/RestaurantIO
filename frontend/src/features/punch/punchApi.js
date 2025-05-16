import axios from "axios";
import { API_URL } from "../../config/config";

// Registra un fichaje inmediato con la hora actual
export const clockPunch = () =>
  axios.post(`${API_URL}/punches/punch`, {}, { withCredentials: true }).then((r) => r.data);

// Obtiene los fichajes de un empleado según el ID
export const getPunchesByEmployee = (employeeId) =>
  axios.get(`${API_URL}/punches/employee/${employeeId}`, { withCredentials: true }).then((r) => r.data);

// Crea un fichaje con la hora manual que se le indique
export const addPunch = (employeeId, type, timestamp) =>
  axios.post(`${API_URL}/punches`, { employeeId, type, timestamp }, { withCredentials: true }).then((r) => r.data);

// Permite actualizar la hora de un fichaje concreto
export const editPunch = (punchId, timestamp) =>
  axios.patch(`${API_URL}/punches/${punchId}`, { timestamp }, { withCredentials: true }).then((r) => r.data);

// Borra un fichaje según su ID
export const deletePunch = (punchId) =>
  axios.delete(`${API_URL}/punches/${punchId}`, { withCredentials: true }).then((r) => r.data);