// src/pages/Restaurants.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3003/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load restaurants');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchRestaurants();
  }, [navigate]);

  return (
    <div className="w-screen min-h-screen bg-[#fffce5] font-sans flex flex-col">
      <Navbar />
      <div className="flex-grow pt-16">
        <div className="relative bg-gradient-to-br from-[#1F2937]/90 to-[#1F2937]/60 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F8FAFC] mb-4 animate-fade-in tracking-tight">
              Explore Restaurants
            </h1>
            <p className="text-lg sm:text-xl text-[#D1D5DB] max-w-2xl mx-auto">
              Find your favorite cuisines from top restaurants near you.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#e4b401]"></div>
              <p className="text-[#1F2937] mt-2 font-medium">Loading restaurants...</p>
            </div>
          ) : error ? (
            <p className="text-[#EF4444] text-center text-lg font-medium">{error}</p>
          ) : restaurants.length === 0 ? (
            <p className="text-[#1F2937] text-center text-lg font-medium">No restaurants available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant, index) => (
                <div
                  key={restaurant._id}
                  className="bg-white/95 rounded-2xl p-6 shadow-xl cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-[fadeInUp_0.5s_ease-out] border border-[#e4b401]/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                >
                  <h3 className="text-xl font-bold text-[#1F2937] mb-2">{restaurant.name}</h3>
                  <p className="text-[#6B7280] text-sm mb-1 line-clamp-1">{restaurant.address}</p>
                  <p className="text-[#e4b401] text-sm font-semibold">{restaurant.cuisine}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Restaurants;