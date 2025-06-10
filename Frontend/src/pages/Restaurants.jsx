// src/pages/Restaurants.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

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
      console.log('Fetching restaurants, token:', localStorage.getItem('token'));
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No token found, redirecting to login');
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:3003/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API response:', response.data);
        setRestaurants(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        console.error('Fetch restaurants error:', err.response?.data || err.message);
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
    <div className={`${standalone ? 'w-screen min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col text-gray-800 font-sans' : ''}`}>
      <div className="flex-grow pt-20">
        {/* Parallax Hero Section */}
        <div className="relative bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')] bg-fixed bg-center bg-cover py-28"
             style={{ backgroundAttachment: 'fixed', backgroundSize: 'cover', minHeight: '450px' }}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 animate-fade-in-up tracking-wide">
              Discover Premier Restaurants
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-4xl mx-auto mb-8">
              Explore a curated selection of world-class dining experiences tailored to your taste.
            </p>
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-20 bg-white/90 shadow-lg z-10 py-5 border-b border-[#ffaa00]/20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Search by name, address, or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/3 px-6 py-3 rounded-lg bg-gray-50 text-gray-800 border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent transition-all duration-200 placeholder-gray-500"
            />
            <select
              value={filterCuisine}
              onChange={(e) => setFilterCuisine(e.target.value)}
              className="w-full md:w-1/4 px-6 py-3 rounded-lg bg-gray-50 text-gray-800 border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent transition-all duration-200"
            >
              <option value="All">All Cuisines</option>
              {[...new Set(restaurants.map((r) => r.cuisine))].map((cuisine) => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full md:w-1/4 px-6 py-3 rounded-lg bg-gray-50 text-gray-800 border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent transition-all duration-200"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ffaa00]"></div>
              <p className="text-gray-700 mt-6 text-lg font-semibold">Loading restaurants...</p>
            </div>
          ) : error ? (
            <p className="text-red-600 text-center text-xl font-semibold">{error}</p>
          ) : filteredAndSortedRestaurants.length === 0 ? (
            <p className="text-gray-700 text-center text-xl font-semibold">No restaurants found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedRestaurants.map((restaurant, index) => (
                <div
                  key={restaurant._id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-[#ffaa00]/10 animate-[fadeInUp_0.5s_ease-out]"
                  style={{ animationDelay: `${index * 200}ms` }}
                  onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                >
                  <div className="h-56 bg-gray-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-500">Restaurant Image</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-1">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">{restaurant.address}</p>
                  <p className="text-sm font-medium text-[#ffaa00] mb-4">{restaurant.cuisine}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;