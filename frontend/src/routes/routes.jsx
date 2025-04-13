import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, Login, Signup } from '../pages';
import ProtectedRoute from './ProtectedRoute'; // ejemplo de ruta protegida

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {/* Componente de Dashboard protegido */}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
