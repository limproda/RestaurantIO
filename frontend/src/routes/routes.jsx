import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login, Signup, AdminDashboard, EmployeeDashboard, NotFound } from '../pages';
import AdminRoute from './AdminRoute';
import EmployeeRoute from './EmployeeRoute';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AppRoutes() {

  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          !user ? <Login /> :
            user.role.toLowerCase() === "administrador" ? <Navigate to="/admin/dashboard" replace /> :
              <Navigate to="/employee/dashboard" replace />
        }
      />
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Rutas protegidas para administradores */}
      <Route path="/admin" element={<AdminRoute />}>
        {/* Aquí defines las rutas de administrador */}
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* Por ejemplo:
        <Route path="users" element={<ManageUsers />} /> */}
      </Route>

      {/* Rutas protegidas para empleados */}
      <Route path="/employee" element={<EmployeeRoute />}>
        {/* Rutas internas para empleados */}
        <Route path="dashboard" element={<EmployeeDashboard />} />
        {/* Por ejemplo:
        <Route path="profile" element={<EmployeeProfile />} /> */}
      </Route>

      {/* Ruta catch-all, para 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
