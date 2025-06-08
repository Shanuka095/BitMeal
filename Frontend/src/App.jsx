// src/App.jsx
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import RestaurantAdmin from './pages/RestaurantAdmin';
import CreateRestaurant from './pages/CreateRestaurant';
import UpdateRestaurant from './pages/UpdateRestaurant';
import AddMenuItem from './pages/AddMenuItem';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';

const AppContent = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/') {
      Navigate({ to: '/', replace: true });
    }
  }, [token, location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/restaurants" element={<ProtectedRoute><Restaurants standalone={true} /></ProtectedRoute>} />
          <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><RestaurantAdmin /></ProtectedRoute>} />
          <Route path="/admin/create-restaurant" element={<ProtectedRoute><CreateRestaurant /></ProtectedRoute>} />
          <Route path="/admin/update-restaurant" element={<ProtectedRoute><UpdateRestaurant /></ProtectedRoute>} />
          <Route path="/admin/add-menu-item" element={<ProtectedRoute><AddMenuItem /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;