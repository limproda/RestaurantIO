export const appName = "RestaurantIO";
export const FRONTEND_URL = "http://localhost:5173";
export const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/api" // Ruta dinámica para el backend
export const TRANS_URL = `${API_URL}/transactions`
export const sidebarWidth = 240;