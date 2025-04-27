import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/config";
import { useNotification } from "../../components/NotificationProvider";

export const useSignup = () => {
  // Hooks de React y definición de variables
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    lastName: "",
    phone: "",
  });

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
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();       // Si hay campos inválidos, muestra los tooltips nativos
      return;                      // Salimos sin llamar a preventDefault ni a la API
    }

    e.preventDefault();     // Si todo es válido, evitamos el reload

    // Verifica si las contraseñas coinciden
    if (inputValue.password !== inputValue.confirmPassword) {
      return notify("error", "Las contraseñas no coinciden");
    }

    // Envío de la solicitud POST a la API para iniciar sesión
    try {
      const { data } = await axios.post(`${API_URL}/signup`, inputValue, {
        withCredentials: true,
      });
      const { success, message } = data;

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
      // Reinicia los valores de los inputs después de enviar el formulario
      setInputValue({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        lastName: "",
        phone: "",
      });
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
  };
};
