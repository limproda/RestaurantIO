import { useState, useEffect, useCallback } from "react";
import { getExpenseById } from "../transactionsApi";
import { useNotification } from "../../../components/NotificationProvider";

export function useExpenseView(id) {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notify } = useNotification();

  const loadExpense = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getExpenseById(id);
      setExpense(res.data.expense);
    } catch (err) {
      setError(err);
      notify("error", "Error al cargar datos del gasto");
    } finally {
      setLoading(false);
    }
  }, [id, notify]);

  useEffect(() => {
    loadExpense();
  }, [loadExpense]);

  return {
    expense,
    loading,
    error
  };
} 