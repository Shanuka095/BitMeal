import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import PageLoader from '../components/PageLoader';
import { FaArrowRight, FaUtensils, FaLeaf, FaRocket, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <PageLoader />;

  // --- Theme Styles ---
  const bgBase = isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600';
  const glassCard = isDark 
    ? 'bg-[#1a1a1a]/80 border-white/5 hover:shadow-orange-500/10' 
    : 'bg-white/80 border-white/60 shadow-xl shadow-gray-200/50 hover:shadow-2xl backdrop-blur-xl';

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${bgBase}`}>
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
             <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                alt="Hero Background" 
                className="w-full h-full object-cover opacity-30 animate-scale-in duration-[60s]"
             />
             {/* Dynamic Gradient Overlay */}
             <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/95 via-[#0f0f0f]/80 to-[#0f0f0f]' : 'from-white/95 via-[#f8f9fa]/80 to-[#f8f9fa]'}`}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl w-full px-6 lg:px-8 flex flex-col items-center text-center">
             
             {/* Floating Badge */}
             <div className={`inline-flex items-center px-5 py-2 rounded-full border shadow-2xl mb-10 animate-fade-in-down backdrop-blur-md ${isDark ? 'bg-[#ffaa00]/10 border-[#ffaa00]/20 text-[#ffaa00]' : 'bg-white border-orange-100 text-orange-600'}`}>
                <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-3 animate-pulse"></span>
                <span className="text-[10px] md:text-xs font-extrabold tracking-[0.25em] uppercase">#1 Food Delivery App</span>
             </div>
             
             {/* Headline */}
             <h1 className={`text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.95] animate-fade-in-down ${textMain}`}>
                Delicious. <br className="md:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] via-orange-400 to-red-500 drop-shadow-sm">Delivered.</span>
             </h1>

             {/* Subheadline */}
             <p className={`text-lg md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto mb-12 animate-fade-in-up ${textSub}`} style={{ animationDelay: '0.1s' }}>
                Your culinary journey begins here. Discover the city's best restaurants and get hot, fresh food delivered to your doorstep in minutes.
             </p>

             {/* Buttons */}
             <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Link 
                  to="/login" 
                  className="group w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 bg-[#ffaa00] text-white rounded-2xl font-bold text-lg shadow-[0_20px_50px_-10px_rgba(255,170,0,0.4)] hover:shadow-[0_20px_50px_-5px_rgba(255,170,0,0.6)] hover:bg-orange-600 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                   Start Ordering <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                   to="/about"
                   className={`w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 rounded-2xl font-bold text-lg border-2 transition-all transform hover:-translate-y-1 flex items-center justify-center ${isDark ? 'border-white/10 text-white hover:bg-white hover:text-black' : 'border-gray-200 text-gray-800 hover:bg-black hover:text-white hover:border-black'}`}
                >
                   How it Works
                </Link>
             </div>

             {/* Floating Elements (Desktop Only) */}
             <div className="absolute top-1/3 -left-20 hidden xl:block animate-bounce duration-[6s]">
                 <div className={`p-6 rounded-3xl shadow-xl border backdrop-blur-md rotate-[-12deg] ${isDark ? 'bg-[#1a1a1a]/80 border-white/10' : 'bg-white/80 border-white'}`}>
                     <FaUtensils className="text-4xl text-[#ffaa00] mb-2" />
                     <p className={`font-bold text-sm ${textMain}`}>500+ Restaurants</p>
                 </div>
             </div>
             <div className="absolute bottom-1/4 -right-20 hidden xl:block animate-bounce duration-[5s]">
                 <div className={`p-6 rounded-3xl shadow-xl border backdrop-blur-md rotate-[12deg] ${isDark ? 'bg-[#1a1a1a]/80 border-white/10' : 'bg-white/80 border-white'}`}>
                     <FaRocket className="text-4xl text-orange-500 mb-2" />
                     <p className={`font-bold text-sm ${textMain}`}>Super Fast Delivery</p>
                 </div>
             </div>
        </div>
      </section>

      {/* --- 2. FEATURES SECTION --- */}
      <section className={`py-24 px-6 relative z-20 ${isDark ? 'bg-[#111]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className={`text-4xl md:text-6xl font-black mb-6 ${textMain}`}>Why Choose <span className="text-[#ffaa00]">BitMeal?</span></h2>
                <p className={`text-lg max-w-2xl mx-auto ${textSub}`}>We believe in more than just delivering food. We deliver happiness, reliability, and quality with every order.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: <FaRocket />, title: "Lightning Fast", desc: "Our AI-driven logistics ensure your food arrives hot and fresh, faster than ever before.", color: "text-orange-500", delay: "0s" },
                    { icon: <FaShieldAlt />, title: "Secure & Safe", desc: "We prioritize your safety with contactless delivery and strict hygiene standards.", color: "text-blue-500", delay: "0.2s" },
                    { icon: <FaMobileAlt />, title: "Live Tracking", desc: "Watch your order move in real-time on our interactive map from pickup to delivery.", color: "text-green-500", delay: "0.4s" }
                ].map((item, i) => (
                    <div 
                        key={i} 
                        className={`p-10 rounded-[2.5rem] border hover:-translate-y-3 transition-all duration-500 group ${glassCard}`}
                        style={{ animationDelay: item.delay }}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 ${isDark ? 'bg-white/5' : 'bg-gray-50'} ${item.color}`}>
                            {item.icon}
                        </div>
                        <h3 className={`text-2xl font-bold mb-4 group-hover:text-[#ffaa00] transition-colors ${textMain}`}>{item.title}</h3>
                        <p className={`leading-relaxed ${textSub}`}>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- 3. APP SHOWCASE --- */}
      <section className="py-24 px-6 relative overflow-hidden">
         <div className="max-w-7xl mx-auto bg-[#ffaa00] rounded-[3rem] p-10 md:p-20 relative shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
             
             {/* Pattern Overlay */}
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             
             <div className="relative z-10 md:w-1/2 text-center md:text-left">
                 <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">Order anytime, <br/> anywhere.</h2>
                 <p className="text-white/90 text-lg md:text-xl mb-10 font-medium">Get the full experience on your mobile device. Exclusive deals and faster checkout await.</p>
                 <Link 
                    to="/login" 
                    className="inline-block px-12 py-5 bg-black text-white rounded-full font-bold text-lg shadow-2xl hover:bg-white hover:text-black transition-all transform hover:-translate-y-1"
                 >
                    Get Started Now
                 </Link>
             </div>

             {/* 3D Phone Mockup Visual */}
             <div className="relative z-10 md:w-1/2 flex justify-center">
                 <div className="w-64 md:w-80 h-[400px] md:h-[500px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl relative overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-all duration-500">
                    <img 
                        src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="App Screen" 
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-white/20 rounded-full"></div>
                 </div>
             </div>
         </div>
      </section>

    </div>
  );
};

export default Home;