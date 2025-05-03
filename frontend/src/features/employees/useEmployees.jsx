import { useState, useEffect, useCallback } from "react";
import {
  getEmployees,
  deleteEmployee as apiDeleteEmployee,
} from "./employeesApi";
import { useNotification } from "../../components/NotificationProvider";

// Hook para gestionar la lógica de la lista de empleados
export const useEmployees = () => {
  const [employees, setEmployees] = useState([]); // Lista de empleados
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [error, setError] = useState(null); // Estado de error
  const { notify } = useNotification(); // Mostrar notificaciones

  // Carga de empleados al montar el componente
  useEffect(() => {
    setLoading(true);
    getEmployees()
      .then((res) => {
        if (res.data.success) {
          setEmployees(res.data.employees); // Guardamos los datos recibidos
        } else {
          notify("error", res.data.message || "Error cargando empleados");
          setError(new Error(res.data.message));
        }
      })
      .catch((err) => {
        setError(err); 
        notify("error", "Error cargando empleados"); // Indicamos el caso del error
      })
      .finally(() => setLoading(false)); // Se desactiva el componente de carga
  }, []);

  // Función para borrar a un empleado y actualizar la lista
  const deleteEmployee = useCallback(
    async (id) => {
      try {
        const res = await apiDeleteEmployee(id); // Operación de borrado
        const { success, message } = res.data;

        if (success) {
          notify("success", message || "Empleado borrado correctamente");
          setEmployees((emp) => emp.filter((e) => e._id !== id)); //quitamos de la lista al borrado
        } else {
          notify("error", message || "No se pudo borrar al empleado");
        }
      } catch (err) {
        const backendMsg = err.response?.data?.message ?? "Error al borrar empleado";
        notify("error", backendMsg);
      }
    }, [notify]
  );

  // Se devuelven los diferentes estados y la función de borrado
  return { employees, loading, error, deleteEmployee };
};
