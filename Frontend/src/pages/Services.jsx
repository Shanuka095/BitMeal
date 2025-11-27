import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaMotorcycle, FaUtensils, FaShieldAlt, FaClock, FaHeadset, FaMobileAlt, FaArrowRight } from 'react-icons/fa';
import PageLoader from '../components/PageLoader';

const Services = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <PageLoader />;

  const services = [
    {
      icon: <FaMotorcycle />,
      title: "Express Delivery",
      desc: "Hot and fresh food delivered to your doorstep in 30 minutes or less.",
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      icon: <FaUtensils />,
      title: "Premium Restaurants",
      desc: "Curated selection of the city's finest dining spots and hidden gems.",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Payments",
      desc: "100% safe and secure digital payments with multiple options.",
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      icon: <FaClock />,
      title: "24/7 Service",
      desc: "Hunger knows no time. We are open round the clock for your cravings.",
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      icon: <FaHeadset />,
      title: "Dedicated Support",
      desc: "Our friendly support team is always ready to help you with any query.",
      color: "text-red-500",
      bg: "bg-red-50"
    },
    {
      icon: <FaMobileAlt />,
      title: "Live Tracking",
      desc: "Real-time GPS tracking of your order from the kitchen to your door.",
      color: "text-teal-500",
      bg: "bg-teal-50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20">
      
      {/* 1. Hero Section */}
      <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Services Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 animate-scale-in duration-[40s]"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#ffaa00] text-xs font-bold tracking-[0.2em] mb-6 shadow-lg animate-fade-in-down">
              OUR PROMISE
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-2xl animate-fade-in-down">
            Service Beyond <span className="text-[#ffaa00]">Expectation</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl font-light max-w-2xl mx-auto animate-fade-in-up">
             We don't just deliver food; we deliver an experience. Speed, quality, and reliability are at our core.
          </p>
        </div>
      </div>

      {/* 2. Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 border border-gray-100 group transform hover:-translate-y-2 animate-fade-in-up"
            >
              <div className={`w-16 h-16 rounded-2xl ${service.bg} ${service.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-[#ffaa00] transition-colors">{service.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">{service.desc}</p>
            </div>
          ))}
        </div>

        {/* 3. Call to Action Banner */}
        <div className="mt-20 bg-[#1a1a1a] rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl animate-fade-in-up">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffaa00] opacity-10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600 opacity-10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Hungry for Quality?</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg font-medium">
                Join thousands of happy customers who trust BitMeal for their daily cravings.
            </p>
            {/* NAVIGATE TO MENU */}
            <button 
                onClick={() => navigate('/restaurants')}
                className="px-10 py-4 bg-[#ffaa00] text-white rounded-full font-bold text-lg shadow-lg hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 flex items-center mx-auto gap-2"
            >
              Explore Menu <FaArrowRight />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Services;