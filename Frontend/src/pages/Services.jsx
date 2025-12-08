import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMotorcycle, FaUtensils, FaShieldAlt, FaClock, FaHeadset, FaMobileAlt, FaArrowRight, FaChevronDown } from 'react-icons/fa';
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

  // --- Shared Theme Variables ---
  const bgBase = isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  
  // Base Card Style (Removed the specific orange shadow from here)
  const cardBase = isDark 
    ? 'bg-[#1a1a1a]/80 border-white/5 hover:border-white/10 shadow-lg' 
    : 'bg-white/80 border-white/60 hover:border-orange-100 shadow-xl';

  // Define Services with specific Shadow Colors
  const services = [
    { 
      icon: <FaMotorcycle />, 
      title: "Express Delivery", 
      desc: "Hot and fresh food delivered to your doorstep in 30 minutes or less.", 
      color: "text-orange-500", 
      bg: isDark ? "bg-orange-500/10" : "bg-orange-50",
      shadow: "hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.3)]" // Orange Shadow
    },
    { 
      icon: <FaUtensils />, 
      title: "Premium Restaurants", 
      desc: "Curated selection of the city's finest dining spots and hidden gems.", 
      color: "text-blue-500", 
      bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
      shadow: "hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)]" // Blue Shadow
    },
    { 
      icon: <FaShieldAlt />, 
      title: "Secure Payments", 
      desc: "100% safe and secure digital payments with multiple options.", 
      color: "text-green-500", 
      bg: isDark ? "bg-green-500/10" : "bg-green-50",
      shadow: "hover:shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)]" // Green Shadow
    },
    { 
      icon: <FaClock />, 
      title: "24/7 Service", 
      desc: "Hunger knows no time. We are open round the clock for your cravings.", 
      color: "text-purple-500", 
      bg: isDark ? "bg-purple-500/10" : "bg-purple-50",
      shadow: "hover:shadow-[0_20px_40px_-10px_rgba(168,85,247,0.3)]" // Purple Shadow
    },
    { 
      icon: <FaHeadset />, 
      title: "Dedicated Support", 
      desc: "Our friendly support team is always ready to help you with any query.", 
      color: "text-red-500", 
      bg: isDark ? "bg-red-500/10" : "bg-red-50",
      shadow: "hover:shadow-[0_20px_40px_-10px_rgba(239,68,68,0.3)]" // Red Shadow
    },
    { 
      icon: <FaMobileAlt />, 
      title: "Live Tracking", 
      desc: "Real-time GPS tracking of your order from the kitchen to your door.", 
      color: "text-teal-500", 
      bg: isDark ? "bg-teal-500/10" : "bg-teal-50",
      shadow: "hover:shadow-[0_20px_40px_-10px_rgba(20,184,166,0.3)]" // Teal Shadow
    }
  ];

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-700 overflow-x-hidden ${bgBase}`}>
      
      {/* --- 1. CINEMATIC HERO --- */}
      <div className="relative h-[750px] flex items-center justify-center overflow-hidden bg-gray-900">
        <img 
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Service Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 animate-scale-in duration-[60s]"
        />
        <div className={`absolute inset-0 bg-gradient-to-b z-10 ${isDark ? 'from-black/90 via-black/60 to-[#0f0f0f]' : 'from-black/80 via-black/50 to-[#f8f9fa]'}`}></div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pb-20">
            <div className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-[#ffaa00]/10 backdrop-blur-md border border-[#ffaa00]/30 text-[#ffaa00] text-xs font-extrabold tracking-[0.25em] uppercase mb-8 shadow-[0_0_30px_rgba(255,170,0,0.3)] animate-fade-in-down">
                <span className="w-2 h-2 rounded-full bg-[#ffaa00] animate-pulse"></span> Our Promise
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl animate-fade-in-down leading-[1.1]">
                Service Beyond <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] via-orange-400 to-yellow-300">Expectation.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed animate-fade-in-up opacity-90 drop-shadow-lg">
                We don't just deliver food; we deliver an experience. Speed, quality, and reliability are at our core.
            </p>

            {/* Scroll Indicator */}
            <div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 animate-bounce">
                <FaChevronDown className="text-white/30 text-2xl" />
            </div>
        </div>
      </div>

      {/* --- 2. FLOATING GRID SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-30">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {services.map((service, index) => (
            <div 
              key={index}
              style={{ animationDelay: `${index * 0.1}s` }}
              // Applied cardBase + specific service.shadow
              className={`p-10 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500 group animate-fade-in-up cursor-default transform hover:-translate-y-4 hover:scale-[1.02] ${cardBase} ${service.shadow}`}
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ${service.bg} ${service.color} shadow-sm`}>
                {service.icon}
              </div>
              <h3 className={`text-2xl font-black mb-4 group-hover:text-[#ffaa00] transition-colors ${textMain}`}>{service.title}</h3>
              <p className={`leading-relaxed font-medium ${textSub}`}>{service.desc}</p>
            </div>
          ))}
        </div>

        {/* --- 3. CTA SECTION (Split Layout) --- */}
        <div className={`flex flex-col lg:flex-row items-center gap-16 mb-20 animate-fade-in-up rounded-[3.5rem] p-8 md:p-16 border relative overflow-hidden group ${isDark ? 'bg-[#151515] border-white/5 shadow-black/60' : 'bg-white border-white shadow-2xl shadow-orange-100/50'}`}>
            
            {/* Breathing Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[4s]"></div>

            <div className="w-full lg:w-1/2 perspective-1000">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 transform group-hover:rotate-y-6 group-hover:scale-[1.02]">
                    <img 
                        src="https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                        alt="Delivery App" 
                        className="w-full h-[500px] object-cover transition-transform duration-[3s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-10 md:p-12">
                        <div className="text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-2xl font-bold italic font-serif leading-relaxed">"Seamless from swipe to bite."</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 px-4 md:px-8">
                <h4 className="text-[#ffaa00] font-black uppercase tracking-[0.25em] mb-6 text-xs flex items-center gap-4">
                    <span className="w-12 h-[2px] bg-[#ffaa00]"></span> Get Started
                </h4>
                <h2 className={`text-4xl md:text-6xl font-black mb-8 leading-[1.1] ${textMain}`}>
                    Hungry for <br/> Quality?
                </h2>
                <p className={`text-lg leading-relaxed font-medium ${textSub} mb-10`}>
                    Join thousands of happy customers who trust BitMeal for their daily cravings. Download the app or start ordering online today.
                </p>
                
                <button 
                    onClick={() => navigate('/restaurants')}
                    className="group relative px-10 py-4 bg-[#ffaa00] text-white rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(255,170,0,0.3)] hover:shadow-[0_20px_50px_rgba(255,170,0,0.5)] transition-all transform hover:-translate-y-1 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Explore Menu <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform"/>
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Services;