import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../components/NotificationProvider";
import { signup } from "./authApi.js";

// Definimos el valor inicial 
const initialInputValue = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  lastName: "",
  phone: "",
};

export const useSignup = () => {
  // Hooks de React y definición de variables
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [submitting, setSubmitting] = useState(false); // Se usa para bloquear el formulario mientras se envía la información al backend
  const [inputValue, setInputValue] = useState(initialInputValue);

  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Función para manejar el cambio de los inputs
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  // Funciones que alternan la visibilidad de la contraseña
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  // Previene el comportamiento por defecto al mantener pulsado el botón del ícono
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();     // Evitamos el reload
    setSubmitting(true) 
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      setSubmitting(false);       // Si hay campos inválidos, muestra los tooltips nativos
      return;                      // Salimos sin llamar a preventDefault ni a la API
    }

    // Verifica si las contraseñas coinciden
    if (inputValue.password !== inputValue.confirmPassword) {
      notify("error", "Las contraseñas no coinciden");
      setSubmitting(false);
      return;
    }

    // Envío de la solicitud POST a la API para iniciar sesión
    try {
      const res = await signup(inputValue);
      const { success, message } = res.data;

      // Si la respuesta es exitosa, se muestra la notificación de éxito y se redirige al usuario a "/"
      if (success) {
        notify("success", message);
        setTimeout(() => navigate("/"), 1500);
      } else {
        // Si la creación falla, muestra la notificación de error
        notify("error", message);
      }
    } catch (error) {
      // Si ocurre algún error, muestra la notificación de error
      const errorMessage = error.response?.data?.message || "Error inesperado";
      notify("error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    inputValue,
    showPassword,
    showConfirmPassword,
    handleOnChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleMouseDownPassword,
    handleMouseUpPassword,
    handleSubmit,
    submitting,
  };
};
