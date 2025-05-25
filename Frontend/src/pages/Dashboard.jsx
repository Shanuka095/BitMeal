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
          headers: { Authorization: `Bearer ${token}` }
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
    <div className="w-screen min-h-screen bg-[#2A3335] p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F8FAFC] mb-6">Welcome to BitMeal</h1>
        {loading ? (
          <p className="text-[#F8FAFC] text-center">Loading restaurants...</p>
        ) : error ? (
          <p className="text-[#EF4444] text-center">{error}</p>
        ) : restaurants.length === 0 ? (
          <p className="text-[#F8FAFC] text-center">No restaurants available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(restaurant => (
              <div key={restaurant._id} className="bg-[rgba(248,250,252,0.1)] backdrop-blur-lg rounded-2xl p-4 border border-[rgba(248,250,252,0.1)]">
                <h2 className="text-xl font-semibold text-[#F8FAFC]">{restaurant.name}</h2>
                <p className="text-[#A1A1AA] mt-1">{restaurant.address}</p>
                <p className="text-[#A1A1AA] mt-1">{restaurant.cuisine}</p>
                <button
                  onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                  className="mt-4 w-full py-2 px-4 rounded-lg font-semibold text-[#2A3335] bg-[#EFB036] hover:bg-[#D97706]"
                >
                  View Menu
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;