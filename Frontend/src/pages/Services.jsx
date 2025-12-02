import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMotorcycle, FaUtensils, FaShieldAlt, FaClock, FaHeadset, FaMobileAlt, FaArrowRight } from 'react-icons/fa';
import PageLoader from '../components/PageLoader';
import { useTheme } from '../context/ThemeContext';

const Services = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <PageLoader />;

  const services = [
    { icon: <FaMotorcycle />, title: "Express Delivery", desc: "Hot and fresh food delivered to your doorstep in 30 minutes or less.", color: "text-orange-500", bg: isDark ? "bg-orange-500/10" : "bg-orange-50" },
    { icon: <FaUtensils />, title: "Premium Restaurants", desc: "Curated selection of the city's finest dining spots and hidden gems.", color: "text-blue-500", bg: isDark ? "bg-blue-500/10" : "bg-blue-50" },
    { icon: <FaShieldAlt />, title: "Secure Payments", desc: "100% safe and secure digital payments with multiple options.", color: "text-green-500", bg: isDark ? "bg-green-500/10" : "bg-green-50" },
    { icon: <FaClock />, title: "24/7 Service", desc: "Hunger knows no time. We are open round the clock for your cravings.", color: "text-purple-500", bg: isDark ? "bg-purple-500/10" : "bg-purple-50" },
    { icon: <FaHeadset />, title: "Dedicated Support", desc: "Our friendly support team is always ready to help you with any query.", color: "text-red-500", bg: isDark ? "bg-red-500/10" : "bg-red-50" },
    { icon: <FaMobileAlt />, title: "Live Tracking", desc: "Real-time GPS tracking of your order from the kitchen to your door.", color: "text-teal-500", bg: isDark ? "bg-teal-500/10" : "bg-teal-50" }
  ];

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-500 ${isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}>
      
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className={`absolute inset-0 bg-gradient-to-b z-10 ${isDark ? 'from-black/90 via-black/70 to-[#0f0f0f]' : 'from-black/80 via-black/50 to-transparent'}`}></div>
        <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-40 animate-scale-in duration-[40s]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#ffaa00] text-xs font-bold tracking-[0.2em] mb-6 shadow-lg animate-fade-in-down">OUR PROMISE</span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-2xl animate-fade-in-down">Service Beyond <span className="text-[#ffaa00]">Expectation</span></h1>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              style={{ animationDelay: `${index * 0.1}s` }}
              className={`rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border group transform hover:-translate-y-2 animate-fade-in-up ${isDark ? 'bg-[#1a1a1a] border-white/10 hover:shadow-orange-500/10' : 'bg-white border-gray-100 hover:shadow-orange-500/10'}`}
            >
              <div className={`w-16 h-16 rounded-2xl ${service.bg} ${service.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                {service.icon}
              </div>
              <h3 className={`text-2xl font-extrabold mb-3 group-hover:text-[#ffaa00] transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>{service.title}</h3>
              <p className={`font-medium leading-relaxed text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;