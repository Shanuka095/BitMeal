import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';

// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ActiveOrderBanner from './components/ActiveOrderBanner';
import AdminLayout from './components/AdminLayout';
import DeliveryPersonnelLayout from './components/DeliveryPersonnelLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import MenuItemDetails from './pages/MenuItemDetails';
import CustomerOrders from './pages/CustomerOrders';
import CartPage from './pages/CartPage';
import ActiveOrderPage from './pages/ActiveOrderPage';
import RateOrder from './pages/RateOrder';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Services from './pages/Services';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

// Admin Pages
import RestaurantAdmin from './pages/RestaurantAdmin';
import CreateRestaurant from './pages/CreateRestaurant';
import UpdateRestaurant from './pages/UpdateRestaurant';
import AddMenuItem from './pages/AddMenuItem';
import AdminRestaurantDetails from './pages/AdminRestaurantDetails';
import UpdateMenuItem from './pages/UpdateMenuItem';
import AdminOrders from './pages/AdminOrders';
import ManageDeliveryPersonnel from './pages/ManageDeliveryPersonnel';

// Delivery Pages
import DeliveryDashboard from './pages/DeliveryDashboard';
import MyDeliveries from './pages/MyDeliveries';

// Components & Context
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import AlertDialog from './components/AlertDialog';
import ConfirmationModal from './components/ConfirmationModal';
import PromptModal from './components/PromptModal';
import { ModalProvider } from './context/ModalContext';
import { ThemeProvider } from './context/ThemeContext';

// --- CUSTOMER LAYOUT (Only for Public/Customer users) ---
const CustomerLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <ActiveOrderBanner />
    <div className="main-content-wrapper flex-grow">
      <Outlet />
    </div>
    <Footer />
  </div>
);

function App() {
  const [alertInfo, setAlertInfo] = useState(null);
  const [confirmInfo, setConfirmInfo] = useState(null);
  const [promptInfo, setPromptInfo] = useState(null);

  const showAlert = (message) => setAlertInfo({ message });
  const showConfirm = (message, onConfirmCallback, onCancelCallback) => {
    setConfirmInfo({
      message,
      onConfirm: () => { onConfirmCallback(); setConfirmInfo(null); },
      onCancel: () => { onCancelCallback(); setConfirmInfo(null); },
    });
  };
  const showPrompt = (title, message, placeholder, onConfirmCallback, onCancelCallback) => {
    setPromptInfo({
      title, message, placeholder,
      onConfirm: (value) => { onConfirmCallback(value); setPromptInfo(null); },
      onCancel: () => { onCancelCallback(); setPromptInfo(null); },
    });
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <CartProvider>
          <ModalProvider showAlert={showAlert} showConfirm={showConfirm} showPrompt={showPrompt}>
            {alertInfo && <AlertDialog message={alertInfo.message} onClose={() => setAlertInfo(null)} />}
            {confirmInfo && <ConfirmationModal {...confirmInfo} />}
            {promptInfo && <PromptModal {...promptInfo} />}

            <Routes>
              
              {/* --- CUSTOMER / PUBLIC ROUTES --- */}
              <Route element={<CustomerLayout />}>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />

                {/* Protected Customer */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/restaurants" element={<ProtectedRoute><Restaurants standalone={true} /></ProtectedRoute>} />
                <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetails /></ProtectedRoute>} />
                <Route path="/restaurant/:id/menu/:menuId" element={<ProtectedRoute><MenuItemDetails /></ProtectedRoute>} />
                <Route path="/my-orders" element={<ProtectedRoute><CustomerOrders /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/my-active-order" element={<ProtectedRoute><ActiveOrderPage /></ProtectedRoute>} />
                <Route path="/rate-order/:orderId" element={<ProtectedRoute><RateOrder /></ProtectedRoute>} />
              </Route>

              {/* --- ADMIN ROUTES (No Navbar/Footer) --- */}
              <Route path="/admin/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<RestaurantAdmin />} />
                <Route path="create-restaurant" element={<CreateRestaurant />} />
                <Route path="update-restaurant/:id" element={<UpdateRestaurant />} />
                <Route path="restaurant/:id/add-menu-item" element={<AddMenuItem />} />
                <Route path="restaurant/:id" element={<AdminRestaurantDetails />} />
                <Route path="restaurant/:id/menu/:menuId/edit" element={<UpdateMenuItem />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="delivery-personnel" element={<ManageDeliveryPersonnel />} />
              </Route>

              {/* --- DELIVERY ROUTES (No Navbar/Footer) --- */}
              <Route path="/delivery-personnel/*" element={<ProtectedRoute><DeliveryPersonnelLayout /></ProtectedRoute>}>
                <Route index element={<DeliveryDashboard />} />
                <Route path="my-deliveries" element={<MyDeliveries />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
              
            </Routes>
          </ModalProvider>
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;