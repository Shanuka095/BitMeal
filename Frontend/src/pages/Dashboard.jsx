import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/restaurants', {
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
    <div className="w-screen min-h-screen bg-[#fffada] font-sans">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#d1b700]/20 to-[#fffada] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] mb-4 animate-fade-in">
            Welcome to BitMeal
          </h1>
          <p className="text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto">
            Discover delicious cuisines from top restaurants in your area.
          </p>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d1b700]"></div>
            <p className="text-[#1F2937] mt-2">Loading restaurants...</p>
          </div>
        ) : error ? (
          <p className="text-[#EF4444] text-center text-lg">{error}</p>
        ) : restaurants.length === 0 ? (
          <p className="text-[#1F2937] text-center text-lg">No restaurants available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <div
                key={restaurant._id}
                className="bg-white/30 backdrop-blur-lg rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 transform animate-[fadeInUp_0.5s_ease-out] delay-100"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/restaurants/${restaurant._id}`)}
              >
                <h3 className="text-xl font-bold text-[#1F2937] mb-2">{restaurant.name}</h3>
                <p className="text-[#6B7280] text-sm mb-1">{restaurant.address}</p>
                <p className="text-[#d1b700] text-sm font-semibold">{restaurant.cuisine}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;