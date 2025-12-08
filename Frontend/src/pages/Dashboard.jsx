import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, FaSearch, FaArrowRight, FaUtensils, FaHamburger, FaCoffee, 
  FaMotorcycle, FaFilter, FaChevronDown, FaPizzaSlice, FaIceCream, FaLeaf, FaPepperHot 
} from 'react-icons/fa';
import { GiNoodles, GiChickenLeg, GiBowlOfRice, GiDonut } from 'react-icons/gi';
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

  // --- Styles ---
  const bgBase = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8f9fa]';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardClass = isDark 
    ? 'bg-[#1a1a1a] border-white/5 hover:shadow-orange-500/10 hover:border-orange-500/30' 
    : 'bg-white border-gray-100 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-100';
  const searchInputClass = isDark 
    ? 'bg-black/40 border-gray-600 text-white placeholder-gray-400 focus:border-[#ffaa00] focus:ring-4 focus:ring-[#ffaa00]/10' 
    : 'bg-white border-white/20 text-gray-800 placeholder-gray-400 focus:border-[#ffaa00] focus:ring-4 focus:ring-[#ffaa00]/20 shadow-xl';

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-500 relative overflow-x-hidden ${bgBase} ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* --- ANIMATION STYLES --- */}
      <style>{`
        @keyframes drift {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(10deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-drift-slow { animation: drift 20s ease-in-out infinite; }
        .animate-drift-medium { animation: drift 15s ease-in-out infinite; }
        .animate-drift-fast { animation: drift 12s ease-in-out infinite; }
      `}</style>

      {/* --- COLORFUL FLOATING BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <FaPizzaSlice className={`absolute text-6xl animate-drift-slow top-24 left-[5%] ${isDark ? 'text-white/5' : 'text-orange-500/10'}`} />
          <FaHamburger className={`absolute text-9xl animate-drift-medium bottom-10 right-[5%] ${isDark ? 'text-white/5' : 'text-[#ffaa00]/10'}`} style={{ animationDelay: '1s' }} />
          <FaIceCream className={`absolute text-5xl animate-drift-fast top-[40%] right-[15%] ${isDark ? 'text-white/5' : 'text-pink-500/10'}`} style={{ animationDelay: '2s' }} />
          <GiDonut className={`absolute text-8xl animate-drift-slow bottom-[15%] left-[8%] ${isDark ? 'text-white/5' : 'text-purple-500/10'}`} style={{ animationDelay: '3s' }} />
          <FaLeaf className={`absolute text-4xl animate-drift-fast top-[15%] right-[40%] ${isDark ? 'text-white/5' : 'text-green-500/10'}`} style={{ animationDelay: '0.5s' }} />
          <FaPepperHot className={`absolute text-6xl animate-drift-slow top-[50%] left-[2%] ${isDark ? 'text-white/5' : 'text-red-600/10'}`} style={{ animationDelay: '1.5s' }} />
      </div>

      {/* 1. Hero Section */}
      <div className="relative bg-gray-900 text-white h-[550px] md:h-[600px] flex items-center justify-center overflow-hidden z-10">
        <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-500 ${isDark ? 'from-black/90 via-black/80 to-[#0a0a0a]' : 'from-black/80 via-black/60 to-transparent'} z-10`}></div>
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Food Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 animate-scale-in duration-[40s]"
        />
        
        <div className="relative z-20 text-center px-4 w-full max-w-5xl mx-auto -mt-16 md:-mt-20 animate-fade-in-down">
            <span className="inline-block py-1.5 px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#ffaa00] text-[10px] md:text-xs font-extrabold tracking-[0.25em] mb-6 shadow-lg animate-pulse">
                PREMIUM FOOD DELIVERY
            </span>
            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-tight drop-shadow-2xl">
                Taste the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-orange-500">Extraordinary</span>
            </h1>
            <p className="text-gray-200 text-base md:text-xl mb-10 max-w-xl mx-auto font-medium drop-shadow-md leading-relaxed">
                From local favorites to gourmet masterpieces, delivered fast to your doorstep.
            </p>
          
            {/* Advanced Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                    <FaSearch className="text-gray-400 text-lg group-focus-within:text-[#ffaa00] transition-colors duration-300" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search for 'Burger'..." 
                    className={`w-full py-5 pl-14 pr-36 rounded-full backdrop-blur-xl border-2 outline-none text-lg font-medium transition-all duration-300 ${searchInputClass}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && scrollToResults()}
                />
                <button 
                    onClick={scrollToResults}
                    className="absolute right-2 top-2 bottom-2 bg-[#ffaa00] text-white px-8 rounded-full font-bold hover:bg-[#e59400] transition-all shadow-lg hover:shadow-orange-500/30 outline-none focus:outline-none focus:ring-0 transform hover:scale-105 active:scale-95 text-sm md:text-base"
                >
                    Search
                </button>
            </div>
        </div>
      </div>

      {/* 2. Categories Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-24 md:-mt-28 mb-20">
          <div className="flex justify-between items-center md:justify-center space-x-4 md:space-x-8 overflow-x-auto pb-8 pt-4 px-2 hide-scrollbar w-full snap-x">
            {categories.map((cat, index) => (
                <button 
                    key={index}
                    onClick={() => { setSelectedCategory(cat.name); scrollToResults(); }}
                    className={`
                      group flex flex-col items-center justify-center
                      min-w-[90px] md:min-w-[120px] h-32 md:h-40 
                      rounded-[2rem] shadow-xl border transition-all duration-500 ease-out
                      transform hover:-translate-y-3 snap-center backdrop-blur-md
                      outline-none focus:outline-none focus:ring-0 active:ring-0
                      
                      hover:shadow-yellow-600/40 hover:shadow-2xl

                      ${isDark 
                        ? 'bg-[#1a1a1a]/90 border-white/10 shadow-black/50' 
                        : 'bg-white/90 shadow-orange-500/5 border-white hover:border-orange-100'}
                      
                      ${selectedCategory === cat.name 
                        ? `ring-4 ${isDark ? 'ring-[#ffaa00]/40' : 'ring-[#ffaa00]/30'} scale-105 z-10` 
                        : 'hover:scale-105'}
                    `}
                >
                  <div className={`
                    w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl mb-3 shadow-lg transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110
                    ${cat.color}
                  `}>
                      {cat.icon}
                  </div>
                  <span className={`
                    font-bold text-xs md:text-sm tracking-wide transition-colors duration-500 uppercase
                    ${selectedCategory === cat.name ? 'text-[#ffaa00]' : (isDark ? 'text-gray-400 group-hover:text-[#ffaa00]' : 'text-gray-600 group-hover:text-[#ffaa00]')}
                  `}>
                      {cat.name}
                  </span>
                </button>
            ))}
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
        
        {/* 3. Promotional Banners (UPDATED SHADOWS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          
          {/* FREE DELIVERY: ORANGE GLOW */}
          <div 
            onClick={handleFreeDeliveryClick}
            className={`
                rounded-[2.5rem] p-8 md:p-10 flex items-center justify-between shadow-lg transition-all duration-500 cursor-pointer border group transform hover:-translate-y-2 relative overflow-hidden outline-none 
                ${isDark 
                    ? 'bg-gradient-to-br from-[#1a1a1a] to-[#222] border-white/10 hover:shadow-orange-500/30' // Dark Mode: Orange Glow
                    : 'bg-gradient-to-br from-[#fff7e6] to-[#fff0e0] border-orange-100 hover:shadow-orange-500/40'} // Light Mode: Orange Glow
            `}
          >
            <div className={`absolute -right-10 -top-10 w-48 h-48 ${isDark ? 'bg-orange-500/10' : 'bg-[#ffaa00]'} opacity-10 rounded-full transition-transform group-hover:scale-150 duration-700`}></div>
            <div className="relative z-10">
              <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full uppercase mb-4 inline-block tracking-wider ${isDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-200 text-orange-900'}`}>Limited Offer</span>
              <h3 className={`text-3xl md:text-4xl font-black mb-3 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-800'}`}>Free Delivery</h3>
              <p className={`mb-8 font-medium text-sm md:text-base transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>On your first 3 orders! <br/>No code needed.</p>
              <span className="bg-[#ffaa00] text-white px-8 py-3 rounded-full text-sm font-bold group-hover:bg-[#e59400] transition-all shadow-lg hover:shadow-orange-500/40 inline-flex items-center">
                Order Now <FaArrowRight className="ml-2" />
              </span>
            </div>
            <FaMotorcycle className="text-8xl md:text-9xl text-orange-300 opacity-80 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:-translate-x-4 transition-transform duration-500 relative z-10" />
          </div>

          {/* TOP RATED: BLUE GLOW */}
          <div 
            onClick={handleTopRatedClick}
            className={`
                rounded-[2.5rem] p-8 md:p-10 flex items-center justify-between shadow-lg transition-all duration-500 cursor-pointer border group transform hover:-translate-y-2 relative overflow-hidden outline-none 
                ${isDark 
                    ? 'bg-gradient-to-br from-[#1a1a1a] to-[#222] border-white/10 hover:shadow-blue-500/30' // Dark Mode: Blue Glow
                    : 'bg-gradient-to-br from-[#e6f7ff] to-[#dff4ff] border-blue-100 hover:shadow-blue-500/40'} // Light Mode: Blue Glow
            `}
          >
             <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500 opacity-10 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
             <div className="relative z-10">
              <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full uppercase mb-4 inline-block tracking-wider ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-200 text-blue-900'}`}>Community Choice</span>
              <h3 className={`text-3xl md:text-4xl font-black mb-3 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-800'}`}>Top Rated</h3>
              <p className={`mb-8 font-medium text-sm md:text-base transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Discover 5-star winners.</p>
              <span className="bg-blue-600 text-white px-8 py-3 rounded-full text-sm font-bold group-hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/40 inline-flex items-center">
                View Winners <FaArrowRight className="ml-2" />
              </span>
            </div>
            <FaStar className="text-8xl md:text-9xl text-blue-300 opacity-80 group-hover:scale-110 group-hover:rotate-12 group-hover:-translate-x-4 transition-transform duration-500 relative z-10" />
          </div>
        </div>

        {/* 4. Filter Bar */}
        <div ref={resultsRef} className={`flex flex-col md:flex-row justify-between items-end md:items-center mb-12 border-b pb-8 animate-fade-in-up transition-colors duration-500 ${isDark ? 'border-white/10' : 'border-gray-200'}`} style={{ animationDelay: '0.3s' }}>
          <div className="mb-6 md:mb-0">
            <h2 className={`text-3xl md:text-5xl font-black flex items-center flex-wrap gap-3 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedCategory === 'All' ? 'Restaurants Near You' : `${selectedCategory} Spots`}
              {minRating > 0 && <span className={`text-xs md:text-sm font-bold text-[#ffaa00] px-4 py-1.5 rounded-full border shadow-sm ${isDark ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-100'}`}>Rated {minRating}+ ★ Only</span>}
            </h2>
            <p className={`mt-3 text-sm md:text-base font-medium transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              We found {displayedRestaurants.length} {displayedRestaurants.length === 1 ? 'place' : 'places'} for you
            </p>
          </div>

          {/* Rating Pills */}
          <div className={`flex items-center p-2 rounded-full shadow-lg border w-full md:w-auto justify-between md:justify-start transition-colors duration-500 ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
             {[0, 3, 4, 4.5].map((rating) => (
               <button
                 key={rating}
                 onClick={() => setMinRating(rating)}
                 className={`px-5 md:px-8 py-3 md:py-3.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-0 outline-none ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pb-24 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {displayedRestaurants.map((restaurant) => (
              <div 
                key={restaurant._id}
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                className={`rounded-3xl shadow-md hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 cursor-pointer group overflow-hidden border flex flex-col h-full transform hover:-translate-y-2 ${cardClass}`}
              >
                {/* Image Area */}
                <div className={`relative h-56 md:h-64 overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
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
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500"></div>
                   
                   <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg flex items-center text-sm font-bold text-gray-900">
                     <FaStar className="text-yellow-500 mr-1.5" size={14} />
                     {restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "New"}
                     <span className="text-gray-400 font-normal ml-1 text-xs">({restaurant.totalRatings})</span>
                   </div>
                   
                   <div className="absolute top-5 left-5 bg-[#ffaa00] text-white text-[10px] font-bold px-4 py-2 rounded-xl uppercase tracking-wider shadow-lg">
                     Free Delivery
                   </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-grow">
                    <div className="mb-6">
                        <h3 className={`text-2xl font-extrabold mb-2 group-hover:text-[#ffaa00] transition-colors duration-300 line-clamp-1 ${textMain}`}>{restaurant.name}</h3>
                        <p className={`text-sm mb-4 line-clamp-1 flex items-center transition-colors duration-500 ${textSub}`}>
                            <FaSearch className="mr-2 text-gray-300 text-xs" />
                            {restaurant.address}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {restaurant.menu && restaurant.menu.slice(0, 2).map((item, idx) => (
                                <span key={idx} className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-colors duration-500 ${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                    {item.category}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className={`flex items-center justify-between pt-5 border-t mt-auto transition-colors duration-500 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
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
            <div className={`text-center py-32 rounded-[3rem] border shadow-sm animate-fade-in-up transition-all duration-500 ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 text-[#ffaa00] text-5xl shadow-inner animate-bounce ${isDark ? 'bg-white/5' : 'bg-orange-50'}`}>
                    <FaSearch />
                </div>
                <h3 className={`text-4xl font-black mb-3 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>No restaurants found</h3>
                <p className={`max-w-md mx-auto text-lg mb-10 transition-colors duration-500 ${textSub}`}>We couldn't find any matches for "<strong>{searchTerm}</strong>" with your current filters.</p>
                <button 
                    onClick={() => { setSelectedCategory('All'); setSearchTerm(''); setMinRating(0); }}
                    className={`px-12 py-5 rounded-full font-bold text-lg hover:bg-[#e59400] transition-all shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-1 outline-none focus:outline-none focus:ring-0 ${isDark ? 'bg-white text-black hover:text-white' : 'bg-gray-900 text-white'}`}
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