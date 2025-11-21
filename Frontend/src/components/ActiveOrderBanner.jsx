import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMotorcycle, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import jwtDecode from 'jwt-decode';

const ActiveOrderBanner = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showAlert } = useModal();

  const fetchActiveOrder = async () => {
    try {
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      let decoded = null;
      if (token) {
        decoded = jwtDecode(token);
      }
      
      if (!token || decoded?.role !== 'customer') {
        setActiveOrder(null);
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/orders/my-active-order', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActiveOrder(response.data || null);
    } catch (err) {
      // --- FIX: Silently handle 404 errors (No Active Order) ---
      if (err.response && err.response.status === 404) {
        setActiveOrder(null); // No active order, just clear state
      } else {
        // Only log unexpected errors
        console.warn('Background active order fetch failed:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrder();
    const intervalId = setInterval(fetchActiveOrder, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaHourglassHalf className="inline mr-2 text-white" />;
      case 'confirmed': return <FaCheckCircle className="inline mr-2 text-green-300" />;
      case 'preparing': return <FaCheckCircle className="inline mr-2 text-green-300" />;
      case 'out_for_delivery': return <FaMotorcycle className="inline mr-2 text-white" />;
      case 'delivered': return <FaCheckCircle className="inline mr-2 text-green-300" />;
      case 'cancelled': return <FaTimesCircle className="inline mr-2 text-red-300" />;
      default: return null;
    }
  };

  if (loading || !activeOrder || activeOrder.status === 'delivered' || activeOrder.status === 'cancelled') {
    return null;
  }

  const driver = activeOrder.driver;

  return (
    <div
      className="fixed top-20 left-0 right-0 bg-[#058522] text-white p-3 shadow-lg z-40 cursor-pointer transition-all duration-300 hover:shadow-xl"
      onClick={() => navigate('/my-active-order')}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold flex items-center">
            {getStatusIcon(activeOrder.status)}
            Order #{activeOrder._id.substring(0, 8)} is {activeOrder.status.replace(/_/g, ' ')}
          </span>
          {driver && activeOrder.status === 'out_for_delivery' && (
            <div className="hidden md:flex items-center space-x-2 bg-black bg-opacity-20 rounded-full px-3 py-1">
              <span className="text-sm font-medium">Driver:</span>
              <span className="text-sm font-bold flex items-center space-x-1">
                <span>{driver.name}</span>
                <span className="text-xs text-gray-200">({driver.vehicleType})</span>
              </span>
            </div>
          )}
        </div>
        <button className="bg-white text-[#058522] px-4 py-1 rounded-full font-bold text-sm hover:bg-gray-100 transition">
          Track
        </button>
      </div>
    </div>
  );
};

export default ActiveOrderBanner;