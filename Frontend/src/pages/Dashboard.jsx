import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, FaSearch, FaArrowRight, FaUtensils, FaHamburger, FaCoffee, 
  FaMotorcycle, FaFilter, FaChevronDown 
} from 'react-icons/fa';
import { GiNoodles, GiChickenLeg, GiBowlOfRice } from 'react-icons/gi';
import { useTheme } from '../context/ThemeContext'; 
import PageLoader from '../components/PageLoader'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const { theme } = useTheme(); 
  const isDark = theme === 'dark'; 

  const [allRestaurants, setAllRestaurants] = useState([]); 
  const [displayedRestaurants, setDisplayedRestaurants] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [pageReady, setPageReady] = useState(false); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(async () => {
            const response = await axios.get('http://localhost:3000/api/restaurants/public');
            const data = response.data.data || response.data;
            if (Array.isArray(data)) {
              setAllRestaurants(data);
              setDisplayedRestaurants(data);
            }
            setLoading(false);
            setTimeout(() => setPageReady(true), 100); 
        }, 1500); 
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setLoading(false);
        setPageReady(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = allRestaurants;

    if (selectedCategory !== 'All') {
      result = result.filter(restaurant => 
        restaurant.menu && restaurant.menu.some(item => 
          (item.category && item.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
          (item.name && item.name.toLowerCase().includes(selectedCategory.toLowerCase()))
        )
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(restaurant => 
        restaurant.name.toLowerCase().includes(term) ||
        (restaurant.menu && restaurant.menu.some(item => item.name.toLowerCase().includes(term)))
      );
    }

    if (minRating > 0) {
      result = result.filter(restaurant => (restaurant.averageRating || 0) >= minRating);
    }

    setDisplayedRestaurants(result);
  }, [selectedCategory, searchTerm, minRating, allRestaurants]);

  const categories = [
    { name: 'All', icon: <FaUtensils />, color: 'bg-gray-800' },
    { name: 'Rice', icon: <GiBowlOfRice />, color: 'bg-green-600' },
    { name: 'Kottu', icon: <GiNoodles />, color: 'bg-yellow-500' },
    { name: 'Fast Food', icon: <FaHamburger />, color: 'bg-red-500' },
    { name: 'Beverages', icon: <FaCoffee />, color: 'bg-blue-500' },
  ];

  const scrollToResults = () => {
    if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTopRatedClick = () => {
      setMinRating(4.5); 
      setSelectedCategory('All');
      scrollToResults();
  };

  const handleFreeDeliveryClick = () => {
      setMinRating(0);
      setSelectedCategory('All');
      scrollToResults();
  };

  if (loading) return <PageLoader />;

  return (
    // Added transition-colors to the main container
    <div className={`min-h-screen pb-20 transition-colors duration-500 ease-in-out ${isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'} ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* 1. Hero Section */}
      <div className="relative bg-gray-900 text-white h-[600px] md:h-[550px] flex items-center justify-center overflow-hidden transition-colors duration-500">
        {/* Gradient transition */}
        <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-500 ${isDark ? 'from-black/90 via-black/70 to-[#0f0f0f]' : 'from-black/80 via-black/60 to-transparent'} z-10`}></div>
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Food Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 animate-scale-in duration-[40s]"
        />
        
        <div className="relative z-20 text-center px-4 w-full max-w-5xl mx-auto -mt-16 md:-mt-20 animate-fade-in-down">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#ffaa00] text-[10px] md:text-xs font-bold tracking-[0.2em] mb-4 md:mb-6 shadow-lg">
                PREMIUM FOOD DELIVERY
            </span>
            <h1 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 tracking-tight leading-tight drop-shadow-2xl">
                Taste the <span className="text-[#ffaa00]">Extraordinary</span>
            </h1>
            <p className="text-gray-200 text-base md:text-xl mb-8 max-w-xl mx-auto font-light drop-shadow-md leading-relaxed">
                From local favorites to gourmet masterpieces, delivered fast.
            </p>
          
            {/* Search Bar - Added transitions to input */}
            <div className="relative max-w-xl mx-auto group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                    <FaSearch className="text-gray-400 text-lg group-focus-within:text-[#ffaa00] transition-colors duration-300" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search for 'Burger'..." 
                    className={`w-full py-4 md:py-5 pl-12 pr-32 rounded-full backdrop-blur-xl shadow-2xl border-4 focus:outline-none focus:ring-0 text-base md:text-lg font-medium transition-all duration-500 ease-in-out 
                      ${isDark 
                        ? 'bg-white/10 text-white border-white/5 focus:border-[#ffaa00]/50 placeholder-gray-500' 
                        : 'bg-white/95 text-gray-800 border-white/10 focus:border-[#ffaa00]/50 placeholder-gray-400'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && scrollToResults()}
                />
                <button 
                    onClick={scrollToResults}
                    className="absolute right-2 top-2 bottom-2 bg-[#ffaa00] text-white px-6 md:px-8 rounded-full font-bold hover:bg-[#e59400] transition-all shadow-lg hover:shadow-orange-500/30 outline-none focus:outline-none focus:ring-0 transform hover:scale-105 active:scale-95 text-sm md:text-base"
                >
                    Search
                </button>
            </div>
        </div>
      </div>

      {/* 2. Categories Filter - Added transitions */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-24 md:-mt-28 mb-16">
          <div className="flex justify-between items-center md:justify-center space-x-3 md:space-x-6 overflow-x-auto pb-8 pt-4 px-2 hide-scrollbar w-full snap-x">
            {categories.map((cat, index) => (
                <button 
                    key={index}
                    onClick={() => { setSelectedCategory(cat.name); scrollToResults(); }}
                    className={`
                      group flex flex-col items-center justify-center
                      min-w-[85px] md:min-w-[110px] h-28 md:h-36 
                      rounded-[2rem] shadow-xl border transition-all duration-500 ease-in-out
                      transform hover:-translate-y-2 snap-center
                      outline-none focus:outline-none focus:ring-0 active:ring-0
                      ${isDark 
                        ? 'bg-[#1a1a1a] border-white/10 shadow-black/50 hover:shadow-orange-500/10 hover:border-orange-500/30' 
                        : 'bg-white shadow-orange-500/5 border-gray-50 hover:shadow-2xl'}
                      ${selectedCategory === cat.name 
                        ? `ring-4 ${isDark ? 'ring-[#ffaa00]/40' : 'ring-[#ffaa00]/50'} scale-105 z-10` 
                        : 'hover:scale-105'}
                    `}
                >
                  <div className={`
                    w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white text-xl md:text-2xl mb-2 shadow-md transition-transform duration-500 group-hover:rotate-12
                    ${cat.color}
                  `}>
                      {cat.icon}
                  </div>
                  <span className={`
                    font-bold text-[10px] md:text-sm tracking-wide transition-colors duration-500
                    ${selectedCategory === cat.name ? 'text-[#ffaa00]' : (isDark ? 'text-gray-400 group-hover:text-[#ffaa00]' : 'text-gray-600 group-hover:text-[#ffaa00]')}
                  `}>
                      {cat.name}
                  </span>
                </button>
            ))}
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* 3. Promotional Banners - Added transitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div 
            onClick={handleFreeDeliveryClick}
            className={`rounded-[2rem] p-6 md:p-8 flex items-center justify-between shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border group transform hover:-translate-y-2 relative overflow-hidden outline-none 
              ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] to-[#222] border-white/10 hover:shadow-orange-500/10' : 'bg-gradient-to-br from-[#fff7e6] to-[#fff0e0] border-orange-100'}`}
          >
            <div className={`absolute -right-10 -top-10 w-48 h-48 ${isDark ? 'bg-orange-500/10' : 'bg-[#ffaa00]'} opacity-10 rounded-full transition-transform group-hover:scale-150 duration-700`}></div>
            <div className="relative z-10">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block tracking-wider ${isDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-200 text-orange-900'}`}>Limited Offer</span>
              <h3 className={`text-2xl md:text-3xl font-black mb-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-800'}`}>Free Delivery</h3>
              <p className={`mb-6 font-medium text-sm md:text-base transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>On your first 3 orders! <br/>No code needed.</p>
              <span className="bg-[#ffaa00] text-white px-6 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-bold group-hover:bg-[#e59400] transition-all shadow-lg hover:shadow-orange-500/40 inline-flex items-center">
                Order Now <FaArrowRight className="ml-2" />
              </span>
            </div>
            <FaMotorcycle className="text-7xl md:text-9xl text-orange-300 opacity-80 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:-translate-x-4 transition-transform duration-500 relative z-10" />
          </div>

          <div 
            onClick={handleTopRatedClick}
            className={`rounded-[2rem] p-6 md:p-8 flex items-center justify-between shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border group transform hover:-translate-y-2 relative overflow-hidden outline-none 
              ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] to-[#222] border-white/10 hover:shadow-blue-500/10' : 'bg-gradient-to-br from-[#e6f7ff] to-[#dff4ff] border-blue-100'}`}
          >
             <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500 opacity-10 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
             <div className="relative z-10">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block tracking-wider ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-200 text-blue-900'}`}>Community Choice</span>
              <h3 className={`text-2xl md:text-3xl font-black mb-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-800'}`}>Top Rated</h3>
              <p className={`mb-6 font-medium text-sm md:text-base transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Discover 5-star winners.</p>
              <span className="bg-blue-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-bold group-hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/40 inline-flex items-center">
                View Winners <FaArrowRight className="ml-2" />
              </span>
            </div>
            <FaStar className="text-7xl md:text-9xl text-blue-300 opacity-80 group-hover:scale-110 group-hover:rotate-12 group-hover:-translate-x-4 transition-transform duration-500 relative z-10" />
          </div>
        </div>

        {/* 4. Filter Bar */}
        <div ref={resultsRef} className={`flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b pb-6 animate-fade-in-up transition-colors duration-500 ${isDark ? 'border-white/10' : 'border-gray-200'}`} style={{ animationDelay: '0.3s' }}>
          <div className="mb-6 md:mb-0">
            <h2 className={`text-3xl md:text-4xl font-extrabold flex items-center flex-wrap gap-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedCategory === 'All' ? 'Restaurants Near You' : `${selectedCategory} Spots`}
              {minRating > 0 && <span className={`text-xs md:text-sm font-bold text-[#ffaa00] px-3 py-1 rounded-full border shadow-sm ${isDark ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-100'}`}>Rated {minRating}+ ★ Only</span>}
            </h2>
            <p className={`mt-2 text-sm md:text-base font-medium transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              We found {displayedRestaurants.length} {displayedRestaurants.length === 1 ? 'place' : 'places'} for you
            </p>
          </div>

          {/* Rating Pills */}
          <div className={`flex items-center p-2 rounded-full shadow-lg border w-full md:w-auto justify-between md:justify-start transition-colors duration-500 ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
             {[0, 3, 4, 4.5].map((rating) => (
               <button
                 key={rating}
                 onClick={() => setMinRating(rating)}
                 className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-0 outline-none ${
                   minRating === rating 
                   ? 'bg-gray-900 text-white shadow-md transform scale-105' 
                   : isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                 }`}
               >
                 {rating === 0 ? 'All' : `${rating}+ ★`}
               </button>
             ))}
          </div>
        </div>

        {/* Results Grid */}
        {displayedRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {displayedRestaurants.map((restaurant) => (
              <div 
                key={restaurant._id}
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                className={`rounded-3xl shadow-md hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 cursor-pointer group overflow-hidden border flex flex-col h-full transform hover:-translate-y-2 ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}
              >
                {/* Image Area */}
                <div className={`relative h-52 md:h-56 overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                   {restaurant.imageUrl ? (
                    <img 
                      src={`http://localhost:3003/uploads/${restaurant.imageUrl}`} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                   ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FaUtensils size={40} />
                    </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                   
                   {/* Badges */}
                   <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg flex items-center text-sm font-bold text-gray-900">
                     <FaStar className="text-yellow-400 mr-1.5" size={14} />
                     {restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "New"}
                     <span className="text-gray-400 font-normal ml-1 text-xs">({restaurant.totalRatings})</span>
                   </div>
                   
                   <div className="absolute top-4 left-4 bg-[#ffaa00] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
                     Free Delivery
                   </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className={`text-xl font-extrabold mb-2 group-hover:text-[#ffaa00] transition-colors duration-300 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{restaurant.name}</h3>
                    <p className={`text-sm mb-4 line-clamp-1 flex items-center transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FaSearch className="mr-2 text-gray-300 text-xs" />
                        {restaurant.address}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {restaurant.menu && restaurant.menu.slice(0, 2).map((item, idx) => (
                            <span key={idx} className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-colors duration-500 ${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                {item.category}
                            </span>
                        ))}
                    </div>
                  </div>
                  
                  <div className={`flex items-center justify-between pt-4 border-t mt-auto transition-colors duration-500 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                    <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wide">
                        <FaMotorcycle className="mr-2 text-[#ffaa00] text-lg" /> 20-30 min
                    </div>
                    <button className="text-[#ffaa00] text-sm font-bold group-hover:translate-x-2 transition-transform flex items-center">
                        View Menu <FaArrowRight className="ml-2 text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
            // Professional "Not Found" State
            <div className={`text-center py-32 rounded-[2.5rem] border shadow-sm animate-fade-in-up transition-all duration-500 ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 text-[#ffaa00] text-5xl shadow-inner animate-bounce ${isDark ? 'bg-white/5' : 'bg-orange-50'}`}>
                    <FaSearch />
                </div>
                <h3 className={`text-3xl font-black mb-3 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-800'}`}>No restaurants found</h3>
                <p className={`max-w-md mx-auto text-lg transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>We couldn't find any matches for "<strong>{searchTerm}</strong>" with your current filters.</p>
                <button 
                    onClick={() => { setSelectedCategory('All'); setSearchTerm(''); setMinRating(0); }}
                    className={`mt-10 px-10 py-4 rounded-full font-bold hover:bg-[#e59400] transition-all shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-1 outline-none focus:outline-none focus:ring-0 ${isDark ? 'bg-white text-black hover:text-white' : 'bg-gray-900 text-white'}`}
                >
                    Clear All Filters
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;