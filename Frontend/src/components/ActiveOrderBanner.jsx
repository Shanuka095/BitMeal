import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaMotorcycle, FaUtensils, FaChevronRight, FaClock, FaCheckCircle } from 'react-icons/fa';
import jwtDecode from 'jwt-decode';

const ActiveOrderBanner = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchActiveOrder = async () => {
    try {
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      
      if (!token) {
        setActiveOrder(null);
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(token);
      if (decoded?.role !== 'customer') {
        setActiveOrder(null);
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/orders/my-active-order', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActiveOrder(response.data || null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setActiveOrder(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrder();
    const intervalId = setInterval(fetchActiveOrder, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // Determine if we should show the banner content
  const hasActiveOrder = !loading && activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled';
  
  // Check if we are currently on the tracking page
  const isOnTrackingPage = location.pathname === '/my-active-order';

  // If no order exists, return null immediately
  if (!hasActiveOrder) return null;

  const getStatusConfig = () => {
    switch (activeOrder.status) {
      case 'out_for_delivery': return { color: 'bg-green-500', text: 'text-green-400', icon: <FaMotorcycle />, label: 'Order is on the way', progress: 'w-[80%]' };
      case 'preparing': return { color: 'bg-orange-500', text: 'text-orange-400', icon: <FaUtensils />, label: 'Chef is preparing food', progress: 'w-[50%]' };
      case 'confirmed': return { color: 'bg-blue-500', text: 'text-blue-400', icon: <FaCheckCircle />, label: 'Order Confirmed', progress: 'w-[25%]' };
      default: return { color: 'bg-gray-500', text: 'text-gray-400', icon: <FaClock />, label: 'Processing Order', progress: 'w-[10%]' };
    }
  };

  const config = getStatusConfig();

  return (
    // Wrapper controls the entrance/exit animation based on the current page
    <div 
        className={`
            fixed top-24 left-0 right-0 z-50 flex justify-center px-4 
            transition-all duration-700 ease-in-out transform
            ${isOnTrackingPage ? '-translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-auto'}
        `}
    >
      <div 
        onClick={() => navigate('/my-active-order')}
        className="relative bg-[#0f0f0f]/90 backdrop-blur-xl text-white pl-2 pr-6 py-2 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 cursor-pointer hover:scale-[1.02] hover:shadow-[#ffaa00]/20 transition-all duration-500 group max-w-md w-full md:w-auto overflow-hidden"
      >
        {/* Progress Bar Background */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-white/10 w-full">
             <div className={`h-full ${config.color} ${config.progress} transition-all duration-1000`}></div>
        </div>

        <div className="flex items-center gap-4">
            {/* Left: Floating Icon */}
            <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative flex-shrink-0">
                <div className={`absolute inset-0 rounded-full opacity-20 animate-ping ${config.color}`}></div>
                <div className={`${config.text} text-lg drop-shadow-md`}>{config.icon}</div>
            </div>

            {/* Middle: Info */}
            <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${config.color} shadow-[0_0_10px_currentColor]`}></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Live Update</span>
                </div>
                <span className="text-sm font-bold text-white truncate leading-tight">{config.label}</span>
            </div>

            {/* Right: Action */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#ffaa00] transition-colors duration-300">
                <FaChevronRight className="text-xs text-gray-400 group-hover:text-black" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveOrderBanner;