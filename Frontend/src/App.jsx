import React, { useState } from 'react';
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
import UpdateMenuItem from './pages/UpdateMenuItem';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import VerifyOTP from './pages/VerifyOTP';
import CustomerOrders from './pages/CustomerOrders';
import AdminOrders from './pages/AdminOrders';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';

// Import new modal components
import AlertDialog from './components/AlertDialog';
import ConfirmationModal from './components/ConfirmationModal';
import PromptModal from './components/PromptModal';
import { ModalProvider } from './context/ModalContext';

import ManageDeliveryPersonnel from './pages/ManageDeliveryPersonnel';

// Import Delivery Personnel components and pages
import DeliveryPersonnelLayout from './components/DeliveryPersonnelLayout';
import DeliveryDashboard from './pages/DeliveryDashboard';
import MyDeliveries from './pages/MyDeliveries';

// Import ActiveOrderBanner and ActiveOrderPage
import ActiveOrderBanner from './components/ActiveOrderBanner';
import ActiveOrderPage from './pages/ActiveOrderPage';


function App() {
  // Global modal states
  const [alertInfo, setAlertInfo] = useState(null);
  const [confirmInfo, setConfirmInfo] = useState(null);
  const [promptInfo, setPromptInfo] = useState(null);

  // Functions to trigger modals
  const showAlert = (message) => setAlertInfo({ message });
  const showConfirm = (message, onConfirmCallback, onCancelCallback) => {
    setConfirmInfo({
      message,
      onConfirm: () => {
        onConfirmCallback();
        setConfirmInfo(null);
      },
      onCancel: () => {
        onCancelCallback();
        setConfirmInfo(null);
      },
    });
  };
  const showPrompt = (title, message, placeholder, onConfirmCallback, onCancelCallback) => {
    setPromptInfo({
      title,
      message,
      placeholder,
      onConfirm: (value) => {
        onConfirmCallback(value);
        setPromptInfo(null);
      },
      onCancel: () => {
        onCancelCallback();
        setPromptInfo(null);
      },
    });
  };

  return (
    <Router>
      {alertInfo && <AlertDialog message={alertInfo.message} onClose={() => setAlertInfo(null)} />}
      {confirmInfo && <ConfirmationModal {...confirmInfo} />}
      {promptInfo && <PromptModal {...promptInfo} />}

      <Routes>
        {/* Customer and Public Routes with Navbar and Footer */}
        <Route
          element={
            <CartProvider>
              <ModalProvider showAlert={showAlert} showConfirm={showConfirm} showPrompt={showPrompt}>
                <Navbar />
                <ActiveOrderBanner /> 
                {/* FIX: Add main-content-wrapper class to ensure content pushes footer */}
                <div className="main-content-wrapper flex-grow">
                  <Outlet />
                </div>
                <Footer />
              </ModalProvider>
            </CartProvider>
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
          <Route path="/my-orders" element={<ProtectedRoute><CustomerOrders /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/my-active-order" element={<ProtectedRoute><ActiveOrderPage /></ProtectedRoute>} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <ModalProvider showAlert={showAlert} showConfirm={showConfirm} showPrompt={showPrompt}>
                <AdminLayout />
              </ModalProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<RestaurantAdmin />} />
          <Route path="create-restaurant" element={<CreateRestaurant />} />
          <Route path="update-restaurant/:id" element={<UpdateRestaurant />} />
          <Route path="restaurant/:id/add-menu-item" element={<AddMenuItem />} />
          <Route path="restaurant/:id" element={<AdminRestaurantDetails />} />
          <Route path="restaurant/:id/menu/:menuId/edit" element={<UpdateMenuItem />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="delivery-personnel" element={<ManageDeliveryPersonnel />} />
        </Route>

        {/* Delivery Personnel Routes */}
        <Route
          path="/delivery-personnel/*"
          element={
            <ProtectedRoute>
              <ModalProvider showAlert={showAlert} showConfirm={showConfirm} showPrompt={showPrompt}>
                <DeliveryPersonnelLayout />
              </ModalProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<DeliveryDashboard />} />
          <Route path="my-deliveries" element={<MyDeliveries />} />
          <Route path="profile" element={<div>My Profile Page (coming soon)</div>} />
        </Route>

        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
