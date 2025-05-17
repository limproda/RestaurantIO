import axios from "axios";
import { API_URL } from "../../config/config";

// Obtenemos las horas trabajadas por el empleado según el día
export const getShifts = async () => {
  try {
    const response = await axios.get(`${API_URL}/punches/working-time`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error en getShifts:", error);
    throw error;
  }
};

// Resumen mensual de mes y horas
export const getEmployeeSummary = () => {
  return axios.get(`${API_URL}/punches/summary`, {
    withCredentials: true,
  });
};
