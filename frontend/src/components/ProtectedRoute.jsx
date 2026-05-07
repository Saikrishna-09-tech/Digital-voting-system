import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, userRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
