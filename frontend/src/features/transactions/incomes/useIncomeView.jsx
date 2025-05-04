import { useState, useEffect, useCallback } from "react";
import { getIncomeById } from "../transactionsApi";
import { useNotification } from "../../../components/NotificationProvider";

export function useIncomeView(id) {
  const [income, setIncome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notify } = useNotification();

  const loadIncome = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getIncomeById(id);
      setIncome(res.data.income);
    } catch (err) {
      setError(err);
      notify("error", "Error al cargar datos del ingreso");
    } finally {
      setLoading(false);
    }
  }, [id, notify]);

  useEffect(() => {
    loadIncome();
  }, [loadIncome]);

  return {
    income,
    loading,
    error
  };
} 