import React from 'react';
import { FaUtensils } from 'react-icons/fa';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
         <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          {/* Spinning Rings */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-100/50"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[#ffaa00] border-r-transparent border-b-[#ffaa00] border-l-transparent animate-spin duration-[1.5s]"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-[#ffaa00]/50 border-b-transparent border-l-[#ffaa00]/50 animate-spin-reverse duration-[2s]"></div>
          
          {/* Inner Icon */}
          <div className="bg-white p-5 rounded-full shadow-xl z-10 animate-pulse-slow">
            <FaUtensils className="text-[#ffaa00] text-4xl drop-shadow-sm" />
          </div>
        </div>
        
        {/* Text Animation */}
        <h2 className="text-4xl font-black text-gray-900 tracking-[0.3em] animate-fade-in-up">
          BIT<span className="text-[#ffaa00]">MEAL</span>
        </h2>
        
        <div className="flex items-center space-x-2 mt-4 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
            <span className="w-2 h-2 bg-[#ffaa00] rounded-full animate-bounce"></span>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Preparing Experience</p>
            <span className="w-2 h-2 bg-[#ffaa00] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default PageLoader;