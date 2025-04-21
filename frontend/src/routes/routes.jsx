// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import MainLayout from "../layout/MainLayout";

// Páginas públicas
import { Login, Signup } from "../pages";

// Páginas de layout / genéricas
import NotFound from "../pages/NotFound";
import Dashboard from "../features/dashboard/Dashboard";
//import Settings from '../pages/AdminSettings';

// Admin
//import AdminEmployees  from '../pages/AdminEmployees';
//import AdminPayrolls   from '../pages/AdminPayrolls';

// Empleado
//import EmployeeWorkingTime    from '../pages/EmployeeWorkingTime';
//import EmployeeCheckPayrolls  from '../pages/EmployeeCheckPayrolls';

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rutas raíz */}
      <Route
        index
        element={
          user ? (
            (() => {
              const role = user.role.toLowerCase();
              // Redirigimos al dashboard según el rol del usuario
              if (role === "administrador")
                return <Navigate to="/admin/dashboard" replace />;
              if (role === "empleado")
                return <Navigate to="/employee/dashboard" replace />;
              return <Navigate to="/login" replace />;
            })()
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Rutas públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute user={user}>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute user={user}>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Rutas del administrador */}
      <Route
        path="/admin"
        element={
          <PrivateRoute user={user} allowedRoles={["administrador"]}>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* Aquí añadimos todas las rutas del administrador*/}
        <Route path="dashboard" element={<Dashboard />} />
        {/* Resto de rutas del administrador */}
      </Route>

      {/* Rutas del empleado */}
      <Route
        path="/employee"
        element={
          <PrivateRoute user={user} allowedRoles={["empleado"]}>
            {/* Aquí añadimos todas las rutas del empleado*/}
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        {/* Resto de rutas del empleado */}
      </Route>

      {/* Catch‑all para los errores */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
