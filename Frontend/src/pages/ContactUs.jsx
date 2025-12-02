import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
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

  return (
    <div className={`min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}>
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className={`text-5xl md:text-7xl font-black mb-6 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Get in <span className="text-[#ffaa00]">Touch</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Have a question, feedback, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Left: Contact Info (Always Dark for Contrast) */}
            <div className={`rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden animate-fade-in-up ${isDark ? 'bg-[#1a1a1a] text-white' : 'bg-[#111] text-white'}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffaa00] opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600 opacity-5 rounded-full -ml-10 -mb-10 blur-3xl"></div>

                <h2 className="text-3xl font-bold mb-10 relative z-10">Contact Information</h2>
                
                <div className="space-y-10 relative z-10">
                    <div className="flex items-start gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#ffaa00] text-xl flex-shrink-0 group-hover:bg-[#ffaa00] group-hover:text-white transition-all duration-300">
                            <FaPhoneAlt />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-1 text-gray-200">Phone</h4>
                            <p className="text-gray-400 font-medium">+94 77 123 4567</p>
                            <p className="text-gray-400 font-medium">+94 11 234 5678</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#ffaa00] text-xl flex-shrink-0 group-hover:bg-[#ffaa00] group-hover:text-white transition-all duration-300">
                            <FaEnvelope />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-1 text-gray-200">Email</h4>
                            <p className="text-gray-400 font-medium">support@bitmeal.com</p>
                            <p className="text-gray-400 font-medium">partners@bitmeal.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#ffaa00] text-xl flex-shrink-0 group-hover:bg-[#ffaa00] group-hover:text-white transition-all duration-300">
                            <FaMapMarkerAlt />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-1 text-gray-200">Office</h4>
                            <p className="text-gray-400 font-medium">123 Tech Avenue,<br/>Colombo 07, Sri Lanka</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex gap-4 relative z-10">
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ffaa00] hover:text-white transition-all"><FaFacebook /></a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ffaa00] hover:text-white transition-all"><FaTwitter /></a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ffaa00] hover:text-white transition-all"><FaInstagram /></a>
                </div>
            </div>

            {/* Right: Contact Form (Adaptive) */}
            <div className={`rounded-[3rem] p-10 md:p-16 shadow-xl animate-fade-in-up border ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 shadow-gray-200/50'}`} style={{ animationDelay: '0.2s' }}>
                <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Send a Message</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>Your Name</label>
                            <input type="text" className={`w-full p-4 rounded-2xl border-2 focus:border-[#ffaa00] focus:ring-0 outline-none transition-all font-medium ${isDark ? 'bg-white/5 border-transparent text-white focus:bg-black' : 'bg-gray-50 border-transparent focus:bg-white text-gray-700'}`} placeholder="John Doe" />
                        </div>
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>Email Address</label>
                            <input type="email" className={`w-full p-4 rounded-2xl border-2 focus:border-[#ffaa00] focus:ring-0 outline-none transition-all font-medium ${isDark ? 'bg-white/5 border-transparent text-white focus:bg-black' : 'bg-gray-50 border-transparent focus:bg-white text-gray-700'}`} placeholder="john@example.com" />
                        </div>
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>Subject</label>
                        <input type="text" className={`w-full p-4 rounded-2xl border-2 focus:border-[#ffaa00] focus:ring-0 outline-none transition-all font-medium ${isDark ? 'bg-white/5 border-transparent text-white focus:bg-black' : 'bg-gray-50 border-transparent focus:bg-white text-gray-700'}`} placeholder="How can we help?" />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>Message</label>
                        <textarea rows="4" className={`w-full p-4 rounded-2xl border-2 focus:border-[#ffaa00] focus:ring-0 outline-none transition-all font-medium resize-none ${isDark ? 'bg-white/5 border-transparent text-white focus:bg-black' : 'bg-gray-50 border-transparent focus:bg-white text-gray-700'}`} placeholder="Write your message here..."></textarea>
                    </div>
                    <button className="w-full py-4 bg-[#ffaa00] text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-orange-600 transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-4">
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