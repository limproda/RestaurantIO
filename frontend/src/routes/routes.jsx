// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import MainLayout from "../layout/MainLayout";

// Importamos todas las páginas desde el archivo index
import {
  Login,
  Signup,
  Dashboard,
  NotFound,
  UserProfile,
  Employee,
  EmployeesEdit,
  NewEmployee,
  ViewEmployee,
  Transactions,
  IncomeForm,
  ExpenseForm,
  ViewIncome,
  ViewExpense,
  Payrolls,
  Punch,
  EmployeePayroll,
  WorkingTime
} from "../pages";

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
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employee />} />
        <Route path="employees/edit/:id" element={<EmployeesEdit />} />
        <Route path="employees/view/:id" element={<ViewEmployee />} />
        <Route path="employees/new" element={<NewEmployee />} />
        <Route path="settings" element={<UserProfile />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/new/income" element={<IncomeForm />} />
        <Route path="transactions/income/edit/:id" element={<IncomeForm />} />
        <Route path="transactions/income/view/:id" element={<ViewIncome />} />
        <Route path="transactions/new/expense" element={<ExpenseForm />} />
        <Route path="transactions/expense/edit/:id" element={<ExpenseForm />} />
        <Route path="transactions/expense/view/:id" element={<ViewExpense />} />
        <Route path="payroll" element={<Payrolls />} />
      </Route>
      
      {/* Rutas del empleado */}
      <Route
        path="/employee"
        element={
          <PrivateRoute user={user} allowedRoles={["empleado"]}>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<UserProfile />} />
        <Route path="payroll" element={<EmployeePayroll />} />
        <Route path="punch" element={<Punch />} />
        <Route path="punches/working-time" element={<WorkingTime />} />
      </Route>

      {/* Catch‑all para los errores */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
