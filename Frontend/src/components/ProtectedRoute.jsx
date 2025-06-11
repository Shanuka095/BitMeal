import { Navigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode'; // Use default import directly

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  console.log('ProtectedRoute - Token:', token ? token.substring(0, 10) + '...' : 'No token');

  if (!token) {
    console.log('No token, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  let decoded;
  try {
    decoded = jwtDecode(token); // Directly call the default export
    console.log('Decoded Token:', decoded);
    const isAdmin = decoded.role === 'restaurant_admin';
    console.log('Is Admin:', isAdmin);

    if (isAdmin && location.pathname === '/') {
      console.log('Redirecting admin to /admin');
      return <Navigate to="/admin" replace />;
    }
    if (!isAdmin && location.pathname === '/') {
      console.log('Redirecting customer to /dashboard');
      return <Navigate to="/dashboard" replace />;
    }
    if (isAdmin && location.pathname.startsWith('/dashboard')) {
      console.log('Redirecting admin from /dashboard to /admin');
      return <Navigate to="/admin" replace />;
    }
    if (!isAdmin && location.pathname.startsWith('/admin')) {
      console.log('Redirecting customer from /admin to /dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  } catch (err) {
    console.error('Token decoding error:', err);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;