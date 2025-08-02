import { Navigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import React from 'react';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const sessionKey = location.state?.sessionKey || Object.keys(sessionStorage).find(key => key.startsWith('token_'));
  const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;

  if (localStorage.getItem('token')) {
    console.warn('Frontend (ProtectedRoute) - Found old localStorage token. Removing it.');
    localStorage.removeItem('token');
  }

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
    const userRole = decoded.role;
    console.log('Frontend (ProtectedRoute) - User Role:', userRole);

    // FIX: Refactor the redirection logic to a more robust switch statement.
    switch (userRole) {
      case 'restaurant_admin':
        // If an admin tries to access a non-admin page, redirect them to the admin dashboard.
        if (!location.pathname.startsWith('/admin')) {
          return <Navigate to="/admin" replace />;
        }
        break;
      case 'delivery_personnel':
        // If a delivery person tries to access a non-delivery page, redirect them to their dashboard.
        if (!location.pathname.startsWith('/delivery-personnel')) {
          return <Navigate to="/delivery-personnel" replace />;
        }
        break;
      case 'customer':
        // If a customer tries to access an admin or delivery page, redirect them to their dashboard.
        if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/delivery-personnel')) {
          return <Navigate to="/dashboard" replace />;
        }
        break;
      default:
        // For any unknown role, redirect to the login page.
        console.warn('Frontend (ProtectedRoute) - Unknown user role, redirecting to /login.');
        if (sessionKey) sessionStorage.removeItem(sessionKey);
        return <Navigate to="/login" replace />;
    }

  } catch (err) {
    console.error('Frontend (ProtectedRoute) - Token decoding error or invalid token:', err);
    if (sessionKey) sessionStorage.removeItem(sessionKey);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
