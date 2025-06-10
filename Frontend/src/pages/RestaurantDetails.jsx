// src/pages/RestaurantDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaPhoneAlt, FaCartPlus } from 'react-icons/fa';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3003/api/restaurants/${id}`, {
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

  const groupedMenu = restaurant?.menu?.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    acc[category] = acc[category] || [];
    acc[category].push(item);
    return acc;
  }, {});

  const handleAddToCart = (item) => {
    console.log('Added to cart:', item.name);
    alert(`Added ${item.name} to cart!`);
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col text-gray-800 font-sans">
      <div className="flex-grow pt-20">
        {/* Hero Section with Image Placeholder */}
        <div className="relative bg-gradient-to-br from-[#1F2937]/80 to-[#1F2937]/50 py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <button
              onClick={() => navigate('/restaurants')}
              className="flex items-center text-white hover:text-[#ffaa00] transition-colors duration-300 mb-6 font-medium text-lg"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Restaurants
            </button>
            {loading ? (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ffaa00]"></div>
              </div>
            ) : error ? (
              <p className="text-red-600 text-center text-xl font-semibold">{error}</p>
            ) : (
              <div className="text-center">
                <div className="h-72 bg-gray-200 rounded-lg mb-8 flex items-center justify-center">
                  <span className="text-gray-500">Restaurant Image</span>
                </div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 animate-fade-in tracking-wide">
                  {restaurant.name}
                </h2>
                <div className="flex justify-center items-center gap-4 mb-6">
                  <span className="text-lg text-gray-200">{restaurant.address}</span>
                  <span className="flex items-center text-yellow-400">
                    {Array(5)
                      .fill()
                      .map((_, i) => (
                        <FaStar key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-300'} />
                      ))}
                    <span className="ml-3 text-gray-200 text-base">(4.0/5)</span>
                  </span>
                </div>
                <p className="text-2xl text-[#ffaa00] font-semibold mb-8">{restaurant.cuisine}</p>
                <button
                  className="bg-[#ffaa00] text-white px-8 py-3 rounded-lg hover:bg-[#e59400] transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                  onClick={() => navigate(`/contact/${id}`)}
                >
                  <FaPhoneAlt className="inline mr-2" /> Contact Restaurant
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Menu Section */}
        {!loading && !error && restaurant && (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
            <h3 className="text-4xl font-bold text-gray-800 mb-12 text-center tracking-wide">Our Menu</h3>
            {Object.keys(groupedMenu).length === 0 ? (
              <p className="text-gray-700 text-center text-lg font-medium">No menu items available</p>
            ) : (
              Object.entries(groupedMenu).map(([category, items], catIndex) => (
                <div key={category} className="mb-20">
                  <h4 className="text-2xl font-semibold text-gray-800 mb-8 border-b-2 border-[#ffaa00]/30 pb-3 tracking-wide">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-[#ffaa00]/10 animate-[fadeInUp_0.5s_ease-out]"
                        style={{ animationDelay: `${(catIndex * items.length + index) * 150}ms` }}
                      >
                        <div className="h-40 bg-gray-200 rounded-lg mb-5 flex items-center justify-center">
                          <span className="text-gray-500">Item Image</span>
                        </div>
                        <h5 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1">{item.name}</h5>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description || 'No description available'}</p>
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-lg font-semibold text-[#ffaa00]">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">Availability: {item.available ? 'In Stock' : 'Out of Stock'}</p>
                        </div>
                        <button
                          className="w-full py-2 bg-[#ffaa00] text-white rounded-lg hover:bg-[#e59400] transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          disabled={!item.available}
                        >
                          <FaCartPlus /> Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;