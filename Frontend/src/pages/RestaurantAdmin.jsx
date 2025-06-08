// src/pages/RestaurantAdmin.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RestaurantAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen bg-[#e3e3e3] font-sans text-[#4f4f4f] flex flex-col">
      <Navbar />
      <div className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#4f4f4f] mb-10 text-center tracking-wide">
            Restaurant Admin Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/admin/create-restaurant')}
              className="bg-[#ffaa00] text-white py-6 rounded-xl hover:bg-[#cc8800] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-xl text-center"
            >
              Create Restaurant
            </button>
            <button
              onClick={() => navigate('/admin/update-restaurant')}
              className="bg-[#ffaa00] text-white py-6 rounded-xl hover:bg-[#cc8800] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-xl text-center"
            >
              Update Restaurant
            </button>
            <button
              onClick={() => navigate('/admin/add-menu-item')}
              className="bg-[#ffaa00] text-white py-6 rounded-xl hover:bg-[#cc8800] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-xl text-center"
            >
              Add Menu Item
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RestaurantAdmin;