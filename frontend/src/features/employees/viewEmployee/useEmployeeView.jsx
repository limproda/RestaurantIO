import { useState, useEffect, useCallback } from "react";
import { getEmployeeById } from "../employeesApi";
import { useNotification } from "../../../components/NotificationProvider";

export function useEmployeeView(id) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notify } = useNotification();

  const loadEmployee = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployeeById(id);
      setEmployee(res.data.user);
    } catch (err) {
      setError(err);
      notify("error", "Error al cargar datos del empleado");
    } finally {
      setLoading(false);
    }
  }, [id, notify]);

  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  return {
    employee,
    loading,
    error
  };
} 