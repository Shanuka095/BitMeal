import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, FaSearch, FaMapMarkerAlt, FaMotorcycle, FaArrowRight, FaUtensils, 
  FaSortAmountDown, FaChevronDown, FaCheck, FaFilter 
} from 'react-icons/fa';
import PageLoader from '../components/PageLoader';
import { useTheme } from '../context/ThemeContext'; // Theme Context

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating'); 
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const sortRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setTimeout(async () => {
            const response = await axios.get('http://localhost:3000/api/restaurants/public');
            const data = response.data.data || response.data;
            const list = Array.isArray(data) ? data : [];
            setRestaurants(list);
            setFilteredRestaurants(sortList(list, 'rating'));
            setLoading(false);
            setTimeout(() => setPageReady(true), 100);
        }, 1500);
      } catch (err) {
        console.error('Failed to fetch restaurants', err);
        setLoading(false);
        setPageReady(true);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortList = (list, criteria) => {
    const sorted = [...list];
    if (criteria === 'rating') return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    if (criteria === 'name') return sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (criteria === 'reviews') return sorted.sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0));
    return sorted;
  };

  useEffect(() => {
    let results = restaurants;
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        results = results.filter(restaurant => {
            if (restaurant.name.toLowerCase().includes(lowerTerm)) return true;
            if (restaurant.menu && restaurant.menu.some(item =>
                item.name.toLowerCase().includes(lowerTerm) ||
                item.category.toLowerCase().includes(lowerTerm)
            )) return true;
            return false;
        });
    }
    results = sortList(results, sortBy);
    setFilteredRestaurants(results);
  }, [searchTerm, sortBy, restaurants]);

  const sortOptions = [
    { value: 'rating', label: 'Top Rated' },
    { value: 'reviews', label: 'Most Reviewed' },
    { value: 'name', label: 'Name (A-Z)' },
  ];

  if (loading) return <PageLoader />;

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-500 ${isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'} ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* 1. Hero Header */}
      <div className={`relative pt-32 pb-16 px-4 overflow-hidden border-b transition-colors duration-500 ${isDark ? 'bg-[#111] border-white/5' : 'bg-white border-gray-100'}`}>
        <div className={`absolute inset-0 opacity-[0.03] ${isDark ? 'bg-[radial-gradient(white_1px,transparent_1px)]' : 'bg-[radial-gradient(black_1px,transparent_1px)]'}`} style={{ backgroundSize: '24px 24px' }}></div>
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#ffaa00]/10 text-[#ffaa00] text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-[#ffaa00]/20 shadow-lg shadow-orange-500/10 animate-fade-in-down">
                PREMIUM SELECTION
            </span>
            <h1 className={`text-5xl md:text-7xl font-black mb-6 tracking-tight animate-fade-in-down ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Explore The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-orange-500">Menu</span>
            </h1>
            <p className={`font-medium text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in-up ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                From local street eats to Michelin-star experiences. Find your next craving here.
            </p>
        </div>
      </div>

      {/* 2. Sticky Command Center */}
      <div className={`sticky top-[64px] z-40 backdrop-blur-xl border-b shadow-sm transition-all duration-500 ${isDark ? 'bg-[#0f0f0f]/90 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-5">
                
                {/* Search */}
                <div className="relative w-full md:w-[28rem] group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400 text-lg group-focus-within:text-[#ffaa00] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search restaurants, cuisines..."
                        className={`w-full py-3.5 pl-12 pr-4 rounded-2xl border focus:ring-4 focus:ring-[#ffaa00]/10 outline-none transition-all font-medium ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-[#ffaa00] placeholder-gray-500' : 'bg-gray-100/50 border-gray-200 focus:bg-white focus:border-[#ffaa00] text-gray-700'}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Sort */}
                <div className="flex items-center w-full md:w-auto justify-between md:justify-end gap-6">
                    <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Showing {filteredRestaurants.length} Results
                    </span>
                    
                    <div className="relative" ref={sortRef}>
                        <button 
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl border transition-all duration-300 min-w-[180px] justify-between ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-200' : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600'}`}
                        >
                            <div className="flex items-center font-bold text-sm">
                                <FaSortAmountDown className="mr-2 text-[#ffaa00]" />
                                <span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
                            </div>
                            <FaChevronDown className={`text-xs transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        </button>

                        <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl border overflow-hidden z-50 transform transition-all duration-200 origin-top-right ${isSortOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'} ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                            <div className="p-1.5">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${sortBy === option.value ? 'bg-orange-500/10 text-[#ffaa00]' : (isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}`}
                                    >
                                        <span>{option.label}</span>
                                        {sortBy === option.value && <FaCheck className="text-xs" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 3. Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurant/${restaurant._id}`}
                className={`group rounded-[2.5rem] border shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 flex flex-col h-full overflow-hidden relative transform hover:-translate-y-2 ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 shadow-gray-200/50'}`}
              >
                <div className="relative h-64 overflow-hidden">
                  {restaurant.imageUrl ? (
                    <img
                      src={`http://localhost:3003/uploads/${restaurant.imageUrl}`}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-800 text-gray-600' : 'bg-gray-100 text-gray-300'}`}>
                      <FaUtensils size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-50 transition-opacity duration-500"></div>

                  <div className="absolute top-4 left-4">
                     <span className="bg-white/90 backdrop-blur text-green-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Open
                     </span>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                    <FaStar className="text-yellow-500 text-xs" />
                    <span className="text-sm font-bold text-gray-900">{restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "New"}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">({restaurant.totalRatings})</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-5">
                        <h3 className={`text-xl font-extrabold mb-1.5 group-hover:text-[#ffaa00] transition-colors line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{restaurant.name}</h3>
                        <p className={`text-sm font-medium flex items-center line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <FaMapMarkerAlt className="mr-1.5 text-gray-400 text-xs" />
                            {restaurant.address}
                        </p>
                    </div>

                    <div className={`h-px w-full mb-5 group-hover:bg-orange-500/20 transition-colors ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}></div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {restaurant.menu && restaurant.menu.slice(0, 3).map((item, idx) => (
                            <span key={idx} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${isDark ? 'bg-white/5 text-gray-300 border-white/10 group-hover:border-orange-500/30' : 'bg-gray-50 text-gray-500 border-gray-100 group-hover:border-orange-100 group-hover:text-orange-600'}`}>
                                {item.category}
                            </span>
                        ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <FaMotorcycle className="mr-1.5 text-lg text-[#ffaa00]" /> 
                            <span className="pt-0.5">25-40 min</span>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-[#ffaa00] transition-colors duration-300 shadow-sm ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <FaArrowRight className={`text-sm transform -rotate-45 group-hover:rotate-0 transition-all duration-500 group-hover:text-white ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                        </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center py-32 rounded-[3rem] border shadow-sm text-center px-4 ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
            <div className={`p-8 rounded-full mb-6 animate-bounce ${isDark ? 'bg-white/5' : 'bg-orange-50'}`}>
                <FaSearch className="text-[#ffaa00] text-5xl" />
            </div>
            <h3 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Results Found</h3>
            <p className={`max-w-md text-lg mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                We couldn't find any restaurants matching "<strong>{searchTerm}</strong>".
            </p>
            <button 
                onClick={() => { setSearchTerm(''); setSortBy('rating'); }}
                className={`px-10 py-4 rounded-2xl font-bold transition-all transform hover:-translate-y-1 ${isDark ? 'bg-white text-black hover:bg-[#ffaa00] hover:text-white' : 'bg-gray-900 text-white hover:bg-[#ffaa00]'}`}
            >
                Clear Search & Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;