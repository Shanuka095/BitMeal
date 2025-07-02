import { Navigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Find the session key by checking location state first, then iterating sessionStorage
  const sessionKey = location.state?.sessionKey || Object.keys(sessionStorage).find(key => key.startsWith('token_'));
  const token = sessionKey ? sessionStorage.getItem(sessionKey) : null; // Get token ONLY from sessionStorage

  // --- Clean up any old localStorage tokens (for a clean migration) ---
  // This part can be removed after all users have migrated to sessionStorage-only
  if (localStorage.getItem('token')) {
    console.warn('Frontend (ProtectedRoute) - Found old localStorage token. Removing it.');
    localStorage.removeItem('token');
  }
  // -------------------------------------------------------------------

  console.log('Frontend (ProtectedRoute) - Token (from sessionStorage):', token ? token.substring(0, 10) + '...' : 'No token');
  console.log('Frontend (ProtectedRoute) - Session Key used:', sessionKey || 'N/A');

  if (!token) {
    console.log('Frontend (ProtectedRoute) - No token found in sessionStorage, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  let decoded;
  try {
    decoded = jwtDecode(token);
    console.log('Frontend (ProtectedRoute) - Decoded Token:', decoded);
    const isAdmin = decoded.role === 'restaurant_admin';
    console.log('Frontend (ProtectedRoute) - Is Admin:', isAdmin);

    // Redirect logic based on role and path
    if (isAdmin && location.pathname === '/') {
      return <Navigate to="/admin" replace />;
    }
    // If an admin tries to access a customer-only route (e.g., /my-orders)
    if (isAdmin && (location.pathname.startsWith('/my-orders') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/restaurants') || location.pathname.startsWith('/restaurant/'))) {
      // Allow admin to view public restaurant list and details, but redirect from dashboard/my-orders
      if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/my-orders')) {
        return <Navigate to="/admin" replace />;
      }
    }
    // If a customer tries to access an admin route
    if (!isAdmin && location.pathname.startsWith('/admin')) {
      return <Navigate to="/dashboard" replace />;
    }

  } catch (err) {
    console.error('Frontend (ProtectedRoute) - Token decoding error or invalid token:', err);
    // If token is invalid or expired, remove it and redirect to login
    if (sessionKey) sessionStorage.removeItem(sessionKey);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
