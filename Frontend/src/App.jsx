import { unstable_createRoot as createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/restaurants" element={<ProtectedRoute><Restaurants standalone={true} /></ProtectedRoute>} />
            <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><RestaurantAdmin /></ProtectedRoute>} />
            <Route path="/admin/create-restaurant" element={<ProtectedRoute><CreateRestaurant /></ProtectedRoute>} />
            <Route path="/admin/update-restaurant" element={<ProtectedRoute><UpdateRestaurant /></ProtectedRoute>} />
            <Route path="/admin/add-menu-item" element={<ProtectedRoute><AddMenuItem /></ProtectedRoute>} />
            <Route path="/admin/restaurant/:id" element={<ProtectedRoute><AdminRestaurantDetails /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;