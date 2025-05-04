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
import UserProfile from "../features/userProfile/userProfile"
//import Settings from '../pages/AdminSettings';

// Admin
import Employees from "../features/employees/Employees";
import EmployeesEdit from "../features/employees/editEmployee/employeeEdit";
import NewEmployee from "../features/employees/newEmployee/newEmployee";
import ViewEmployee from "../features/employees/viewEmployee/viewEmployee";
import Transactions from "../features/transactions/Transactions"
import IncomeForm from "../features/transactions/incomes/Income.jsx"
import ExpenseForm from "../features/transactions/expenses/Expense.jsx"
import ViewIncome from "../features/transactions/incomes/viewIncome.jsx"
import ViewExpense from "../features/transactions/expenses/viewExpense.jsx"

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
        <Route path="employees" element={<Employees />} />
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
        <Route path="settings" element={<UserProfile />} />
        {/* Resto de rutas del empleado */}
      </Route>

      {/* Catch‑all para los errores */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
