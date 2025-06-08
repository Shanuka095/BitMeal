// src/pages/Restaurants.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Restaurants = ({ standalone = true }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('All');
  const [sortOption, setSortOption] = useState('name-asc');
  const navigate = useNavigate();
  const location = useLocation();

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

  const filteredAndSortedRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterCuisine === 'All' || restaurant.cuisine === filterCuisine;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="w-screen min-h-screen bg-[#e3e3e3] font-sans text-[#4f4f4f] flex flex-col overflow-x-hidden">
      {standalone && <Navbar />}
      <div className={`${standalone ? 'flex-grow pt-20' : 'pt-0'}`}>
        {/* Parallax Hero Section */}
        <div className="relative bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')] bg-fixed bg-center bg-cover py-24 md:py-32"
             style={{ backgroundAttachment: 'fixed', backgroundSize: 'cover', minHeight: '400px' }}>
          <div className="absolute inset-0 bg-[#1F2937]/70"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 animate-fade-in-up tracking-wide">
              Discover Premier Restaurants
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-6">
              Explore a world-class selection of dining options tailored to your taste.
            </p>
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-20 bg-[#e3e3e3] shadow-md z-10 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Search by name, address, or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/3 px-6 py-3 rounded-lg bg-white/90 text-[#4f4f4f] border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent transition-all duration-200 placeholder-gray-500"
            />
            <select
              value={filterCuisine}
              onChange={(e) => setFilterCuisine(e.target.value)}
              className="w-full md:w-1/4 px-4 py-3 rounded-lg bg-white/90 text-[#4f4f4f] border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent transition-all duration-200"
            >
              <option value="All">All Cuisines</option>
              {[...new Set(restaurants.map((r) => r.cuisine))].map((cuisine) => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full md:w-1/4 px-4 py-3 rounded-lg bg-white/90 text-[#4f4f4f] border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent transition-all duration-200"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffaa00]"></div>
              <p className="text-[#4f4f4f] mt-4 font-semibold">Loading restaurants...</p>
            </div>
          ) : error ? (
            <p className="text-red-600 text-center text-xl font-semibold">{error}</p>
          ) : filteredAndSortedRestaurants.length === 0 ? (
            <p className="text-[#4f4f4f] text-center text-xl font-semibold">No restaurants found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredAndSortedRestaurants.map((restaurant, index) => (
                <div
                  key={restaurant._id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border border-[#ffaa00]/10 animate-[fadeInUp_0.5s_ease-out] cursor-pointer"
                  style={{ animationDelay: `${index * 200}ms` }}
                  onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                >
                  <div className="h-48 bg-gray-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-500">Restaurant Image</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#4f4f4f] mb-2 line-clamp-1">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">{restaurant.address}</p>
                  <p className="text-sm font-medium text-[#ffaa00] mb-4">{restaurant.cuisine}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {standalone && <Footer />}
    </div>
  );
};

export default Restaurants;