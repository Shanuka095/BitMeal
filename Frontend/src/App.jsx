import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ActiveOrderBanner from './components/ActiveOrderBanner';
import AdminLayout from './components/AdminLayout'; 
import SuperAdminLayout from './components/SuperAdminLayout'; 
import DeliveryPersonnelLayout from './components/DeliveryPersonnelLayout';

// Pages (Standard)
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
import Profile from './pages/Profile';

// --- NEW PAGES IMPORT ---
import ForgotPassword from './pages/ForgotPassword';
import VerifyResetOTP from './pages/VerifyResetOTP';
import ResetPassword from './pages/ResetPassword';

// Restaurant Admin Pages
import RestaurantAdmin from './pages/RestaurantAdmin';
import CreateRestaurant from './pages/CreateRestaurant';
import UpdateRestaurant from './pages/UpdateRestaurant';
import AddMenuItem from './pages/AddMenuItem';
import AdminRestaurantDetails from './pages/AdminRestaurantDetails';
import UpdateMenuItem from './pages/UpdateMenuItem';
import AdminOrders from './pages/AdminOrders';
import ManageDeliveryPersonnel from './pages/ManageDeliveryPersonnel';

// Super Admin Pages
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ManagePendingRestaurants from './pages/ManagePendingRestaurants';

// Delivery Pages
import DeliveryDashboard from './pages/DeliveryDashboard';
import MyDeliveries from './pages/MyDeliveries';

// Context & Components
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import AlertDialog from './components/AlertDialog';
import ConfirmationModal from './components/ConfirmationModal';
import PromptModal from './components/PromptModal';
import { ModalProvider } from './context/ModalContext';
import { ThemeProvider } from './context/ThemeContext';

// --- CUSTOMER LAYOUT ---
const CustomerLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <ActiveOrderBanner />
    <div className="main-content-wrapper flex-grow min-h-[calc(100vh-112px)]">
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
  const showConfirm = (message, onConfirm, onCancel) => {
    setConfirmInfo({ message, onConfirm: () => { onConfirm(); setConfirmInfo(null); }, onCancel: () => { onCancel(); setConfirmInfo(null); } });
  };
  const showPrompt = (title, message, placeholder, onConfirm, onCancel) => {
    setPromptInfo({ title, message, placeholder, onConfirm: (val) => { onConfirm(val); setPromptInfo(null); }, onCancel: () => { onCancel(); setPromptInfo(null); } });
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
              {/* --- PUBLIC & CUSTOMER ROUTES --- */}
              <Route element={<CustomerLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                
                {/* --- FORGOT PASSWORD FLOW (NEW) --- */}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                
                {/* Protected Customer Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/restaurants" element={<ProtectedRoute><Restaurants standalone={true} /></ProtectedRoute>} />
                <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetails /></ProtectedRoute>} />
                <Route path="/restaurant/:id/menu/:menuId" element={<ProtectedRoute><MenuItemDetails /></ProtectedRoute>} />
                <Route path="/my-orders" element={<ProtectedRoute><CustomerOrders /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/my-active-order" element={<ProtectedRoute><ActiveOrderPage /></ProtectedRoute>} />
                <Route path="/rate-order/:orderId" element={<ProtectedRoute><RateOrder /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Route>

              {/* --- RESTAURANT ADMIN ROUTES --- */}
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

              {/* --- SUPER ADMIN ROUTES --- */}
              <Route path="/super-admin/*" element={<ProtectedRoute><SuperAdminLayout /></ProtectedRoute>}>
                 <Route index element={<SuperAdminDashboard />} />
                 <Route path="pending-restaurants" element={<ManagePendingRestaurants />} />
              </Route>

              {/* --- DELIVERY PERSONNEL ROUTES --- */}
              <Route path="/delivery-personnel/*" element={<ProtectedRoute><DeliveryPersonnelLayout /></ProtectedRoute>}>
                <Route index element={<DeliveryDashboard />} />
                <Route path="my-deliveries" element={<MyDeliveries />} />
                <Route path="profile" element={<Profile />} />
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