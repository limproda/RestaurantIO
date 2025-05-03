import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createIncome,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from "../transactionsApi";
import { useNotification } from "../../../components/NotificationProvider";

// Hook personalizado para gestionar ingresos (crear, leer, actualizar, eliminar)
export default function useIncomes() {
  // Obtenemos el parámetro 'id' de la ruta (si existe) para cargar o editar
  const { id } = useParams();
  // Hook de React Router para navegar entre rutas
  const navigate = useNavigate();
  // Función para mostrar notificaciones de éxito/error al usuario
  const { notify } = useNotification();

  // Estado inicial del ingreso: campos vacíos y fecha por defecto en ISO string
  const [income, setIncome] = useState({
    id: null,
    amount: "",
    date: new Date().toISOString(),
    concept: "",
    category: "",
    description: "",
    reference: "",
  });

  // Indicador de carga: true si estamos editando (existe id)
  const [loading, setLoading] = useState(Boolean(id));
  // Indicador de envío: true mientras se procesa creación/actualización/eliminación
  const [submitting, setSubmitting] = useState(false);

  // Función para cargar los datos de un ingreso existente
  const loadIncome = useCallback(async () => {
    setLoading(true); // activamos spinner de carga
    try {
      const res = await getIncomeById(id);
      // Ajuste según la forma de respuesta: { income: { … } } o datos directos
      const inc = res.data.income ?? res.data;
      // Actualizamos estado con los datos obtenidos
      setIncome({
        id: inc._id || inc.id,
        amount: inc.amount,
        date: inc.date,
        concept: inc.concept,
        category: inc.category,
        description: inc.description,
        reference: inc.reference,
      });
    } catch (err) {
      // Notificamos error si falla la carga
      notify("error", "Error al cargar datos del ingreso");
    } finally {
      setLoading(false); // desactivamos spinner
    }
  }, [id, notify]);

  // Efecto para ejecutar loadIncome al montarse si hay 'id'
  useEffect(() => {
    if (id) {
      loadIncome();
    }
  }, [id, loadIncome]);

  // Manejador de cambios en campos de formulario (inputs, selects...)
  const handleFieldChange = ({ target: { name, value } }) =>
    setIncome(prev => ({ ...prev, [name]: value }));

  // Manejador para cambios de fecha desde DatePicker
  const handleDateChange = field => date =>
    setIncome(prev => ({
      ...prev,
      [field]: date ? date.toISOString() : null,
    }));

  // Función para crear o actualizar el ingreso al enviar el formulario
  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      setSubmitting(true); // activamos indicador de envío

      try {
        let res;
        if (income.id) {
          // Si existe id, actualizamos ingreso
          res = await updateIncome(income.id, {
            amount: income.amount,
            date: income.date,
            concept: income.concept,
            category: income.category,
            description: income.description,
            reference: income.reference,
          });
        } else {
          // Si no hay id, creamos nuevo ingreso
          res = await createIncome(income);
          // Notificamos éxito y redirigimos
          notify("success", res.data.message || "Ingreso añadido con éxito");
          navigate("/admin/transactions");
          return;
        }

        // Procesamos respuesta de actualización
        const { success, message } = res.data;
        if (success) {
          notify("success", message || "Ingreso actualizado correctamente");
          navigate("/admin/transactions");
        } else {
          notify("error", message || "No se pudo actualizar el ingreso");
        }
      } catch (err) {
        // Capturamos y mostramos error en creación/actualización
        const msg =
          err.response?.data?.message ??
          (income.id
            ? "Error al actualizar el ingreso"
            : "Error al crear el ingreso");
        notify("error", msg);
      } finally {
        setSubmitting(false); // desactivamos indicador de envío
      }
    },
    [income, navigate, notify]
  );

  // Función para eliminar un ingreso existente
  const handleDelete = useCallback(async () => {
    if (!income.id) return; // si no hay id, no hay nada que eliminar
    setSubmitting(true); // activamos indicador de envío
    try {
      const res = await deleteIncome(income.id);
      const { success, message } = res.data;
      if (success) {
        notify("success", message || "Ingreso eliminado correctamente");
        navigate("/admin/transactions");
      } else {
        notify("error", message || "No se pudo eliminar el ingreso");
      }
    } catch (err) {
      // Notificamos error si falla la eliminación
      const msg = err.response?.data?.message ?? "Error al eliminar el ingreso";
      notify("error", msg);
    } finally {
      setSubmitting(false); // desactivamos indicador de envío
    }
  }, [income.id, navigate, notify]);

  // Exportamos estados y funciones para usar en componentes
  return {
    income,
    loading,
    submitting,
    handleFieldChange,
    handleDateChange,
    handleSubmit,
    handleDelete,
  };
}
