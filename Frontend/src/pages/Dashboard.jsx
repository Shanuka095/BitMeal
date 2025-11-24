import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, FaSearch, FaArrowRight, FaUtensils, FaHamburger, FaCoffee, 
  FaMotorcycle, FaFilter, FaChevronDown 
} from 'react-icons/fa';
import { GiNoodles, GiChickenLeg, GiBowlOfRice } from 'react-icons/gi';

// Import the global loader
import PageLoader from '../components/PageLoader'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const resultsRef = useRef(null);

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

  // --- Filtering Logic ---
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

  // UPDATED: All categories now use the Main Brand Color (#ffaa00)
  const categories = [
    { name: 'All', icon: <FaUtensils />, color: 'bg-gray-800' },
    { name: 'Rice', icon: <GiBowlOfRice />, color: 'bg-[#ffaa00]' },
    { name: 'Kottu', icon: <GiNoodles />, color: 'bg-[#ffaa00]' },
    { name: 'Fast Food', icon: <FaHamburger />, color: 'bg-[#ffaa00]' },
    { name: 'Beverages', icon: <FaCoffee />, color: 'bg-[#ffaa00]' },
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
    <div className={`min-h-screen bg-[#f8f9fa] pb-20 transition-opacity duration-1000 ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* 1. Hero Section */}
      <div className="relative bg-gray-900 text-white h-[600px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent z-10"></div>
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
          
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                    <FaSearch className="text-gray-400 text-lg group-focus-within:text-[#ffaa00] transition-colors duration-300" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search for 'Burger'..." 
                    className="w-full py-4 md:py-5 pl-12 pr-32 rounded-full text-gray-800 bg-white/95 backdrop-blur-xl shadow-2xl border-4 border-white/10 focus:border-[#ffaa00]/50 focus:outline-none focus:ring-0 text-base md:text-lg font-medium transition-all duration-300 placeholder-gray-400"
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

      {/* 2. Categories Filter - Updated Colors */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-24 md:-mt-28 mb-16">
          <div className="flex justify-between items-center md:justify-center space-x-3 md:space-x-6 overflow-x-auto pb-8 pt-4 px-2 hide-scrollbar w-full snap-x">
            {categories.map((cat, index) => (
                <button 
                    key={index}
                    onClick={() => { setSelectedCategory(cat.name); scrollToResults(); }}
                    className={`
                      group flex flex-col items-center justify-center
                      min-w-[85px] md:min-w-[110px] h-28 md:h-36 
                      bg-white rounded-[2rem] shadow-xl shadow-orange-500/5 border border-gray-50
                      transition-all duration-300 ease-out
                      transform hover:-translate-y-2 hover:shadow-2xl snap-center
                      outline-none focus:outline-none focus:ring-0 active:ring-0
                      ${selectedCategory === cat.name 
                        ? 'ring-4 ring-[#ffaa00] ring-opacity-50 scale-105 z-10' 
                        : 'hover:scale-105'}
                    `}
                >
                  {/* Icon Circle (Now Uniform Orange) */}
                  <div className={`
                    w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white text-xl md:text-2xl mb-2 shadow-md transition-transform duration-500 group-hover:rotate-12
                    ${cat.color}
                  `}>
                      {cat.icon}
                  </div>
                  {/* Text */}
                  <span className={`
                    font-bold text-[10px] md:text-sm tracking-wide transition-colors duration-300
                    ${selectedCategory === cat.name ? 'text-[#ffaa00]' : 'text-gray-600 group-hover:text-[#ffaa00]'}
                  `}>
                      {cat.name}
                  </span>
                </button>
            ))}
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* 3. Promotional Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div 
            onClick={handleFreeDeliveryClick}
            className="bg-gradient-to-br from-[#fff7e6] to-[#fff0e0] rounded-[2rem] p-6 md:p-8 flex items-center justify-between shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-orange-100 group transform hover:-translate-y-2 relative overflow-hidden outline-none"
          >
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#ffaa00] opacity-10 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
            <div className="relative z-10">
              <span className="bg-orange-200 text-orange-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block tracking-wider">Limited Offer</span>
              <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-2">Free Delivery</h3>
              <p className="text-gray-600 mb-6 font-medium text-sm md:text-base">On your first 3 orders!</p>
              <span className="bg-[#ffaa00] text-white px-6 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-bold group-hover:bg-[#e59400] transition-all shadow-lg hover:shadow-orange-500/40 inline-flex items-center">
                Order Now <FaArrowRight className="ml-2" />
              </span>
            </div>
            <FaMotorcycle className="text-7xl md:text-9xl text-orange-300 opacity-80 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:-translate-x-4 transition-transform duration-500 relative z-10" />
          </div>

          <div 
            onClick={handleTopRatedClick}
            className="bg-gradient-to-br from-[#e6f7ff] to-[#dff4ff] rounded-[2rem] p-6 md:p-8 flex items-center justify-between shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-blue-100 group transform hover:-translate-y-2 relative overflow-hidden outline-none"
          >
             <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500 opacity-10 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
             <div className="relative z-10">
              <span className="bg-blue-200 text-blue-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block tracking-wider">Community Choice</span>
              <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-2">Top Rated</h3>
              <p className="text-gray-600 mb-6 font-medium text-sm md:text-base">Discover 5-star winners.</p>
              <span className="bg-blue-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-bold group-hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/40 inline-flex items-center">
                View Winners <FaArrowRight className="ml-2" />
              </span>
            </div>
            <FaStar className="text-7xl md:text-9xl text-blue-300 opacity-80 group-hover:scale-110 group-hover:rotate-12 group-hover:-translate-x-4 transition-transform duration-500 relative z-10" />
          </div>
        </div>

        {/* 4. Filter Bar & Results Header */}
        <div ref={resultsRef} className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-gray-200 pb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center flex-wrap gap-2">
              {selectedCategory === 'All' ? 'Restaurants Near You' : `${selectedCategory} Spots`}
              {minRating > 0 && <span className="text-xs md:text-sm font-bold text-[#ffaa00] bg-orange-50 px-3 py-1 rounded-full border border-orange-100 shadow-sm">Rated {minRating}+ ★ Only</span>}
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">
              We found {displayedRestaurants.length} {displayedRestaurants.length === 1 ? 'place' : 'places'} for you
            </p>
          </div>

          {/* Advanced Rating Filter */}
          <div className="flex items-center bg-white p-2 rounded-full shadow-lg border border-gray-100 w-full md:w-auto justify-between md:justify-start">
             {[0, 3, 4, 4.5].map((rating) => (
               <button
                 key={rating}
                 onClick={() => setMinRating(rating)}
                 className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-0 outline-none ${
                   minRating === rating 
                   ? 'bg-gray-900 text-white shadow-md transform scale-105' 
                   : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                 }`}
               >
                 {rating === 0 ? 'All' : `${rating}+ ★`}
               </button>
             ))}
          </div>
        </div>

        {/* Results Grid - Updated Shadow to match Menu Page */}
        {displayedRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {displayedRestaurants.map((restaurant) => (
              <div 
                key={restaurant._id}
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                // UPDATED SHADOW HERE: shadow-orange-500/10 on hover
                className="bg-white rounded-3xl shadow-md hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 cursor-pointer group overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-2"
              >
                {/* Image Area */}
                <div className="relative h-52 md:h-56 overflow-hidden">
                   {restaurant.imageUrl ? (
                    <img 
                      src={`http://localhost:3003/uploads/${restaurant.imageUrl}`} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                   ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
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
                   
                   {/* Promo Badge */}
                   <div className="absolute top-4 left-4 bg-[#ffaa00] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
                     Free Delivery
                   </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-[#ffaa00] transition-colors line-clamp-1">{restaurant.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-1 flex items-center">
                        <FaSearch className="mr-2 text-gray-300 text-xs" />
                        {restaurant.address}
                    </p>
                    
                    {/* Dynamic Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {restaurant.menu && restaurant.menu.slice(0, 2).map((item, idx) => (
                            <span key={idx} className="text-[11px] font-bold bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                                {item.category}
                            </span>
                        ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
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
            <div className="text-center py-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-fade-in-up">
                <div className="bg-orange-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 text-[#ffaa00] text-5xl shadow-inner">
                    <FaSearch />
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-3">No restaurants found</h3>
                <p className="text-gray-500 max-w-md mx-auto text-lg">We couldn't find any matches for "<strong>{searchTerm}</strong>" with your current filters.</p>
                <button 
                    onClick={() => { setSelectedCategory('All'); setSearchTerm(''); setMinRating(0); }}
                    className="mt-10 bg-[#ffaa00] text-white px-10 py-4 rounded-full font-bold hover:bg-[#e59400] transition-all shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-1 outline-none focus:outline-none focus:ring-0"
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