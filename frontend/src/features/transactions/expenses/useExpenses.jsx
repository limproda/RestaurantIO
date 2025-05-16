import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../transactionsApi";
import { useNotification } from "../../../components/NotificationProvider";

// Hook personalizado para gestionar gastos (crear, leer, actualizar, eliminar)
export default function useExpenses() {
  // Obtenemos el parámetro 'id' de la ruta (si existe)
  const { id } = useParams();
  // Hook de navegación para redirigir al usuario
  const navigate = useNavigate();
  // Función para mostrar notificaciones (éxito/error)
  const { notify } = useNotification();

  // Estado inicial del gasto: campos vacíos y fecha por defecto en ISO string
  const [expense, setExpense] = useState({
    id: null,
    amount: "",
    date: new Date().toISOString(),
    concept: "",
    category: "",
    description: "",
    reference: "",
    deductible: false,
    supplier: "",
  });

  // Indicador de carga: true si estamos obteniendo un gasto existente (id definido)
  const [loading, setLoading] = useState(Boolean(id));
  // Indicador de envío: true mientras creamos/actualizamos/borramos
  const [submitting, setSubmitting] = useState(false);

  // Función para cargar los datos de un gasto existente
  const loadExpense = useCallback(async () => {
    setLoading(true); // arrancamos spinner de carga
    try {
      const res = await getExpenseById(id);
      // Ajustamos dependiendo de si la API devuelve { expense } o directamente datos
      const inc = res.data.expense ?? res.data;
      // Actualizamos estado con datos recibidos
      setExpense({
        id: inc._id || inc.id,
        amount: inc.amount,
        date: inc.date,
        concept: inc.concept,
        category: inc.category,
        description: inc.description,
        reference: inc.reference,
        deductible: inc.deductible,
        supplier: inc.supplier,
      });
    } catch (err) {
      notify("error", "Error al cargar datos del gasto"); // mostramos error
    } finally {
      setLoading(false); // detenemos spinner
    }
  }, [id, notify]);

  // Ejecutamos carga al montar si existe 'id'
  useEffect(() => {
    if (id) {
      loadExpense();
    }
  }, [id, loadExpense]);

  // Manejador para cambios en campos de formulario (input, select, etc.)
  const handleFieldChange = ({ target: { name, value } }) =>
    setExpense((prev) => ({ ...prev, [name]: value }));

  // Manejador para cambios de fecha (DatePicker)
  const handleDateChange = (field) => (date) =>
    setExpense((prev) => ({
      ...prev,
      [field]: date ? date.toISOString() : null,
    }));

  // Función para crear o actualizar un gasto
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true); // activamos indicador de envío

      try {
        let res;
        if (expense.id) {
          // Si existe id, actualizamos
          res = await updateExpense(expense.id, {
            amount: expense.amount,
            date: expense.date,
            concept: expense.concept,
            category: expense.category,
            description: expense.description,
            reference: expense.reference,
            deductible: expense.deductible,
            supplier: expense.supplier,
          });
        } else {
          // Si no hay id, creamos nuevo gasto
          res = await createExpense(expense);
          notify("success", res.data.message || "Gasto añadido con éxito");
          navigate(-1); // redirigimos a la página anterior
          return;
        }

        const { success, message } = res.data;
        if (success) {
          notify("success", message || "Gasto actualizado correctamente");
          navigate(-1);
        } else {
          notify("error", message || "No se pudo actualizar el gasto");
        }
      } catch (err) {
        // Capturamos errores de la API y mostramos mensaje apropiado
        const msg =
          err.response?.data?.message ??
          (expense.id
            ? "Error al actualizar el gasto"
            : "Error al crear el gasto");
        notify("error", msg);
      } finally {
        setSubmitting(false); // desactivamos indicador de envío
      }
    },
    [expense, navigate, notify]
  );

  // Función para eliminar un gasto existente
  const handleDelete = useCallback(async () => {
    if (!expense.id) return; // si no hay id, no hacemos nada
    setSubmitting(true); // activamos indicador de envío
    try {
      const res = await deleteExpense(expense.id);
      const { success, message } = res.data;
      if (success) {
        notify("success", message || "Ingreso eliminado correctamente");
        navigate(-1);
      } else {
        notify("error", message || "No se pudo eliminar el gasto");
      }
    } catch (err) {
      const msg = err.response?.data?.message ?? "Error al eliminar el gasto";
      notify("error", msg);
    } finally {
      setSubmitting(false); // detenemos indicador de envío
    }
  }, [expense.id, navigate, notify]);

  // Exponemos los estados y manejadores al componente que use este hook
  return {
    expense,
    loading,
    submitting,
    handleFieldChange,
    handleDateChange,
    handleSubmit,
    handleDelete,
  };
}
