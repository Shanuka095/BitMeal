// src/pages/RestaurantDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaStar, FaPhoneAlt, FaCartPlus, FaHeart } from 'react-icons/fa';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
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
    // Placeholder for cart functionality
    console.log('Added to cart:', item.name);
    alert(`Added ${item.name} to cart!`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Placeholder for favorite functionality
    console.log(`Toggled favorite for ${restaurant.name}: ${!isFavorite}`);
  };

  return (
    <div className="w-screen min-h-screen bg-[#e3e3e3] font-sans text-[#4f4f4f] flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="flex-grow pt-20">
        {/* Parallax Hero Section */}
        <div className="relative bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')] bg-fixed bg-center bg-cover py-24 md:py-32"
             style={{ backgroundAttachment: 'fixed', backgroundSize: 'cover', minHeight: '500px' }}>
          <div className="absolute inset-0 bg-[#1F2937]/70"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffaa00]"></div>
              </div>
            ) : error ? (
              <p className="text-red-600 text-center text-xl font-semibold">{error}</p>
            ) : (
              <div className="text-center">
                <div className="h-72 bg-gray-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                  <span className="text-gray-500">Restaurant Image</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 animate-fade-in-up tracking-wide">
                  {restaurant.name}
                </h2>
                <div className="flex justify-center items-center gap-4 mb-4">
                  <span className="text-lg text-gray-200">{restaurant.address}</span>
                  <span className="flex items-center text-yellow-400">
                    {Array(5)
                      .fill()
                      .map((_, i) => (
                        <FaStar key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-300'} />
                      ))}
                    <span className="ml-2 text-gray-200 text-sm">(4.0/5)</span>
                  </span>
                  <button
                    onClick={toggleFavorite}
                    className={`ml-4 p-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-300'} hover:text-red-500 transition-colors duration-200`}
                  >
                    <FaHeart />
                  </button>
                </div>
                <p className="text-xl text-[#ffaa00] font-semibold mb-6">{restaurant.cuisine}</p>
                <button
                  className="bg-[#ffaa00] text-white px-6 py-3 rounded-lg hover:bg-[#cc8800] transition-colors duration-200 font-semibold flex items-center gap-2"
                  onClick={() => navigate(`/contact/${id}`)} // Placeholder route
                >
                  <FaPhoneAlt /> Contact Restaurant
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Menu Section */}
        {!loading && !error && restaurant && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h3 className="text-4xl font-bold text-[#4f4f4f] mb-10 text-center tracking-wide">Our Exquisite Menu</h3>
            {Object.keys(groupedMenu).length === 0 ? (
              <p className="text-[#4f4f4f] text-center text-xl font-medium">No menu items available</p>
            ) : (
              Object.entries(groupedMenu).map(([category, items], catIndex) => (
                <div key={category} className="mb-16">
                  <h4 className="text-2xl font-semibold text-[#4f4f4f] mb-8 border-b-2 border-[#ffaa00]/30 pb-2 tracking-wide">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-[#ffaa00]/10 animate-[fadeInUp_0.5s_ease-out]"
                        style={{ animationDelay: `${(catIndex * items.length + index) * 200}ms` }}
                      >
                        <div className="h-40 bg-gray-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                          <span className="text-gray-500">Item Image</span>
                        </div>
                        <h5 className="text-xl font-bold text-[#4f4f4f] mb-2 line-clamp-1">{item.name}</h5>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description || 'No description available'}</p>
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-lg font-semibold text-[#ffaa00]">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">Availability: {item.available ? 'In Stock' : 'Out of Stock'}</p>
                        </div>
                        <button
                          className="w-full py-2 bg-[#ffaa00] text-white rounded-lg hover:bg-[#cc8800] transition-colors duration-200 flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
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
      <Footer />
    </div>
  );
};

export default RestaurantDetails;