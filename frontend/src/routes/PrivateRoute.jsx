import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ user, allowedRoles, children }) {
  // Si el usuario no está autenticado, redirigimos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si su rol no está permitido, redirigimos al notfound
  if (!allowedRoles.includes(user.role.toLowerCase())) {
    return <Navigate to="/notfound" replace />;
  }

  // Si pasa ambas comprobaciones, renderizamos el contenido protegido
  return children;
}