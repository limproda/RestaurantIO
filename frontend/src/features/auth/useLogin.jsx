import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/config.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNotification } from "../../components/NotificationProvider";

export const useLogin = () => {
  // Hooks de React y definición de variables
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Contexto de autenticación para obtener la información del usuario
  const { notify } = useNotification();

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Manejadores de eventos del password
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  // Previene el comportamiento por defecto al mantener pulsado el botón del ícono
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  // Función para manejar el cambio de los inputs
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue(prev => ({ ...prev, [name]: value }));

  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Envío de la solicitud POST a la API para iniciar sesión
    try {
      const { data } = await axios.post(
        `${API_URL}/login`,
        { ...inputValue },
        { withCredentials: true }
      );

      const { success, message, user } = data;

      // Si la respuesta es exitosa, se muestra la notificación de éxito y se redirige al usuario
      if (success) {
        notify("success", message);
        localStorage.setItem("user", JSON.stringify(user)); // Se guarda TODA la información del usuario
        setUser(user); // Se actualiza el contexto con la información del usuario

        setTimeout(() => {
          // Se redirige según el rol
          if (user.role.toLowerCase() === "administrador") {
            navigate("/admin/dashboard");
          } else if (user.role.toLowerCase() === "empleado") {
            navigate("/employee/dashboard");
          } else {
            navigate("/notfound"); // Si el rol no es válido, se redirige a una página de error
          }
        }, 500);
      } else {
        notify("error", message)
      }
    } catch (error) {
        console.error("Login error:", error);
        const backendMsg = error.response?.data?.message ?? error.message;
        notify("error", `${backendMsg}`);

    } finally {
      // Reinicia los valores de los inputs después de enviar el formulario
      setInputValue({
        email: "",
        password: "",
      });
    }
  };

  return {
    inputValue,
    showPassword,
    togglePasswordVisibility,
    handleMouseDownPassword,
    handleMouseUpPassword,
    handleOnChange,
    handleSubmit,
  };
};
