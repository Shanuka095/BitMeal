import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import PageLoader from '../components/PageLoader';
import { FaArrowRight, FaUtensils } from 'react-icons/fa';

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0f0f0f]' : 'bg-gradient-to-br from-orange-50 via-white to-orange-50'}`}>
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20 animate-scale-in duration-[60s]"
          />
          {/* Premium Gradient Overlay for Light Mode */}
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/90 via-[#0f0f0f]/90 to-[#0f0f0f]' : 'from-white/80 via-white/60 to-[#f8f9fa]'}`}></div>
      </div>

      <div className="relative z-10 max-w-5xl w-full px-6 flex flex-col items-center text-center mt-16 md:mt-0">
          
          {/* Badge */}
          <span className={`inline-flex items-center py-2 px-6 rounded-full text-[10px] md:text-xs font-extrabold tracking-[0.2em] uppercase mb-8 border shadow-lg animate-fade-in-down ${isDark ? 'bg-[#ffaa00]/10 text-[#ffaa00] border-[#ffaa00]/20' : 'bg-white/80 text-orange-600 border-orange-100 backdrop-blur-md'}`}>
            <FaUtensils className="mr-2" /> Welcome to BitMeal
          </span>
          
          {/* Main Title */}
          <h1 className={`text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-tight animate-fade-in-down ${isDark ? 'text-white' : 'text-gray-900 drop-shadow-sm'}`}>
            Delicious. <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-orange-500">Delivered.</span>
          </h1>
          
          {/* Description */}
          <p className={`text-lg md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto mb-12 animate-fade-in-up ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Your culinary journey begins here. Discover the city's best restaurants and get hot, fresh food delivered to your doorstep in minutes.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-[#ffaa00] to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all transform hover:-translate-y-1 flex items-center justify-center"
            >
              Get Started <FaArrowRight className="ml-2 text-sm" />
            </Link>
            <Link 
              to="/about" 
              className={`w-full sm:w-auto px-12 py-4 rounded-2xl font-bold text-lg border-2 transition-all transform hover:-translate-y-1 flex items-center justify-center backdrop-blur-md ${isDark ? 'border-white/10 text-white hover:bg-white hover:text-black' : 'border-gray-200 bg-white/50 text-gray-800 hover:bg-white hover:border-white hover:shadow-lg'}`}
            >
              Learn More
            </Link>
          </div>

      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400 opacity-[0.05] rounded-full blur-[150px] pointer-events-none"></div>
    </div>
  );
};

export default Home;