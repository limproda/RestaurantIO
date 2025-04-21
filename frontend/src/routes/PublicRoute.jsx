import { Navigate } from 'react-router-dom';

const roleMap = {
  administrador: 'admin',
  empleado:     'employee',
};

export default function PublicRoute({ user, children }) {
  // Si hay usuario, redirige a /admin/dashboard o /employee/dashboard, en base al rol
  if (user) {
    const prefix = roleMap[user.role.toLowerCase()]; 
      return <Navigate to={`/${prefix}/dashboard`} replace />;
  }
  // Si no está autenticado, pasa a las rutas públicas (login/signup)
  return children;
}
