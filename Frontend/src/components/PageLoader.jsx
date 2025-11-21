import React from 'react';
import { FaUtensils } from 'react-icons/fa';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden">
      <div className="relative flex items-center justify-center mb-10">
        {/* 1. Outer Ripple Effect (Pulsing Background) */}
        <div className="absolute w-40 h-40 bg-orange-100/50 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute w-32 h-32 bg-orange-50 rounded-full animate-pulse"></div>

        {/* 2. Spinning Gradient Ring */}
        <div className="relative w-28 h-28">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#ffaa00] border-r-[#ffaa00] animate-[spin_1s_linear_infinite]"></div>
        </div>

        {/* 3. Center Floating Icon */}
        <div className="absolute bg-white p-5 rounded-full shadow-2xl z-10 flex items-center justify-center">
           {/* Custom gentle bounce animation */}
           <FaUtensils className="text-[#ffaa00] text-3xl animate-[bounce_2s_infinite]" />
        </div>
      </div>
      
      {/* 4. Premium Typography */}
      <div className="text-center z-10">
        <h2 className="text-4xl font-black text-gray-800 tracking-widest drop-shadow-sm">
          BIT<span className="text-[#ffaa00]">MEAL</span>
        </h2>
        <p className="text-xs font-bold text-gray-400 tracking-[0.3em] uppercase mt-3 animate-pulse">
          Premium Delivery
        </p>
      </div>
      
      {/* 5. Advanced Liquid Progress Bar */}
      <div className="mt-10 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-[#ffaa00] via-yellow-400 to-[#ffaa00] animate-progress-slide rounded-full"></div>
      </div>

      {/* Custom CSS for the specific slide animation */}
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