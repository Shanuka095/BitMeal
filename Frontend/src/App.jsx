// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RestaurantAdmin from './pages/RestaurantAdmin';
import Profile from './pages/Profile';
import VerifyOTP from './pages/VerifyOTP';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:3000/api/auth/verify-token', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setRole(res.data.role);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          localStorage.removeItem('token');
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading)
    return <div className="w-screen h-screen bg-[#fffce5] flex items-center justify-center text-[#1F2937]">Loading...</div>;
  if (!role || !allowedRoles.includes(role)) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><Dashboard /></ProtectedRoute>} />
        <Route path="/restaurant-admin" element={<ProtectedRoute allowedRoles={['restaurant_admin']}><RestaurantAdmin /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['customer', 'restaurant_admin', 'delivery_personnel']}><Profile /></ProtectedRoute>} />
        <Route path="/restaurants" element={<ProtectedRoute allowedRoles={['customer']}><Restaurants /></ProtectedRoute>} />
        <Route path="/restaurant/:id" element={<ProtectedRoute allowedRoles={['customer']}><RestaurantDetails /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;