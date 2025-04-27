import { useState, useEffect, useCallback, useContext } from "react";
import { getCurrentProfile, updateCurrentProfile } from "./userProfileApi.js";
import { useNotification } from "../../components/NotificationProvider";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRole } from "../role/useRole.js";

// Hook para gestionar datos del perfil de usuario
export function useUserProfile() {
  const { notify } = useNotification();
  const { user: ctxUser, setUser: setCtxUser } = useContext(AuthContext); // Brinda contexto del usuario
  const navigate = useNavigate();
  const { isAdmin } = useRole(); // Determina si el usuario es administrador o no

  const [profile, setProfile] = useState(ctxUser); // Datos del perfil
  const [loading, setLoading] = useState(!ctxUser); // Componente de carga
  const [submitting, setSubmitting] = useState(false); // Estado de envío de la información

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getCurrentProfile(); // Obtenemos la información del usuario
      setProfile(data); // Guardamos los datos recibidos del backend
      setCtxUser(data); // Sincroniazmos el contexto
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

  // Handlers para campos (fields) y fechas
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
        const { data } = await updateCurrentProfile(profile);
        notify("success", "Perfil actualizado");
        setProfile(data.user);
        setCtxUser((prev) => ({ ...prev, ...data.user }));
        isAdmin
          ? navigate("/admin/dashboard")
          : navigate("/employee/dashboard");
        // Redirige según el rol
      } catch {
        notify("error", "Error al guardar tu perfil"); // Alerta en caso de error
      } finally {
        setSubmitting(false);
      }
    },
    [profile, notify, setCtxUser, navigate]
  );

  // Devolvemos los estados y los handlers del componente
  return {
    profile,
    loading,
    submitting,
    handleFieldChange,
    handleDateChange,
    handleSubmit,
  };
}
