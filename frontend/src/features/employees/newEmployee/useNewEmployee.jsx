import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "../employeesApi";
import { useNotification } from "../../../components/NotificationProvider";

// Hook con la lógica para la creación de un nuevo empleado
export function useNewEmployee() {
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [employee, setEmployee] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    bornDate: null,
    hireDate: null,
    paymentDay: 1,
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Cambiar campo de texto
  const handleFieldChange = ({ target: { name, value } }) =>
    setEmployee((e) => ({ ...e, [name]: value }));

  // Cambiar fecha
  const handleDateChange = (field) => (date) =>
    setEmployee((e) => ({ ...e, [field]: date ? date.toISOString() : null }));

  // Envío del formulario
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);

      // Validación de contraseñas idéntica a la de edición
      if (employee.password || employee.confirmPassword) {
        if (!employee.password) {
          notify("error", "La contraseña es requerida"); // La contraseña es obligatoria
          setSubmitting(false);
          return;
        }
        if (!employee.confirmPassword) {
          notify("error", "Confirmar contraseña es requerida");  // El campo confirmar contraseña es obligatorio
          return;
        }
        if (employee.password !== employee.confirmPassword) { // Ambas contraseñas deben coincidir
          notify("error", "Las contraseñas no coinciden");
          setSubmitting(false);
          return;
        }
      }

      try {
        const res = await createEmployee(employee);
        const { success, message } = res.data;
        if(success){
          notify("success", message || "Empleado creado correctamente");
          navigate("/admin/employees");
        } else {
          notify("error", message || "No se pudo crear el empleado");
          setSubmitting(false);
        }

      } catch (err) {
        const backendMsg = err.response?.data?.message ?? "Error al crear empleado";
        notify("error", backendMsg);
        setSubmitting(false);
      } finally {
        setSubmitting(false);
      }
    }, [employee, navigate, notify]
  );

  return {
    employee,
    submitting,
    handleFieldChange,
    handleDateChange,
    handleSubmit,
  };
}
