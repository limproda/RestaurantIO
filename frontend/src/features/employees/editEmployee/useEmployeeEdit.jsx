import { useState, useEffect, useCallback } from "react";
import { deleteEmployee, getEmployeeById, patchEmployee } from "../employeesApi";
import { useNotification } from "../../../components/NotificationProvider";
import { useNavigate } from "react-router-dom";

// Hook para cargar, editar y eliminar empleados. Toda la lógica se encuentra aquí
export function useEmployeeEdit(id) {
  const [employee, setEmployee] = useState(null);        // Datos del empleado
  const [loading, setLoading]   = useState(true);        // Estado de carga
  const [error, setError]       = useState(null);        // Estado de error 
  const { notify }              = useNotification();     // Notificaciones personalizadas
  const [submitting, setSubmitting] = useState(false);   // Estado de envío
  const navigate = useNavigate()                          // Para redirecciones

  // Función para obtener datos de un empleado con su ID
  const loadEmployee = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployeeById(id); // Se pide al backend
      setEmployee(res.data);                  // Se guarda la respuesta recibida
    } catch (err) {
      setError(err);
      notify("error", "Error al cargar datos del empleado"); // Mensaje de error
    } finally {
      setLoading(false); // Hemos terminado de cargar
    }
  }, [id, notify]);

  // Ejecuta la carga inicial
  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  // Handler para los cambios en los textos de los fields
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  // Handler para las fechas
  const handleDateChange = (field) => (date) => {
    setEmployee(prev => ({
      ...prev,
      [field]: date ? date.toISOString() : null,
    }));
  };

  // Función para enviar los cambios al backend
  const saveChanges = async () => {
    setLoading(true);
    try {
      await patchEmployee(id, employee); // Guardamos en la base de datos
      notify("success", "Empleado actualizado correctamente");
    } catch (err) {
      notify("error", "Error al actualizar empleado");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handler del submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Solo validar contraseñas si el usuario ha escrito algo
    if (employee.password || employee.confirmPassword) {
      if (!employee.password) {
        notify("error", "La contraseña es requerida");
        setSubmitting(false);
        return;
      }
      if (!employee.confirmPassword) {
        notify("error", "Confirmar contraseña es requerida");
        setSubmitting(false);
        return;
      }
      if (employee.password !== employee.confirmPassword) {
        notify("error", "Las contraseñas no coinciden");
        setSubmitting(false);
        return;
      }
    }

    try {
      await saveChanges(); // Guardamos
      navigate("/admin/employees"); // Redirigimos al usuario
    } catch {
      notify("error", "Error al guardar los cambios")
      setSubmitting(false);
    }
  };

  // Devolvemos los estados y los handlers 
  return {
    employee,
    loading,
    error,
    handleFieldChange,
    handleDateChange,
    saveChanges,
    handleSubmit,
    deleteEmployee, // Función para eliminar empleados que importamos directamente de otro hook
  };
}
