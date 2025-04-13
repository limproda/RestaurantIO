import React from 'react';
import { Navigate } from 'react-router-dom';

// Ejemplo muy básico de un componente que valida sesión
export default function ProtectedRoute({ children }) {
  const isAuth = Boolean(localStorage.getItem('token')); 
  return isAuth ? children : <Navigate to="/login" />;
}
