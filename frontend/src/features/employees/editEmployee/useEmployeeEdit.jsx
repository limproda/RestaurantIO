import { useState, useEffect, useCallback } from "react";
import {
  deleteEmployee,
  getEmployeeById,
  patchEmployee,
} from "../employeesApi";
import { useNotification } from "../../../components/NotificationProvider";
import { useNavigate } from "react-router-dom";
import { uploadFile, deleteFile } from "../../../lib/firebase.js";

export function useEmployeeEdit(id) {
  const [employee, setEmployee] = useState(null); // Datos del empleado
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null);  // Estado de error
  const { notify } = useNotification(); // Notificaciones personalizadas
  const [submitting, setSubmitting] = useState(false);// Estado de envío
  const navigate = useNavigate(); // Permite hacer redirecciones

  // Estados para manejar la nueva imagen sin subirla inmediatamente
  const [newProfileFile, setNewProfileFile] = useState(null);
  const [newProfilePreview, setNewProfilePreview] = useState(null);

  // Función para obtener datos de un empleado con su ID
  const loadEmployee = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployeeById(id); // Obtenemos la información del backend
      setEmployee(res.data.user); // Se guarda la respuesta recibida
    } catch (err) {
      setError(err);
      notify("error", "Error al cargar datos del empleado"); // Mensaje de error
    } finally {
      setLoading(false); // Hemos terminado de cargar
    }
  }, [id, notify]);

  // Ejecutamos la carga inicial
  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  // Extraemos la ruta interna de Firebase Storage desde una URL pública
  const extractStoragePath = (fileUrl) => {
    try {
      const parts = new URL(fileUrl).pathname.split("/o/"); // Dividimos la ruta en 2
      if (parts.length < 2 || !parts[1]) return null; // Devolvemos null en caso de que no exista
      return decodeURIComponent(parts[1]); // Nos quedamos con la parte de la URL que contiene la ruta del archivo
    } catch {
      return null;
    }
  };

  // Handler para el cambio de la foto de perfil antes de la subida
  const handleProfilePicChange = (event) => {
    const file = event.target.files?.[0]; // Cargamos el fichero si lo hay
    if (!file) return; // Si no hay fichero, no hacemos nada
    setNewProfileFile(file); //Establecemos la foto de perfil
    setNewProfilePreview(URL.createObjectURL(file)); // Mostramos la nueva foto antes de la subida definitiva y la guardamos de manera de manera temporal
  };

  // Limpiamos el estado de nueva foto (tras guardar o cancelar)
  const clearNewProfile = () => {
    if (newProfilePreview) URL.revokeObjectURL(newProfilePreview); // Limpiamos memoria liberando la URL antes guardada
    setNewProfileFile(null); // Limpiamos el fichero 
    setNewProfilePreview(null); // Limpiamos la vista previa
  };

  // Handler para los cambios en los textos de los fields
  const handleFieldChange = (e) => {
    const { name, value } = e.target; 
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Handler para las fechas
  const handleDateChange = (field) => (date) => {
    setEmployee((prev) => ({
      ...prev,
      [field]: date ? date.toISOString() : null, // Podemos guardar la fecha en formato ISO
    }));
  };

  // Función para enviar los cambios al backend 
  const saveChanges = async () => {
    setLoading(true);
    try {
      let updated = { ...employee };

      // Si hay nueva imagen pendiente, procesar borrado y subida
      if (newProfileFile) {
        // Borramos la antigua sin romper el flujo
        if (employee.profilePictureUrl) {
          const oldPath = extractStoragePath(employee.profilePictureUrl);
          if (oldPath) {
            await deleteFile(oldPath).catch((err) =>
              console.warn("No se pudo borrar antigua foto:", err)
            );
          }
        }
        // Subimos la nueva foto
        const storagePath = `profilePictures/${id}/${newProfileFile.name}`;
        const downloadURL = await uploadFile(newProfileFile, storagePath);
        updated.profilePictureUrl = downloadURL;
      }

      // Guardamos en la base de datos usando el payload 'updated'
      const res = await patchEmployee(id, updated); // Guardamos en la base de datos
      const { success, message } = res.data;
      if (success) {
        setEmployee(res.data.user || updated);
        notify("success", message || "Empleado actualizado correctamente");
        clearNewProfile();
      } else {
        notify("error", message || "Error al actualizar empleado");
      }
    } catch (err) {
      const backendMsg =
        err.response?.data?.message ?? "Error al actualizar empleado";
      notify("error", backendMsg);
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
      await saveChanges();                       // Guardamos los cambios
      navigate("/admin/employees");              // Redirigimos al usuario
    } catch {
      notify("error", "Error al guardar los cambios");
      setSubmitting(false);
    }
  };

  // Manejamos el caso de cancelar: limpiamos el preview y vuelve atrás
  const handleCancel = () => {
    clearNewProfile();
    navigate(-1);
  };

  // Devolvemos los estados y los handlers
  return {
    employee,
    loading,
    error,
    newProfilePreview,
    handleFieldChange,
    handleDateChange,
    handleProfilePicChange,
    clearNewProfile,
    handleSubmit,
    handleCancel,
    submitting,
    deleteEmployee,
  };
}
