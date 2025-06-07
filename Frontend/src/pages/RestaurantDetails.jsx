// src/pages/RestaurantDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

  return (
    <div className="w-screen min-h-screen bg-[#fffce5] font-sans flex flex-col">
      <Navbar />
      <div className="flex-grow pt-16">
        <div className="relative bg-gradient-to-br from-[#1F2937]/90 to-[#1F2937]/60 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate('/restaurants')}
              className="flex items-center text-[#F8FAFC] hover:text-[#e4b401] transition-colors duration-300 mb-6 font-medium text-lg"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="text-center">
              {loading ? (
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#e4b401]"></div>
              ) : error ? (
                <p className="text-[#EF4444] text-lg font-medium">{error}</p>
              ) : (
                <>
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-[#F8FAFC] mb-4 animate-fade-in tracking-tight">
                    {restaurant.name}
                  </h2>
                  <p className="text-lg text-[#D1D5DB] mb-2">{restaurant.address}</p>
                  <p className="text-lg text-[#e4b401] font-semibold">{restaurant.cuisine}</p>
                </>
              )}
            </div>
          </div>
        </div>
        {!loading && !error && restaurant && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h3 className="text-3xl font-bold text-[#1F2937] mb-8 text-center tracking-tight">Menu</h3>
            {Object.keys(groupedMenu).length === 0 ? (
              <p className="text-[#1F2937] text-center text-lg font-medium">No menu items available</p>
            ) : (
              Object.entries(groupedMenu).map(([category, items], catIndex) => (
                <div key={category} className="mb-12">
                  <h4 className="text-2xl font-semibold text-[#1F2937] mb-6 border-b-2 border-[#e4b401] pb-2 tracking-tight">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, index) => (
                      <div
                        key={item._id}
                        className="bg-white/95 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-[fadeInUp_0.5s_ease-out] border border-[#e4b401]/20"
                        style={{ animationDelay: `${(catIndex * items.length + index) * 100}ms` }}
                      >
                        <h5 className="text-lg font-bold text-[#1F2937] mb-2">{item.name}</h5>
                        <p className="text-[#6B7280] text-sm mb-2 line-clamp-2">{item.description || 'No description available'}</p>
                        <p className="text-[#e4b401] text-lg font-semibold">${item.price.toFixed(2)}</p>
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
      <Footer />
    </div>
  );
};

export default RestaurantDetails;