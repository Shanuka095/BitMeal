import React from 'react';
import { FaUtensils } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext'; // Import Theme Context

const PageLoader = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
      <div className="relative flex items-center justify-center mb-10">
        {/* 1. Outer Ripple Effect */}
        <div className={`absolute w-40 h-40 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] ${isDark ? 'bg-orange-500/10' : 'bg-orange-100/50'}`}></div>
        <div className={`absolute w-32 h-32 rounded-full animate-pulse ${isDark ? 'bg-orange-500/5' : 'bg-orange-50'}`}></div>

        {/* 2. Spinning Gradient Ring */}
        <div className="relative w-28 h-28">
          <div className={`absolute inset-0 rounded-full border-4 ${isDark ? 'border-white/10' : 'border-gray-100'}`}></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#ffaa00] border-r-[#ffaa00] animate-[spin_1s_linear_infinite]"></div>
        </div>

        {/* 3. Center Floating Icon */}
        <div className={`absolute p-5 rounded-full shadow-2xl z-10 flex items-center justify-center ${isDark ? 'bg-[#1a1a1a] shadow-orange-500/10' : 'bg-white'}`}>
           <FaUtensils className="text-[#ffaa00] text-3xl animate-[bounce_2s_infinite]" />
        </div>
      </div>
      
      {/* 4. Typography */}
      <div className="text-center z-10">
        <h2 className={`text-4xl font-black tracking-widest drop-shadow-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
          BIT<span className="text-[#ffaa00]">MEAL</span>
        </h2>
        <p className="text-xs font-bold text-gray-400 tracking-[0.3em] uppercase mt-3 animate-pulse">
          Premium Delivery
        </p>
      </div>
      
      {/* 5. Progress Bar */}
      <div className={`mt-10 w-48 h-1.5 rounded-full overflow-hidden relative ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-[#ffaa00] via-yellow-400 to-[#ffaa00] animate-progress-slide rounded-full"></div>
      </div>

      <style>{`
        @keyframes progress-slide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-slide {
          animation: progress-slide 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default PageLoader;