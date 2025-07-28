import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    // Si no hay usuario en el contexto, redirige al usuario a la página de inicio de sesión
    return <Navigate to="/" replace />;
  }

  // Si hay un usuario, muestra el contenido de la ruta (los 'children')
  return <>{children}</>;
};

export default ProtectedRoute;