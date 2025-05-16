import { useAuth } from '../../contexts/AuthContext';

export const ROLES = {
  ADMIN: 'administrador',
  EMPLOYEE: 'empleado',
};

// Hook que devuelve el usuario y booleans para saber su rol 
export function useRole() {
  const { user } = useAuth();

  const role = user?.role?.trim().toLowerCase() ?? '';

  return {
    user,
    isAdmin: role === ROLES.ADMIN,
    isEmployee: role === ROLES.EMPLOYEE,
  };
}
