import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaTachometerAlt, FaClipboardList, FaUserCircle } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useModal } from '../context/ModalContext';

// NEW: Simulate automatic location updates for the driver
const SimulateLocation = ({ userId, token, showAlert }) => {
    useEffect(() => {
        let intervalId;
        const updateLocation = async () => {
            const latitude = 6.9271 + (Math.random() - 0.5) * 0.05; // Simulate small random movement
            const longitude = 79.8612 + (Math.random() - 0.5) * 0.05;
            
            try {
                // Call the new backend endpoint to update the driver's location
                await axios.post('http://localhost:3000/api/delivery/my-location', {
                    coordinates: [longitude, latitude]
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(`Location updated for driver ${userId}: [${longitude.toFixed(4)}, ${latitude.toFixed(4)}]`);
            } catch (err) {
                console.error('Failed to update location:', err.response?.data || err);
                showAlert('Failed to update your location. Please check your network.');
            }
        };

        if (userId && token) {
            // Update location every 10 seconds
            intervalId = setInterval(updateLocation, 10000);
        }

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [userId, token, showAlert]);

    return null;
};


const DeliveryPersonnelLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useModal();

  // Get user ID and token from session storage for location simulation
  const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
  const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
  let userId = null;
  if (token) {
      try {
          const decoded = jwtDecode(token);
          userId = decoded.userId;
      } catch (e) {
          console.error("Failed to decode token:", e);
      }
  }


  const handleLogout = () => {
    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    if (sessionKey) {
      sessionStorage.removeItem(sessionKey);
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
      {/* Simulate the driver's location updates */}
      <SimulateLocation userId={userId} token={token} showAlert={showAlert} />
      
      <aside className="fixed w-64 h-screen bg-gradient-to-br from-purple-600 to-indigo-500 text-white p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-8">Driver Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => navigate('/delivery-personnel')}
                className={`w-full text-left p-3 rounded-lg transition ${location.pathname === '/delivery-personnel' ? 'bg-purple-500 font-semibold' : 'hover:bg-purple-400'}`}
              >
                <FaTachometerAlt className="inline mr-2" /> Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/delivery-personnel/my-deliveries')}
                className={`w-full text-left p-3 rounded-lg transition ${location.pathname === '/delivery-personnel/my-deliveries' ? 'bg-purple-500 font-semibold' : 'hover:bg-purple-400'}`}
              >
                <FaClipboardList className="inline mr-2" /> My Deliveries
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/delivery-personnel/profile')}
                className={`w-full text-left p-3 rounded-lg transition ${location.pathname === '/delivery-personnel/profile' ? 'bg-purple-500 font-semibold' : 'hover:bg-purple-400'}`}
              >
                <FaUserCircle className="inline mr-2" /> My Profile
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left p-3 rounded-lg hover:bg-purple-400 mt-6"
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="ml-64 p-8 pt-6 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default DeliveryPersonnelLayout;
