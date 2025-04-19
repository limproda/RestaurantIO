import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/config";

export const useSignup = () => {
  // Hooks de React y definición de variables
  const navigate = useNavigate();
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

  // Manejo de las notificaciones
  const [notification, setNotification] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Función para manejar el cambio de los inputs
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue(prev => ({ ...prev, [name]: value }));
  };

  // Funciones que alternan la visibilidad de la contraseña
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  // Previene el comportamiento por defecto al mantener pulsado el botón del ícono
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica si las contraseñas coinciden
    if (inputValue.password !== inputValue.confirmPassword) {
      setNotification({ open: true, severity: 'error', message: "Las contraseñas no coinciden" });
      return;
    }

    // Envío de la solicitud POST a la API para iniciar sesión
    try {
      const { data } = await axios.post(`${API_URL}/signup`, inputValue, { withCredentials: true });
      const { success, message } = data;

      // Si la respuesta es exitosa, se muestra la notificación de éxito y se redirige al usuario a "/"
      if (success) {
        setNotification({ open: true, severity: 'success', message });
        setTimeout(() => navigate("/"), 1500);
      } else {
        // Si la creación falla, muestra la notificación de error
        setNotification({ open: true, severity: 'error', message });
      }
    } catch (error) {
      // Si ocurre algún error, muestra la notificación de error
      const errorMessage = error.response?.data?.message || "Error inesperado";
      setNotification({ open: true, severity: 'error', message: errorMessage });
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
    notification,
    handleOnChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleMouseDownPassword,
    handleMouseUpPassword,
    handleSubmit,
    handleCloseNotification
  };
};