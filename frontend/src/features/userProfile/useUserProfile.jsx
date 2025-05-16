import { useState, useEffect, useCallback, useContext } from "react";
import { getCurrentProfile, updateCurrentProfile } from "./userProfileApi.js";
import { useNotification } from "../../components/NotificationProvider";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRole } from "../role/useRole.js";
import { uploadFile, deleteFile } from "../../lib/firebase.js";

// Hook para gestionar datos del perfil de usuario
export function useUserProfile() {
  const { notify } = useNotification();
  const { user: ctxUser, setUser: setCtxUser } = useContext(AuthContext); // Brinda contexto del usuario
  const navigate = useNavigate();
  const { isAdmin } = useRole(); // Determina si el usuario es administrador o no

  const [profile, setProfile]     = useState(ctxUser);     // Datos del perfil
  const [loading, setLoading]     = useState(!ctxUser);    // Componente de carga
  const [submitting, setSubmitting] = useState(false);     // Estado de envío de la información

  // Estados para manejar la nueva imagen sin subirla inmediatamente
  const [newProfileFile, setNewProfileFile]     = useState(null);
  const [newProfilePreview, setNewProfilePreview] = useState(null);

  // Helper: extrae la ruta interna de Firebase Storage desde una URL pública
  const extractStoragePath = (fileUrl) => {
    try {
      const parts = new URL(fileUrl).pathname.split("/o/");
      if (parts.length < 2 || !parts[1]) return null;
      return decodeURIComponent(parts[1]);
    } catch {
      return null;
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getCurrentProfile();    // Obtenemos la información del usuario
      setProfile(data);                              // Guardamos los datos recibidos del backend
      setCtxUser(data);                              // Sincronizamos el contexto
    } catch {
      notify("error", "No se pudo cargar tu perfil");
    } finally {
      setLoading(false);
    }
  }, [notify, setCtxUser]);

  // Al montar o cambiar ctxUser, recarga si faltan datos
  useEffect(() => {
    if (!ctxUser) load();
  }, [ctxUser, load]);

  // Handler para el cambio de la foto de perfil, de manera provisional
  const handleProfilePicChange = (event) => {
    const file = event.target.files?.[0]; // Se carga el archivo
    if (!file) return;
    setNewProfileFile(file); // Se establece el archivo
    setNewProfilePreview(URL.createObjectURL(file)); // Se muestra de manera provisional y se crea una URL provisional
  };

  // Limpia el estado de nueva foto al guardar o cancelar
  const clearNewProfile = () => {
    if (newProfilePreview) URL.revokeObjectURL(newProfilePreview); // Se limpia la URL provisional para liberar memoria
    setNewProfileFile(null); // Se borra el fichero, ya que ya está subido
    setNewProfilePreview(null); // Se limpia el preview de la foto
  };

  // Handlers para los campos (fields) y fechas
  const handleFieldChange = ({ target: { name, value } }) =>
    setProfile((p) => ({ ...p, [name]: value }));

  const handleDateChange = (field) => (date) =>
    setProfile((p) => ({ ...p, [field]: date ? date.toISOString() : null }));

  // Envío de formulario
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        // Preparamos payload a enviar
        let updated = { ...profile };

        // Si hay nueva imagen pendiente, procesar borrado y subida
        if (newProfileFile) {
          // Borramos imágen antigua sin romper el flujo
          if (profile.profilePictureUrl) {
            const oldPath = extractStoragePath(profile.profilePictureUrl);
            if (oldPath) {
              await deleteFile(oldPath).catch((err) =>
                console.warn("No se pudo borrar antigua:", err)
              );
            }
          }
          // Subimos la nueva
          const ext = newProfileFile.name.split(".").pop();
          const storagePath = `profilePictures/${profile.id}/photo_${Date.now()}.${ext}`;
          const downloadURL = await uploadFile(newProfileFile, storagePath);
          updated.profilePictureUrl = downloadURL;
        }

        // Actualizamos en el backend con el objeto 'updated'
        const { data } = await updateCurrentProfile(updated);
        notify("success", "Perfil actualizado");
        setProfile(data.user);
        setCtxUser((prev) => ({ ...prev, ...data.user }));
        clearNewProfile();

        isAdmin
          ? navigate("/admin/dashboard")
          : navigate("/employee/dashboard");
      } catch {
        notify("error", "Error al guardar tu perfil"); // Alerta en caso de error
      } finally {
        setSubmitting(false);
      }
    },
    [newProfileFile, profile, notify, setCtxUser, isAdmin, navigate]
  );

  // Devolvemos los estados y los handlers del componente
  return {
    profile,
    loading,
    submitting,
    handleFieldChange,
    handleDateChange,
    handleSubmit,
    handleProfilePicChange,
    clearNewProfile,
    newProfilePreview,
  };
}