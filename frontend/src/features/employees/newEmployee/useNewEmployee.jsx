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
          setSubmitting(false);
          return;
        }
        if (employee.password !== employee.confirmPassword) { // Ambas contraseñas deben coincidir
          notify("error", "Las contraseñas no coinciden");
          setSubmitting(false);
          return;
        }
      }

      try {
        await createEmployee(employee);
        notify("success", "Empleado creado correctamente");
        navigate("/admin/employees");
      } catch (err) {
        console.error(err);
        notify("error", "Error al crear empleado");
        setSubmitting(false);
      }
    },
    [employee, navigate, notify]
  );

  return {
    employee,
    submitting,
    handleFieldChange,
    handleDateChange,
    handleSubmit,
  };
}
