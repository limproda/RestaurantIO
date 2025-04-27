import { useState, useEffect, useCallback } from "react";
import {
  getEmployees,
  deleteEmployee as apiDeleteEmployee,
} from "./employeesApi";
import { useNotification } from "../../components/NotificationProvider";

// Hook para gestionar la lógica de la lista de empleados
export const useEmployees = () => {
  const [employees, setEmployees] = useState([]); // Lista de empleados
  const [loading, setLoading] = useState(true);   // Estado de carga inicial  
  const [error, setError] = useState(null);       // Estado de error
  const { notify } = useNotification();           // Mostrar notificaciones

  // Carga de empleados al montar el componente
  useEffect(() => {
    getEmployees()
      .then((res) => {
        setEmployees(res.data); // Guardamos los datos recibidos
      })
      .catch((err) => {
        setError(err); // Indicamos el caso del error
        notify("error", "Error cargando empleados"); 
      })
      .finally(() => setLoading(false)); // Se desactiva el componente de carga
  }, []);

  // Función para borrar a un empleado y actualizar la lista
  const deleteEmployee = useCallback(
    async (id) => {
      try {
        await apiDeleteEmployee(id); // Operación de borrado
        notify("success", "Empleado borrado correctamente");
        setEmployees((emp) => emp.filter((e) => e._id !== id)); //quitamos de la lista al borrado
      } catch (err) {
        notify("error", "Error al borrar al empleado");
      }
    },
    [notify]
  );

  // Se devuelven los diferentes estados y la función de borrado
  return { employees, loading, error, deleteEmployee };
};
