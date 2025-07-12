import React, { useState } from 'react';
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
import { ModalProvider } from './context/ModalContext'; // Import ModalProvider

function App() {
  // Global modal states
  const [alertInfo, setAlertInfo] = useState(null); // { message: '...' }
  const [confirmInfo, setConfirmInfo] = useState(null); // { message: '...', onConfirm: () => {}, onCancel: () => {} }
  const [promptInfo, setPromptInfo] = useState(null); // { title: '...', message: '...', placeholder: '...', onConfirm: (value) => {}, onCancel: () => {} }

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
      {/* Render global modals */}
      {alertInfo && <AlertDialog message={alertInfo.message} onClose={() => setAlertInfo(null)} />}
      {confirmInfo && <ConfirmationModal {...confirmInfo} />}
      {promptInfo && <PromptModal {...promptInfo} />}

      <Routes>
        {/* Customer and Public Routes with Navbar and Footer, wrapped by CartProvider and ModalProvider */}
        <Route
          element={
            <CartProvider>
              {/* Wrap with ModalProvider here to provide context to all nested routes */}
              <ModalProvider showAlert={showAlert} showConfirm={showConfirm} showPrompt={showPrompt}>
                <Navbar />
                <div className="flex-grow">
                  <Outlet /> {/* Outlet no longer needs to pass context directly */}
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
          {/* Protected routes will now consume context from ModalProvider */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/restaurants" element={<ProtectedRoute><Restaurants standalone={true} /></ProtectedRoute>} />
          <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><CustomerOrders /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        </Route>

        {/* Admin Routes with AdminLayout (no Navbar/Footer) - also wrapped by ModalProvider */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              {/* Admin routes also need access to modals, so wrap AdminLayout with ModalProvider */}
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
        </Route>

        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
