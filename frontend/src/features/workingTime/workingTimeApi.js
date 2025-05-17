import axios from "axios"
import { API_URL } from "../../config/config"
 
// Obtenemos las horas trabajadas por el empleado según el día
export const getShifts = async () => {
    try {
        const response = await axios.get(`${API_URL}/punches/working-time`, { 
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error en getShifts:', error);
        throw error;
    }
}

// Resumen diario (fecha + horas)
export const getDailyHoursByEmployee = (employeeId) =>
    axios
      .get(`${API_URL}/punches/employee/${employeeId}/daily`, {
        withCredentials: true,
      })
      .then((r) => r.data);
  