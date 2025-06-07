import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const Restaurants = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) {
        setError('Invalid restaurant ID');
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load restaurant');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchRestaurant();
  }, [id, navigate]);

  // Group menu items by category
  const groupedMenu = restaurant?.menu?.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    acc[category] = acc[category] || [];
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="w-screen min-h-screen bg-[#fffada] font-sans">
      {/* Restaurant Header */}
      <div className="relative bg-gradient-to-r from-[#d1b700]/20 to-[#fffada] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-[#1F2937] hover:text-[#d1b700] transition-colors duration-200 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <div className="text-center">
            {loading ? (
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d1b700]"></div>
            ) : error ? (
              <p className="text-[#EF4444] text-lg">{error}</p>
            ) : (
              <>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] mb-4 animate-fade-in">
                  {restaurant.name}
                </h2>
                <p className="text-lg text-[#6B7280] mb-2">{restaurant.address}</p>
                <p className="text-lg text-[#d1b700] font-semibold">{restaurant.cuisine}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menu Section */}
      {!loading && !error && restaurant && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h3 className="text-3xl font-bold text-[#1F2937] mb-8 text-center">Menu</h3>
          {Object.keys(groupedMenu).length === 0 ? (
            <p className="text-[#1F2937] text-center text-lg">No menu items available</p>
          ) : (
            Object.entries(groupedMenu).map(([category, items], catIndex) => (
              <div key={category} className="mb-12">
                <h4 className="text-2xl font-semibold text-[#1F2937] mb-6 border-b-2 border-[#d1b700] pb-2">
                  {category}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, index) => (
                    <div
                      key={item._id}
                      className="bg-white/30 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform animate-[fadeInUp_0.5s_ease-out]"
                      style={{ animationDelay: `${(catIndex * items.length + index) * 100}ms` }}
                    >
                      <h5 className="text-lg font-bold text-[#1F2937] mb-2">{item.name}</h5>
                      <p className="text-[#6B7280] text-sm mb-2">{item.description || 'No description available'}</p>
                      <p className="text-[#d1b700] text-lg font-semibold">${item.price.toFixed(2)}</p>
                      <p className="text-[#6B7280] text-sm mt-1">Available: {item.available ? 'Yes' : 'No'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Restaurants;