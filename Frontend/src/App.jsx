import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RestaurantAdmin from './pages/RestaurantAdmin.jsx';
import Profile from './pages/Profile.jsx';
import VerifyOTP from './pages/VerifyOTP.jsx';
import Restaurants from './pages/Restaurants.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3000/api/auth/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
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

  if (loading) return <div className="w-screen h-screen bg-[#2A3335] flex items-center justify-center text-[#F8FAFC]">Loading...</div>;
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
        <Route path="/restaurants/:id" element={<ProtectedRoute allowedRoles={['customer']}><Restaurants /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;