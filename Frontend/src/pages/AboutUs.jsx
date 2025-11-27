import React, { useState, useEffect } from 'react';
import { FaUtensils, FaUsers, FaGlobeAmericas, FaAward, FaQuoteLeft, FaLeaf, FaBolt, FaHandshake } from 'react-icons/fa';
import PageLoader from '../components/PageLoader';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <PageLoader />;

  const stats = [
    { label: "Partner Restaurants", val: "500+", icon: <FaUtensils /> },
    { label: "Satisfied Customers", val: "50k+", icon: <FaUsers /> },
    { label: "Cities Covered", val: "12", icon: <FaGlobeAmericas /> },
    { label: "Industry Awards", val: "5", icon: <FaAward /> }
  ];

  const values = [
    {
      icon: <FaBolt />,
      title: "Lightning Fast",
      desc: "We value your time. Our logistics engine is optimized to get hot food to your door in record time.",
      color: "text-yellow-500",
      bg: "bg-yellow-50"
    },
    {
      icon: <FaLeaf />,
      title: "Fresh & Quality",
      desc: "We partner only with restaurants that maintain the highest hygiene and quality standards.",
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      icon: <FaHandshake />,
      title: "Community First",
      desc: "Fair commissions for restaurants and fair wages for our riders. We grow together.",
      color: "text-blue-500",
      bg: "bg-blue-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
        
        {/* 1. Cinematic Hero Section */}
        <div className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
            <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                alt="About Background" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 animate-scale-in duration-[60s]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-white z-10"></div>
            
            <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-10">
                <span className="inline-block py-2 px-6 rounded-full bg-[#ffaa00]/20 backdrop-blur-md border border-[#ffaa00]/40 text-[#ffaa00] text-xs font-extrabold tracking-[0.3em] uppercase mb-8 shadow-2xl animate-fade-in-down">
                    ESTABLISHED 2024
                </span>
                <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tight drop-shadow-2xl animate-fade-in-down">
                    Redefining <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-yellow-300">Taste & Speed.</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed animate-fade-in-up opacity-90">
                    We are building the future of food delivery—one meal, one smile, and one connection at a time.
                </p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-30">
            
            {/* 2. Stats Bar (Floating) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
                {stats.map((stat, i) => (
                    <div 
                        key={i} 
                        style={{ animationDelay: `${i * 0.1}s` }}
                        className="bg-white p-8 rounded-[2rem] text-center shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-2 transition-transform duration-500 group animate-fade-in-up"
                    >
                        <div className="text-gray-300 text-4xl mb-4 flex justify-center group-hover:text-[#ffaa00] transition-colors duration-300 filter drop-shadow-sm">{stat.icon}</div>
                        <h4 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 group-hover:scale-110 transition-transform origin-bottom">{stat.val}</h4>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* 3. Our Story (Split Layout) */}
            <div className="flex flex-col lg:flex-row items-center gap-16 mb-32 animate-fade-in-up">
                <div className="w-full lg:w-1/2">
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-500/20 group">
                        <img 
                            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                            alt="Our Team working" 
                            className="w-full h-[600px] object-cover transform transition-transform duration-[2s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                            <div className="text-white">
                                <p className="text-lg font-medium italic">"Innovation is in our DNA."</p>
                                <p className="text-sm text-gray-300 mt-2">— The BitMeal Tech Team</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <h4 className="text-[#ffaa00] font-bold uppercase tracking-widest mb-4 text-sm">Who We Are</h4>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                        More Than Just <br/> An App.
                    </h2>
                    <div className="space-y-6 text-lg text-gray-500 leading-relaxed font-medium">
                        <p>
                            BitMeal started in a small room with a big idea: **Good food shouldn't be hard to get.** What began as a simple project has evolved into a robust platform connecting thousands of hungry customers with the best local chefs.
                        </p>
                        <p>
                            We believe in technology that serves people. From our AI-driven dispatch system to our user-friendly interface, every line of code is written with one goal: **Delivering Joy.**
                        </p>
                        <p>
                            But we are not just about technology. We are about community. We support local businesses, ensure fair wages for our riders, and bring families together over the dining table.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/contact')}
                        className="mt-10 px-10 py-4 bg-gray-900 text-white rounded-full font-bold text-lg shadow-xl hover:bg-[#ffaa00] hover:text-white hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1"
                    >
                        Get in Touch
                    </button>
                </div>
            </div>

            {/* 4. Core Values */}
            <div className="mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Our Core Values</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">The principles that drive every decision we make.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((val, i) => (
                        <div 
                            key={i} 
                            className="bg-[#f8f9fa] p-10 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group"
                        >
                            <div className={`w-16 h-16 ${val.bg} ${val.color} rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform duration-300`}>
                                {val.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{val.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Founder Spotlight (Glassmorphism) */}
            <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#ffaa00] to-orange-600 shadow-2xl p-10 md:p-20 text-white text-center md:text-left flex flex-col md:flex-row items-center gap-12">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-8 border-white/20 overflow-hidden shadow-2xl flex-shrink-0 relative z-10">
                    <img src="https://ui-avatars.com/api/?name=Shanuka+Induran&background=fff&color=ffaa00&size=256" alt="Founder" className="w-full h-full object-cover" />
                </div>
                
                <div className="relative z-10 flex-1">
                    <FaQuoteLeft className="text-white/30 text-6xl mb-6 mx-auto md:mx-0" />
                    <h2 className="text-2xl md:text-4xl font-bold leading-snug mb-8 italic">
                        "Our vision is simple: To make high-quality food accessible to everyone, everywhere, instantly. We are just getting started."
                    </h2>
                    <div>
                        <h4 className="text-3xl font-black">Shanuka Induran</h4>
                        <p className="text-orange-100 font-bold tracking-widest uppercase text-sm mt-1">Founder & CEO, BitMeal</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default AboutUs;