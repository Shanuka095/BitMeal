import { Navigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import React from 'react';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
  const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let decoded;
  try {
    decoded = jwtDecode(token);
    const userRole = decoded.role;

    switch (userRole) {
      case 'super_admin':
        if (!location.pathname.startsWith('/super-admin')) {
          return <Navigate to="/super-admin" replace />;
        }
        break;
        
      case 'restaurant_admin':
        if (!location.pathname.startsWith('/admin')) {
          return <Navigate to="/admin" replace />;
        }
        break;

      case 'delivery_personnel':
        if (!location.pathname.startsWith('/delivery-personnel')) {
          return <Navigate to="/delivery-personnel" replace />;
        }
        break;

      case 'customer':
        if (location.pathname.startsWith('/admin') || 
            location.pathname.startsWith('/delivery-personnel') || 
            location.pathname.startsWith('/super-admin')) {
          return <Navigate to="/dashboard" replace />;
        }
        break;

      default:
        sessionStorage.removeItem(sessionKey);
        return <Navigate to="/login" replace />;
    }

  } catch (err) {
    console.error('Frontend (ProtectedRoute) - Token invalid:', err);
    sessionStorage.removeItem(sessionKey);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;