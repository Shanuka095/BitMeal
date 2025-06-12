import { Navigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode'; // Reverted to default import for jwt-decode

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

    // Redirect logic based on role
    // If admin and trying to access root or dashboard, redirect to /admin
    if (isAdmin && (location.pathname === '/' || location.pathname.startsWith('/dashboard'))) {
      console.log('Frontend (ProtectedRoute) - Admin accessing non-admin path, redirecting to /admin');
      return <Navigate to="/admin" replace />;
    }
    // If not admin and trying to access root or admin paths, redirect to /dashboard
    if (!isAdmin && (location.pathname === '/' || location.pathname.startsWith('/admin'))) {
      console.log('Frontend (ProtectedRoute) - Non-admin accessing admin path, redirecting to /dashboard');
      return <Navigate to="/dashboard" replace />;
    }
    // No specific redirects if role and path are aligned, or if it's another allowed path
    // For example, if admin is on /admin or a sub-path, just allow children
    // if non-admin is on /dashboard or a sub-path, just allow children

  } catch (err) {
    console.error('Frontend (ProtectedRoute) - Token decoding error:', err);
    // Clear invalid token and redirect to login
    localStorage.removeItem('token');
    if (sessionKey) sessionStorage.removeItem(sessionKey);
    return <Navigate to="/login" replace />;
  }

  // If token is valid and role/path are consistent, render children
  return children;
};

export default ProtectedRoute;