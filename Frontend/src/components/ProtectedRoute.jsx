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
    const isAdmin = decoded.role === 'restaurant_admin';
    console.log('Frontend (ProtectedRoute) - Is Admin:', isAdmin);

    if (isAdmin && location.pathname === '/') {
      return <Navigate to="/admin" replace />;
    }
    if (isAdmin && (location.pathname.startsWith('/my-orders') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/restaurants') || location.pathname.startsWith('/restaurant/'))) {
      if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/my-orders')) {
        return <Navigate to="/admin" replace />;
      }
    }
    if (!isAdmin && location.pathname.startsWith('/admin')) {
      return <Navigate to="/dashboard" replace />;
    }

  } catch (err) {
    console.error('Frontend (ProtectedRoute) - Token decoding error or invalid token:', err);
    if (sessionKey) sessionStorage.removeItem(sessionKey);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
