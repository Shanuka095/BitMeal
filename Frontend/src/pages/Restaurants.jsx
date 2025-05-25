import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRestaurant(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load restaurant');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchRestaurant();
  }, [id, navigate]);

  return (
    <div className="w-screen min-h-screen bg-[#2A3335] p-4">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-[#F8FAFC] text-center">Loading...</p>
        ) : error ? (
          <p className="text-[#EF4444] text-center">{error}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-[#F8FAFC] mb-4">{restaurant.name}</h1>
            <p className="text-[#A1A1AA] mb-2">{restaurant.address}</p>
            <p className="text-[#A1A1AA] mb-4">{restaurant.cuisine}</p>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">Menu</h2>
            {restaurant.menu.length === 0 ? (
              <p className="text-[#F8FAFC] text-center">No menu items available</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurant.menu.map(item => (
                  <div key={item._id} className="bg-[rgba(248,250,252,0.1)] backdrop-blur-lg rounded-2xl p-4 border border-[rgba(248,250,252,0.1)]">
                    <h3 className="text-lg font-semibold text-[#F8FAFC]">{item.name}</h3>
                    <p className="text-[#A1A1AA] mt-1">{item.description || 'No description'}</p>
                    <p className="text-[#EFB036] mt-2">${item.price.toFixed(2)}</p>
                    <p className="text-[#A1A1AA] mt-1">Category: {item.category}</p>
                    <p className="text-[#A1A1AA] mt-1">Available: {item.available ? 'Yes' : 'No'}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Restaurant;