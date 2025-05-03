import axios from "axios";
import { API_URL } from "../../config/config";

// Función para hacer login
export const login = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials, {
    withCredentials: true,
  });
};

// Función para crear cuenta
export const signup = (userData) => {
  return axios.post(`${API_URL}/signup`, userData, {
    withCredentials: true,
  });
};
