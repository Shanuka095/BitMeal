import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import AdminLayout from './components/AdminLayout';
import RestaurantAdmin from './pages/RestaurantAdmin';
import CreateRestaurant from './pages/CreateRestaurant';
import UpdateRestaurant from './pages/UpdateRestaurant';
import AddMenuItem from './pages/AddMenuItem';
import AdminRestaurantDetails from './pages/AdminRestaurantDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import VerifyOTP from './pages/VerifyOTP';

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer and Public Routes with Navbar and Footer */}
        <Route
          element={
            <>
              <Navbar />
              <div className="flex-grow">
                <Outlet /> {/* Render child routes here */}
              </div>
              <Footer />
            </>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/restaurants" element={<ProtectedRoute><Restaurants standalone={true} /></ProtectedRoute>} />
          <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>

        {/* Admin Routes with AdminLayout (no Navbar/Footer) */}
        <Route
          path="/admin/*" // Use a wildcard to match all sub-routes
          element={
            <ProtectedRoute>
              <AdminLayout /> {/* AdminLayout will render its own Outlet */}
            </ProtectedRoute>
          }
        >
          <Route index element={<RestaurantAdmin />} /> {/* /admin */}
          <Route path="create-restaurant" element={<CreateRestaurant />} /> {/* /admin/create-restaurant */}
          <Route path="update-restaurant/:id" element={<UpdateRestaurant />} /> {/* /admin/update-restaurant/:id */}
          <Route path="restaurant/:id/add-menu-item" element={<AddMenuItem />} /> {/* /admin/restaurant/:id/add-menu-item */}
          <Route path="restaurant/:id" element={<AdminRestaurantDetails />} /> {/* /admin/restaurant/:id */}
        </Route>

        {/* Catch-all route for unmatched paths - consider your exact redirection logic */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;