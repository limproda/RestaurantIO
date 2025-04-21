import { useAuth } from "../../contexts/AuthContext";

export const ROLES = {
  ADMIN: "administrador",
  EMPLOYEE: "empleado",
};

// Hook que devuelve el usuario y booleans para saber su rol
export function useRole() {
  const { user } = useAuth();
  return {
    user,
    isAdmin: user?.role?.trim().toLowerCase() === ROLES.ADMIN,
    isEmployee: user?.role?.trim().toLowerCase() === ROLES.EMPLOYEE,
  };
}
