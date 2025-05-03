import { useState, useEffect, useCallback } from "react";
import {
  getAllTransactions,
  getTransactionsSummary,
  deleteIncome as apiDeleteIncome,
  deleteExpense as apiDeleteExpense,
} from "./transactionsApi";
import { useNotification } from "../../components/NotificationProvider";

// Hook para gestionar la lógica de las transacciones
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]); // Listado de transacciones
  const [summary, setSummary] = useState(null); // Estado para el resumen
  const [loading, setLoading] = useState(true); // Estado de carga
  const { notify } = useNotification(); // Notificaciones

  // Carga inicial de ingresos y gastos
  useEffect(() => {
    setLoading(true); // Activamos el estado de carga
    getAllTransactions()
      .then((res) => {
        if (res.data.success) {
          setTransactions(res.data.transactions); // Guardamos los datos recibidos
        } else {
          notify("error", res.data.message || "Error cargando transacciones");
        }
      })
      .catch((err) => {
        notify("error", "Error cargando transacciones"); // Indicamos el caso del error
      })
      .finally(() => {
        setLoading(false); // Se desactiva el componente de carga
        getTransactionsSummary() // Obtenemos el resumen
          .then((res) => setSummary(res.data.summary))
          .catch(() =>
            notify("error", "Error cargando resumen de transacciones")
          );
      });
  }, [notify]);

  // Borrar transacción
  const deleteTransaction = useCallback(
    async (id, type) => {
      try {
        if (type === "ingreso") {
          await apiDeleteIncome(id); // si es un ingreso, lo dirigimos a su correspondiente api
        } else {
          await apiDeleteExpense(id); // si es un gasto, lo dirigimos a su correspondiente api
        }
        notify("success", "Transacción eliminada con éxito");
        setTransactions((prev) => prev.filter((t) => t._id !== id)); // Actualizamos el local, eliminando el elemento con el id correspondiente
        const res = await getTransactionsSummary(); // Refrescamos las tarjetas con el resumen después de borrar
        setSummary(res.data.summary); 
      } catch (err) {
        notify("error", "Ha habido un error"); // Mensaje de error si algo falla
      }
    },
    [notify]
  );

  return {
    loading,
    transactions,
    summary,
    getAllTransactions,
    deleteTransaction,
  };
};
