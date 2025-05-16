import { useState, useEffect, useCallback } from "react";
import {
  getAllPayrolls,
  createPayroll,
  deletePayroll as apiDeletePayroll,
  getPayrollsByEmployee
} from "./payrollsApi";
import { useNotification } from "../../components/NotificationProvider";
import { uploadFile } from "../../lib/firebase.js";

// Hook para gestionar todas las operaciones relacionadas con nóminas
export function usePayrolls(employeeId = null) {
  const { notify } = useNotification(); // Hook para mostrar las notificaciones
  const [payrolls, setPayrolls] = useState([]); // Array que almacena las nóminas
  const [loading, setLoading] = useState(false); // Estado que indica si se están cargando las nóminas
  const [uploading, setUploading] = useState(false); // Estado que indica si se está subiendo una nómina
  const [error, setError] = useState(null); // Estado para almacenar posibles errores

  // Función para obtener las nóminas
  const getPayrolls = useCallback(async () => {
    if (employeeId) {
      // Si hay ID de empleado, obtenemos sus nóminas específicas
      setError(null); // Reseteamos el estado de error
      setLoading(true); // Indicamos que estamos cargando
      try {
        const res = await getPayrollsByEmployee(employeeId); // Obtenemos las nóminas del empleado
        if (!res.success) throw new Error(res.message); // Si no hay éxito, lanzamos un error
        setPayrolls(
          res.payrolls.map(p => ({
            ...p,
            month: Number(p.month), // Convertimos el mes a número
            year: Number(p.year) // Convertimos el año a número
          }))
        );
      } catch (err) {
        console.error(err); // Mostramos el error en consola
        setError(err.message); // Guardamos el mensaje de error
        notify("error", "Error al obtener las nóminas del empleado"); // Notificamos al usuario
      } finally {
        setLoading(false); // Indicamos que ya no estamos cargando
      }
    } else {
      // Si no hay ID de empleado, obtenemos todas las nóminas
      setLoading(true); // Indicamos que está cargando
      try {
        const res = await getAllPayrolls(); // Obtenemos todas las nóminas
        if (!res.success) throw new Error(res.message); // Si no hay éxito, lanzamos un error
        setPayrolls(res.payrolls); // Guardamos las nóminas directamente
      } catch (err) {
        notify("error", "Error al obtener las nóminas"); // Mostramos el error
      } finally {
        setLoading(false); // Indicamos que ya no está cargando
      }
    }
  }, [employeeId, notify]);

  // Cargamos las nóminas al montar el componente
  useEffect(() => {
    getPayrolls();
  }, [getPayrolls]);

  // Función para eliminar una nómina
  const deletePayroll = useCallback(async (payrollId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta nómina? \n Esta operación no se puede deshacer.")) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await apiDeletePayroll(payrollId);
      if (!res.success) throw new Error(res.message);
      notify("success", "Nómina eliminada con éxito");
      getPayrolls();
    } catch (err) {
      notify("error", "Error al eliminar la nómina");
    } finally {
      setLoading(false);
    }
  }, [getPayrolls, notify]);

  // Función para subir una nueva nómina
  const uploadPayroll = useCallback(async ({ file, userId, month, year }) => {
    if (!file || !userId || !month || !year) {
      notify("error", "Los campos son obligatorios"); // Notificamos si hay un error
      return;
    }

    if (file.type !== "application/pdf") {
      notify("error", "Por favor, selecciona un archivo PDF"); // Sólo permitimos archivos PDF
      return;
    }

    setUploading(true); // Establecemos que se está subiendo
    try {
      const fileName = `${userId}_${Date.now()}.pdf`; // Definimos el nombre del archivo
      const path = `payrolls/${year}/${month}/${fileName}`; // Definimos la ruta

      const fileUrl = await uploadFile(file, path); // Subimos el archivo y obtenemos y guardamos su URL

      const res = await createPayroll({
        userId,
        month,
        year,
        fileUrl,
      }); // Creamos al respuesta
      if (!res.success) throw new Error(res.message);
      notify("success", "Nómina subida correctamente");
      getPayrolls(); // Obtenemos las nóminas de nuevo
      return true;
    } catch (err) {
      notify("error", "Error al subir la nómina");
      return false;
    } finally {
      setUploading(false);
    }
  }, [getPayrolls, notify]);

  // Devolvemos los estados y las funciones
  return {
    payrolls,
    loading,
    uploading,
    error,
    getPayrolls,
    deletePayroll,
    uploadPayroll,
  };
}
