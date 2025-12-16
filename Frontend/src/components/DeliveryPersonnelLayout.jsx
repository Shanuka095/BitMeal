import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaSignOutAlt, FaTachometerAlt, FaClipboardList, FaUserCircle,
  FaBars, FaTimes, FaMotorcycle 
} from 'react-icons/fa';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

// Background Location Simulation
const SimulateLocation = ({ userId, token }) => {
    useEffect(() => {
        let intervalId;
        const updateLocation = async () => {
            const latitude = 6.9271 + (Math.random() - 0.5) * 0.05;
            const longitude = 79.8612 + (Math.random() - 0.5) * 0.05;
            try {
                await axios.post('http://localhost:3000/api/delivery/my-location', 
                    { coordinates: [longitude, latitude] }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (err) { /* Silent fail */ }
        };
        if (userId && token) intervalId = setInterval(updateLocation, 10000);
        return () => clearInterval(intervalId);
    }, [userId, token]);
    return null;
};

const DeliveryPersonnelLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Auth Logic
  const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
  const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
  let userId = null;
  if (token) {
      try { userId = jwtDecode(token).userId; } catch (e) {}
  }

  const handleLogout = () => {
    if (sessionKey) sessionStorage.removeItem(sessionKey);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Theme Classes
  const bgMain = isDark ? 'bg-[#0f0f0f]' : 'bg-gray-100';
  const bgSidebar = isDark ? 'bg-[#1a1a1a] border-r border-white/10' : 'bg-white border-r border-gray-200';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';

  const navItemClass = (path) => `
    w-full flex items-center px-4 py-3 rounded-xl transition-all font-bold mb-1
    ${isActive(path) 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
      : `${textSub} hover:bg-gray-50 dark:hover:bg-white/5 hover:text-blue-500`}
  `;

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-500 ${bgMain}`}>
      <SimulateLocation userId={userId} token={token} />

      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-blue-600 text-white shadow-lg"
      >
        <FaBars />
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`
          fixed lg:static top-0 left-0 h-full w-72 z-[999] shadow-2xl lg:shadow-none transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${bgSidebar}
      `}>
        <div className="flex flex-col h-full">
            <div className={`p-8 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h2 className={`text-xl font-black ${textMain}`}>Menu</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-red-500"><FaTimes size={20} /></button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 text-2xl"><FaMotorcycle /></div>
                    <div><h3 className={`font-bold leading-tight ${textMain}`}>Delivery Partner</h3><p className={`text-xs ${textSub}`}>On Duty</p></div>
                </div>
            </div>

            <nav className="flex-1 p-6 space-y-1">
                <button onClick={() => { navigate('/delivery-personnel'); setIsSidebarOpen(false); }} className={navItemClass('/delivery-personnel')}>
                    <FaTachometerAlt className="mr-3" /> Dashboard
                </button>
                <button onClick={() => { navigate('/delivery-personnel/my-deliveries'); setIsSidebarOpen(false); }} className={navItemClass('/delivery-personnel/my-deliveries')}>
                    <FaClipboardList className="mr-3" /> My Deliveries
                </button>
                <button onClick={() => { navigate('/delivery-personnel/profile'); setIsSidebarOpen(false); }} className={navItemClass('/delivery-personnel/profile')}>
                    <FaUserCircle className="mr-3" /> My Profile
                </button>
            </nav>

            <div className={`p-6 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 rounded-xl font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <FaSignOutAlt className="mr-2" /> Logout
                </button>
            </div>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-10 pt-20 lg:pt-10 w-full max-w-[100vw]">
        <Outlet />
      </main>
    </div>
  );
};

export default DeliveryPersonnelLayout;