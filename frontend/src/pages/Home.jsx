import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { API_URL } from "../config";
import useNotification from "../hooks/useNotification";
import Notification from "../components/common/Notification";

const Home = () => {
  const navigate = useNavigate(); // Hook para navegar entre rutas
  const [cookies, removeCookie] = useCookies([]); // Hook para gestionar cookies 
  const [username, setUsername] = useState(""); // Hook para almacenar el nombre de usuario
  const { notification, showNotification, handleClose } = useNotification(); // Hook para las notificaciones del usuario

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login"); // Si no existe la cookie token, se redirige al usuario al login
      }
      try {
        const { data } = await axios.post( // Se realiza la petición POST a la API para verificar el token
          `${API_URL}`,
          {},
          { withCredentials: true }
        );
        const { status, user } = data; // Desestructura los datos recibidos de la API
        setUsername(user);
        if (status) {
          showNotification("success", `Hola ${user}`); // Si la verificación es exitosa, muestra una notificación de bienvenida
        } else {
          removeCookie("token"); // Si falla, elimina la cookie y redirige al login
          navigate("/login");
        }
      } catch (error) {
        // Si hay un error, se muestra en consola, en pantalla, se elimina la cookie y se redirige al login
        console.error("Error verifying cookie:", error);
        showNotification("Error", "Ha habido un error");
        removeCookie("token");
        navigate("/login");
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };
  return (
    <>
      <div className="home_page">
        <h4>
          {" "}
          Bienvenido <span>{username}</span>
        </h4>
        <button onClick={Logout}>LOGOUT</button>
      </div>
      {/* Notificaciones para el usuario */}
      <Notification
        open={notification.open}
        severity={notification.severity}
        message={notification.message}
        onClose={handleClose}
      />
    </>
  );
};

export default Home;