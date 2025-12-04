import React, { useState, useEffect } from 'react';
import { FaUtensils, FaUsers, FaGlobeAmericas, FaAward, FaQuoteLeft, FaLeaf, FaBolt, FaHandshake, FaArrowRight, FaChevronDown } from 'react-icons/fa';
import PageLoader from '../components/PageLoader';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const AboutUs = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <PageLoader />;

  // Theme Variables
  const bgBase = isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  
  // Advanced Card Style with conditional hover glow
  const cardBase = isDark 
    ? 'bg-[#1a1a1a]/80 border-white/5 hover:border-white/10 shadow-lg hover:shadow-[0_0_30px_-5px_rgba(255,170,0,0.15)]' 
    : 'bg-white/80 border-white/60 hover:border-orange-100 shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(255,170,0,0.15)]';

  const stats = [
    { label: "Partner Restaurants", val: "500+", icon: <FaUtensils />, color: "text-orange-500", shadow: "hover:shadow-orange-500/30", bg: isDark ? "bg-orange-500/10" : "bg-orange-50" },
    { label: "Satisfied Customers", val: "50k+", icon: <FaUsers />, color: "text-blue-500", shadow: "hover:shadow-blue-500/30", bg: isDark ? "bg-blue-500/10" : "bg-blue-50" },
    { label: "Cities Covered", val: "12", icon: <FaGlobeAmericas />, color: "text-green-500", shadow: "hover:shadow-green-500/30", bg: isDark ? "bg-green-500/10" : "bg-green-50" },
    { label: "Industry Awards", val: "5", icon: <FaAward />, color: "text-purple-500", shadow: "hover:shadow-purple-500/30", bg: isDark ? "bg-purple-500/10" : "bg-purple-50" }
  ];

  const values = [
    {
      icon: <FaBolt />,
      title: "Lightning Fast",
      desc: "Time is flavor. Our logistics engine optimizes every route to ensure your food arrives piping hot.",
      color: "text-yellow-500",
      bg: isDark ? "bg-yellow-500/10" : "bg-yellow-50"
    },
    {
      icon: <FaLeaf />,
      title: "Fresh & Quality",
      desc: "We partner exclusively with top-rated restaurants that prioritize hygiene and premium ingredients.",
      color: "text-green-500",
      bg: isDark ? "bg-green-500/10" : "bg-green-50"
    },
    {
      icon: <FaHandshake />,
      title: "Community First",
      desc: "We believe in fair commissions for restaurants and living wages for our delivery partners.",
      color: "text-blue-500",
      bg: isDark ? "bg-blue-500/10" : "bg-blue-50"
    }
  ];

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-700 overflow-x-hidden ${bgBase}`}>
        
        {/* --- 1. HERO SECTION --- */}
        <div className="relative h-[750px] flex items-center justify-center overflow-hidden bg-gray-900">
            <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                alt="Hero" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 animate-scale-in duration-[60s]"
            />
            <div className={`absolute inset-0 bg-gradient-to-b z-10 ${isDark ? 'from-black/90 via-black/50 to-[#0f0f0f]' : 'from-black/80 via-black/40 to-[#f8f9fa]'}`}></div>
            
            <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pb-20">
                <div className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-[#ffaa00]/10 backdrop-blur-md border border-[#ffaa00]/30 text-[#ffaa00] text-xs font-extrabold tracking-[0.25em] uppercase mb-8 shadow-[0_0_30px_rgba(255,170,0,0.3)] animate-fade-in-down">
                    <span className="w-2 h-2 rounded-full bg-[#ffaa00] animate-pulse"></span> Est. 2024
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl animate-fade-in-down leading-[1.1]">
                    Redefining <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] via-orange-400 to-yellow-300">Taste & Speed.</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed animate-fade-in-up opacity-90 drop-shadow-lg">
                    We aren't just a delivery app. We are a culinary bridge, connecting passion with appetite, instantly.
                </p>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 animate-bounce">
                    <FaChevronDown className="text-white/30 text-2xl" />
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-30">
            
            {/* --- 2. STATS BAR (Interactive & Floating) --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
                {stats.map((stat, i) => (
                    <div 
                        key={i} 
                        style={{ animationDelay: `${i * 0.1}s` }}
                        className={`p-8 rounded-[2.5rem] text-center border backdrop-blur-xl transition-all duration-500 group animate-fade-in-up cursor-default transform hover:-translate-y-4 hover:scale-[1.02] ${cardBase} ${stat.shadow}`}
                    >
                        <div className={`text-4xl mb-6 flex justify-center transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <h4 className={`text-4xl md:text-5xl font-black mb-2 tracking-tight ${textMain}`}>{stat.val}</h4>
                        <p className={`font-bold uppercase text-[10px] tracking-[0.25em] ${textSub}`}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* --- 3. OUR STORY (Cinematic Split) --- */}
            <div className={`flex flex-col lg:flex-row items-center gap-16 mb-32 animate-fade-in-up rounded-[3.5rem] p-8 md:p-16 border relative overflow-hidden group ${isDark ? 'bg-[#151515] border-white/5 shadow-black/60' : 'bg-white border-white shadow-2xl shadow-orange-100/50'}`}>
                
                {/* Breathing Glow */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[4s]"></div>

                <div className="w-full lg:w-1/2 perspective-1000">
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 transform group-hover:rotate-1 group-hover:scale-[1.02]">
                        <img 
                            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                            alt="Our Team" 
                            className="w-full h-[550px] object-cover transition-transform duration-[3s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-10 md:p-12">
                            <div className="text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                <p className="text-2xl font-bold italic font-serif leading-relaxed">"Innovation is in our DNA."</p>
                                <div className="h-1 w-16 bg-[#ffaa00] mt-6 rounded-full"></div>
                                <p className="text-xs text-gray-300 mt-3 font-bold uppercase tracking-[0.2em]">— The Tech Team</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 px-4 md:px-8">
                    <h4 className="text-[#ffaa00] font-black uppercase tracking-[0.25em] mb-6 text-xs flex items-center gap-4">
                        <span className="w-12 h-[2px] bg-[#ffaa00]"></span> Who We Are
                    </h4>
                    <h2 className={`text-4xl md:text-6xl font-black mb-8 leading-[1.1] ${textMain}`}>
                        More Than Just <br/> An App.
                    </h2>
                    <div className={`space-y-8 text-lg leading-relaxed font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>
                            BitMeal started in a small room with a big idea: <span className={isDark ? 'text-white' : 'text-black'}>Good food shouldn't be hard to get.</span> What began as a simple project has evolved into a robust platform connecting thousands of hungry customers with the best local chefs.
                        </p>
                        <p>
                            We believe in technology that serves people. From our AI-driven dispatch system to our user-friendly interface, every line of code is written with one goal: <span className="text-[#ffaa00] font-bold">Delivering Joy.</span>
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/contact')}
                        className="mt-12 group relative px-10 py-4 bg-[#ffaa00] text-white rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(255,170,0,0.3)] hover:shadow-[0_20px_50px_rgba(255,170,0,0.5)] transition-all transform hover:-translate-y-1 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Get in Touch <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform"/>
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                    </button>
                </div>
            </div>

            {/* --- 4. CORE VALUES (Modern Grid) --- */}
            <div className="mb-32">
                <div className="text-center mb-20">
                    <h2 className={`text-4xl md:text-5xl font-black mb-6 ${textMain}`}>Our Core Values</h2>
                    <p className={`max-w-2xl mx-auto text-lg ${textSub}`}>The principles that drive every decision we make, every single day.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((val, i) => (
                        <div 
                            key={i} 
                            className={`p-10 rounded-[2.5rem] border transition-all duration-500 group hover:-translate-y-4 relative overflow-hidden ${cardBase}`}
                        >
                            {/* Background Flash on Hover */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${val.color.replace('text-', 'bg-')}`}></div>

                            <div className={`w-20 h-20 ${val.bg} rounded-3xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ${val.color} shadow-sm`}>
                                {val.icon}
                            </div>
                            <h3 className={`text-2xl font-bold mb-4 group-hover:text-[#ffaa00] transition-colors ${textMain}`}>{val.title}</h3>
                            <p className={`leading-relaxed font-medium ${textSub}`}>{val.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- 5. FOUNDER SPOTLIGHT (Premium Glass) --- */}
            <div className="relative rounded-[3.5rem] overflow-hidden bg-gradient-to-br from-[#ffaa00] to-orange-700 shadow-2xl p-10 md:p-24 text-white text-center md:text-left flex flex-col md:flex-row items-center gap-16 group">
                
                {/* Shine Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[2s] ease-in-out pointer-events-none z-20"></div>
                
                {/* Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
                
                <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full p-2 border-4 border-white/20 shadow-2xl flex-shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/10">
                        <img 
                            src="https://ui-avatars.com/api/?name=Shanuka+Induran&background=fff&color=ffaa00&size=256" 
                            alt="Founder" 
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" 
                        />
                    </div>
                </div>
                
                <div className="relative z-10 flex-1">
                    <FaQuoteLeft className="text-white/30 text-7xl mb-8 mx-auto md:mx-0" />
                    <h2 className="text-2xl md:text-4xl font-bold leading-snug mb-10 italic font-serif tracking-wide">
                        "Our vision is simple: To make high-quality food accessible to everyone, everywhere, instantly. We are just getting started."
                    </h2>
                    <div className="border-l-4 border-white/30 pl-6">
                        <h4 className="text-3xl font-black tracking-tight">Shanuka Induran</h4>
                        <p className="text-orange-100 font-bold tracking-[0.2em] uppercase text-xs mt-2">Founder & CEO, BitMeal</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default AboutUs;