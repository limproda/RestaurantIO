import { useState, useEffect } from "react";
import { getShifts } from "./workingTimeApi";
import { useAuth } from "../../contexts/AuthContext";
import { toDateES } from "../../utils/dateUtils";

export function useWorkingTime() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Llamada a la API para obtener los turnos trabajados del usuario
  const getWorkingTime = async () => {
    try {
      setLoading(true); // Indicamos que estamos cargando
      const data = await getShifts(); // Obtenemos los turnos del usuario
      if (!data?.success)
        throw new Error(data?.message || "Error al obtener datos");

      // Aseguramos que venga un array
      if (!Array.isArray(data.daily))
        throw new Error("Formato de datos inválido");

      // Mapeamos los datos para adaptarlos a nuestro formato
      setShifts(
        data.daily.map((s, i) => ({
          ...s,
          id: i,
          date: s.date.split("-").reverse().join("/"), // Convertimos la fecha al formato DD/MM/YYYY
          hours: Number(s.hours) || 0,
          minutes: Number(s.minutes) || 0,
        }))
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getWorkingTime(); 
    }
  }, [user]);

  return { shifts, loading };
}
