import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;