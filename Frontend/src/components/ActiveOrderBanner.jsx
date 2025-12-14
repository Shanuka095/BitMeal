import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaMotorcycle, FaUtensils, FaChevronRight, FaClock, FaCheckCircle } from 'react-icons/fa';
import jwtDecode from 'jwt-decode';
import { useTheme } from '../context/ThemeContext';

const ActiveOrderBanner = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const fetchActiveOrder = async () => {
    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      if (decoded?.role !== 'customer') return;

      // Suppress 404s by handling the error internally
      const response = await axios.get('http://localhost:3000/api/orders/my-active-order', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActiveOrder(response.data || null);
    } catch (err) {
      // If 404, just set null and don't log to console to avoid spam
      setActiveOrder(null);
    }
  };

  useEffect(() => {
    fetchActiveOrder();
    const interval = setInterval(fetchActiveOrder, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const isOnTrackingPage = location.pathname === '/my-active-order';
  if (!activeOrder || activeOrder.status === 'delivered' || activeOrder.status === 'cancelled') return null;

  const getStatusConfig = () => {
    switch (activeOrder.status) {
      case 'out_for_delivery': return { color: 'bg-green-500', text: 'text-green-500', icon: <FaMotorcycle />, label: 'Arriving Soon', progress: 'w-[80%]' };
      case 'preparing': return { color: 'bg-orange-500', text: 'text-orange-500', icon: <FaUtensils />, label: 'Kitchen is Cooking', progress: 'w-[50%]' };
      case 'confirmed': return { color: 'bg-blue-500', text: 'text-blue-500', icon: <FaCheckCircle />, label: 'Order Confirmed', progress: 'w-[25%]' };
      default: return { color: 'bg-gray-500', text: 'text-gray-500', icon: <FaClock />, label: 'Processing Order', progress: 'w-[10%]' };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
        className={`fixed top-24 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-700 ease-in-out ${isOnTrackingPage ? '-translate-y-32 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-auto'}`}
    >
      <div 
        onClick={() => navigate('/my-active-order')}
        className={`relative pl-2 pr-6 py-2 rounded-full shadow-2xl cursor-pointer group max-w-md w-full md:w-auto overflow-hidden border backdrop-blur-xl transition-all duration-500 ${isDark ? 'bg-white text-[#111827]' : 'bg-[#111827] text-white'}`}
      >
        <div className={`absolute bottom-0 left-0 h-[3px] w-full ${isDark ? 'bg-gray-100' : 'bg-white/10'}`}>
             <div className={`h-full ${config.color} ${config.progress} transition-all duration-1000`}></div>
        </div>
        <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center relative flex-shrink-0 border`}>
                <div className={`absolute inset-0 rounded-full opacity-20 animate-ping ${config.color}`}></div>
                <div className={`${config.text} text-lg drop-shadow-sm`}>{config.icon}</div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${config.color}`}></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Live Update</span>
                </div>
                <span className="text-sm font-bold truncate leading-tight">{config.label}</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full group-hover:bg-[#ffaa00] transition-colors duration-300">
                <FaChevronRight className="text-xs" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveOrderBanner;