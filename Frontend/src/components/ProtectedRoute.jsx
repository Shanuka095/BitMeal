import { Navigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const sessionKey = location.state?.sessionKey || Object.keys(sessionStorage).find(key => key.startsWith('token_'));
  const token = sessionKey ? sessionStorage.getItem(sessionKey) : localStorage.getItem('token');

  console.log('Frontend (ProtectedRoute) - Token:', token ? token.substring(0, 10) + '...' : 'No token');
  console.log('Frontend (ProtectedRoute) - Session Key:', sessionKey);

  if (!token) {
    console.log('Frontend (ProtectedRoute) - No token found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  let decoded;
  try {
    decoded = jwtDecode(token);
    console.log('Frontend (ProtectedRoute) - Decoded Token:', decoded);
    const isAdmin = decoded.role === 'restaurant_admin';
    console.log('Frontend (ProtectedRoute) - Is Admin:', isAdmin);

    if (isAdmin && location.pathname === '/') {
      return <Navigate to="/admin" replace />;
    }
    if (!isAdmin && location.pathname === '/admin') {
      return <Navigate to="/dashboard" replace />;
    }
  } catch (err) {
    console.error('Frontend (ProtectedRoute) - Token decoding error:', err);
    localStorage.removeItem('token');
    if (sessionKey) sessionStorage.removeItem(sessionKey);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;