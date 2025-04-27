import axios from "axios";
import { API_URL } from "../../config/config";

// Obtenemos el perfil del usuario autenticado
export const getCurrentProfile = () =>
  axios.get(`${API_URL}/settings/profile`, { withCredentials: true });

// Enviamos los datos actualizados del perfil al servidor
export const updateCurrentProfile = (data) =>
  axios.patch(`${API_URL}/settings/profile`, data, { withCredentials: true });
