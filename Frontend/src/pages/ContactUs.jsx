import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaFacebook, FaTwitter, FaInstagram, FaChevronDown } from 'react-icons/fa';
import PageLoader from '../components/PageLoader';
import { useTheme } from '../context/ThemeContext';

const ContactUs = () => {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <PageLoader />;

  // --- Shared Theme Variables (Exact Match with AboutUs) ---
  const bgBase = isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  
  // The Exact "About Us" Card Style
  const cardBase = isDark 
    ? 'bg-[#1a1a1a]/90 border-white/5 hover:border-white/10 shadow-lg hover:shadow-[0_0_30px_-5px_rgba(255,170,0,0.15)]' 
    : 'bg-white/90 border-white/60 hover:border-orange-100 shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(255,170,0,0.15)]';
    
  const inputBg = isDark 
    ? 'bg-white/5 text-white border-transparent focus:bg-black focus:border-[#ffaa00]' 
    : 'bg-gray-50 text-gray-700 border-transparent focus:bg-white focus:border-[#ffaa00]';

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-700 overflow-x-hidden ${bgBase}`}>
      
      {/* --- 1. CINEMATIC HERO --- */}
      <div className="relative h-[750px] flex items-center justify-center overflow-hidden bg-gray-900">
        <img 
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Contact Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 animate-scale-in duration-[60s]"
        />
        <div className={`absolute inset-0 bg-gradient-to-b z-10 ${isDark ? 'from-black/90 via-black/60 to-[#0f0f0f]' : 'from-black/80 via-black/50 to-[#f8f9fa]'}`}></div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pb-20">
            <div className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-[#ffaa00]/10 backdrop-blur-md border border-[#ffaa00]/30 text-[#ffaa00] text-xs font-extrabold tracking-[0.25em] uppercase mb-8 shadow-[0_0_30px_rgba(255,170,0,0.3)] animate-fade-in-down">
                <span className="w-2 h-2 rounded-full bg-[#ffaa00] animate-pulse"></span> 24/7 Support
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl animate-fade-in-down leading-[1.1]">
                Get in <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] via-orange-400 to-yellow-300">Touch.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed animate-fade-in-up opacity-90 drop-shadow-lg">
                Have a question, feedback, or just want to say hello? We'd love to hear from you.
            </p>

            {/* Scroll Indicator */}
            <div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 animate-bounce">
                <FaChevronDown className="text-white/30 text-2xl" />
            </div>
        </div>
      </div>

      {/* --- 2. FLOATING CONTENT CONTAINER --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Contact Info (Vertical Stack) */}
            <div className="space-y-6">
                {[
                    { icon: FaPhoneAlt, title: "Phone", val: "+94 77 123 4567", sub: "Mon-Sun 9am-10pm" },
                    { icon: FaEnvelope, title: "Email", val: "support@bitmeal.com", sub: "Online 24/7" },
                    { icon: FaMapMarkerAlt, title: "Office", val: "123 Tech Avenue", sub: "Colombo 07, Sri Lanka" }
                ].map((item, i) => (
                    <div 
                        key={i} 
                        className={`p-8 rounded-[2.5rem] border backdrop-blur-md flex items-center gap-6 group transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 ${cardBase}`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        <div className="w-16 h-16 rounded-3xl bg-[#ffaa00]/10 flex items-center justify-center text-[#ffaa00] text-2xl flex-shrink-0 group-hover:bg-[#ffaa00] group-hover:text-white transition-all duration-300">
                            <item.icon />
                        </div>
                        <div>
                            <h4 className={`text-sm font-extrabold uppercase tracking-wider mb-1 ${textSub}`}>{item.title}</h4>
                            <p className={`text-xl font-bold mb-1 ${textMain}`}>{item.val}</p>
                            <p className="text-sm text-gray-500 font-medium">{item.sub}</p>
                        </div>
                    </div>
                ))}

                {/* Social Row */}
                <div className={`p-8 rounded-[2.5rem] border backdrop-blur-md flex justify-between items-center ${cardBase}`}>
                    <span className={`font-bold text-lg ${textMain}`}>Follow Us</span>
                    <div className="flex gap-4">
                        {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#ffaa00] hover:text-white transition-all duration-300 text-gray-600 hover:scale-110">
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Contact Form (Using exact CardBase) */}
            <div className={`p-10 md:p-14 rounded-[3rem] border backdrop-blur-xl animate-fade-in-up ${cardBase}`} style={{ animationDelay: '0.2s' }}>
                <h2 className={`text-3xl font-black mb-8 ${textMain}`}>Send Message</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={`text-xs font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>Your Name</label>
                            <input type="text" className={`w-full p-4 rounded-2xl border-2 outline-none transition-all font-medium ${inputBg}`} placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-xs font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>Email Address</label>
                            <input type="email" className={`w-full p-4 rounded-2xl border-2 outline-none transition-all font-medium ${inputBg}`} placeholder="john@example.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className={`text-xs font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>Subject</label>
                        <input type="text" className={`w-full p-4 rounded-2xl border-2 outline-none transition-all font-medium ${inputBg}`} placeholder="How can we help?" />
                    </div>
                    <div className="space-y-2">
                        <label className={`text-xs font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>Message</label>
                        <textarea rows="4" className={`w-full p-4 rounded-2xl border-2 outline-none transition-all font-medium resize-none ${inputBg}`} placeholder="Write your message here..."></textarea>
                    </div>
                    <button className="w-full py-5 bg-[#ffaa00] text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-orange-600 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mt-4 hover:shadow-orange-500/20">
                        <FaPaperPlane /> Send Message
                    </button>
                </form>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;