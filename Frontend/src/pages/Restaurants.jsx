import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, FaSearch, FaMapMarkerAlt, FaMotorcycle, FaArrowRight, FaUtensils, 
  FaSortAmountDown, FaChevronDown, FaCheck 
} from 'react-icons/fa';
import PageLoader from '../components/PageLoader';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // rating, name, reviews
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  
  // State for Custom Dropdown
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setTimeout(async () => {
            const response = await axios.get('http://localhost:3000/api/restaurants/public');
            const data = response.data.data || response.data;
            const list = Array.isArray(data) ? data : [];
            setRestaurants(list);
            // Initial sort
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sorting Logic
  const sortList = (list, criteria) => {
    const sorted = [...list];
    if (criteria === 'rating') {
        return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (criteria === 'name') {
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'reviews') {
        return sorted.sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0));
    }
    return sorted;
  };

  // Filter & Sort Effect
  useEffect(() => {
    let results = restaurants;

    // 1. Filter
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

    // 2. Sort
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
    <div className={`min-h-screen bg-[#f8f9fa] pb-24 transition-opacity duration-1000 ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* 1. Advanced Header with Pattern Background */}
      <div className="relative bg-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-gray-100">
        {/* Subtle Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
            <span className="inline-block py-1.5 px-4 rounded-full bg-orange-50 text-[#ffaa00] text-xs font-bold tracking-widest uppercase mb-6 border border-orange-100">
                Premium Selection
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
                Explore The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-yellow-500">Menu</span>
            </h1>
            <p className="text-gray-400 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                From local street eats to Michelin-star experiences. Find your next craving here.
            </p>
        </div>
      </div>

      {/* 2. Sticky Command Center (Search & Sort) */}
      <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-5">
                
                {/* Advanced Search Input */}
                <div className="relative w-full md:w-[28rem] group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400 text-lg group-focus-within:text-[#ffaa00] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search restaurants, cuisines, or dishes..."
                        className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-gray-100/50 border border-gray-200 focus:bg-white focus:border-[#ffaa00] focus:ring-4 focus:ring-[#ffaa00]/10 outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center w-full md:w-auto justify-between md:justify-end gap-6">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">
                        Showing {filteredRestaurants.length} Results
                    </span>
                    
                    {/* Custom Professional Dropdown */}
                    <div className="relative" ref={sortRef}>
                        <button 
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className={`
                                flex items-center space-x-3 bg-white px-5 py-3.5 rounded-2xl border transition-all duration-300 min-w-[180px] justify-between
                                ${isSortOpen ? 'border-[#ffaa00] ring-4 ring-[#ffaa00]/10 shadow-lg' : 'border-gray-200 hover:border-gray-300 shadow-sm'}
                            `}
                        >
                            <div className="flex items-center text-gray-600 font-bold text-sm">
                                <FaSortAmountDown className="mr-2 text-[#ffaa00]" />
                                <span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
                            </div>
                            <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu Animation */}
                        <div className={`
                            absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 transform transition-all duration-200 origin-top-right
                            ${isSortOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                        `}>
                            <div className="p-1.5">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                                        className={`
                                            flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors
                                            ${sortBy === option.value 
                                                ? 'bg-orange-50 text-[#ffaa00]' 
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                        `}
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

      {/* 3. Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurant/${restaurant._id}`}
                className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 flex flex-col h-full overflow-hidden relative transform hover:-translate-y-1"
              >
                {/* Image Header */}
                <div className="relative h-64 overflow-hidden">
                  {restaurant.imageUrl ? (
                    <img
                      src={`http://localhost:3003/uploads/${restaurant.imageUrl}`}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                      <FaUtensils size={48} />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-50 transition-opacity duration-500"></div>

                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4">
                     <span className="bg-white/90 backdrop-blur text-green-700 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Open Now
                     </span>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                    <div className="bg-yellow-100 p-1 rounded-full">
                        <FaStar className="text-yellow-500 text-xs" />
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                        {restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "New"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">({restaurant.totalRatings})</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-col flex-grow">
                    {/* Title & Address */}
                    <div className="mb-5">
                        <h3 className="text-xl font-extrabold text-gray-900 mb-1.5 group-hover:text-[#ffaa00] transition-colors line-clamp-1">
                            {restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium flex items-center line-clamp-1">
                            <FaMapMarkerAlt className="mr-1.5 text-gray-300 text-xs" />
                            {restaurant.address}
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gray-50 mb-5 group-hover:bg-orange-50 transition-colors"></div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {restaurant.menu && restaurant.menu.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="text-[10px] font-bold bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg border border-gray-100 group-hover:border-orange-100 group-hover:text-orange-600 transition-all">
                                {item.category}
                            </span>
                        ))}
                        {restaurant.menu && restaurant.menu.length > 3 && (
                            <span className="text-[10px] font-bold bg-gray-50 text-gray-400 px-3 py-1.5 rounded-lg border border-gray-100">
                                +{restaurant.menu.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Footer Action */}
                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <FaMotorcycle className="mr-1.5 text-lg text-[#ffaa00]" /> 
                            <span className="pt-0.5">25-40 min</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#ffaa00] transition-colors duration-300 shadow-sm">
                            <FaArrowRight className="text-gray-400 group-hover:text-white text-sm transform -rotate-45 group-hover:rotate-0 transition-all duration-500" />
                        </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm text-center px-4">
            <div className="bg-orange-50 p-8 rounded-full mb-6 animate-bounce">
                <FaSearch className="text-[#ffaa00] text-5xl" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">No Results Found</h3>
            <p className="text-gray-500 max-w-md text-lg mb-8 leading-relaxed">
                We couldn't find any restaurants matching "<strong>{searchTerm}</strong>". <br/> Try adjusting your search or filters.
            </p>
            <button 
                onClick={() => { setSearchTerm(''); setSortBy('rating'); }}
                className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-[#ffaa00] hover:shadow-xl hover:shadow-orange-500/20 transition-all transform hover:-translate-y-1"
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