import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
// IMPORT BOTH LOGOS
import logoLight from '../assets/BitMeal6.png'; 
import logoDark from '../assets/BitMeal7.png'; 

const Footer = () => {
  const { theme } = useTheme();
  
  // Dynamic Logo Selection
  const currentLogo = theme === 'dark' ? logoDark : logoLight;

  // Dynamic Theme Classes
  const footerBg = theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-200';
  const textColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBg = theme === 'dark' ? 'bg-white/5 text-white border-white/10 focus:bg-black' : 'bg-gray-100 text-gray-800 border-gray-200 focus:bg-white';
  
  // Animation Opacity (Visible in both modes now)
  const glowOpacity = theme === 'dark' ? 'opacity-[0.04]' : 'opacity-[0.4]'; // Increased opacity for light mode visibility

  return (
    <footer className={`${footerBg} ${textColor} pt-24 pb-10 relative overflow-hidden border-t font-sans transition-colors duration-500`}>
      
      {/* Animated Background Mesh - VISIBLE IN BOTH MODES */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ffaa00] rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ opacity: theme === 'dark' ? 0.04 : 0.15 }}></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000" style={{ opacity: theme === 'dark' ? 0.03 : 0.1 }}></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          
          {/* 1. Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo Container (Glass effect adapted for theme) */}
            <div className={`p-3 rounded-2xl inline-block shadow-lg transition-all ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'}`}>
                <img src={currentLogo} alt="BitMeal Logo" className="h-10 w-auto object-contain" />
            </div>
            <p className={`text-sm leading-7 font-medium max-w-xs opacity-90 ${textColor}`}>
              The smartest way to order food. <br/> Fresh ingredients, fast delivery, and fair prices for everyone.
            </p>
            <div className="flex space-x-3 pt-2">
              {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#ffaa00] hover:text-white ${theme === 'dark' ? 'bg-white/5 text-white border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Navigation */}
          <div className="lg:col-span-2">
            <h4 className={`${titleColor} font-bold text-sm uppercase tracking-widest mb-6 border-b-2 border-[#ffaa00] inline-block pb-1`}>Explore</h4>
            <ul className="space-y-3 text-sm font-medium">
              {['Home', 'Menu', 'Services', 'About Us'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/dashboard' : item === 'Menu' ? '/restaurants' : `/${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[#ffaa00] transition-all hover:translate-x-1 inline-flex items-center gap-2 group">
                    <span className={`w-1.5 h-1.5 rounded-full group-hover:bg-[#ffaa00] transition-colors ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact */}
          <div className="lg:col-span-3">
            <h4 className={`${titleColor} font-bold text-sm uppercase tracking-widest mb-6 border-b-2 border-[#ffaa00] inline-block pb-1`}>Reach Us</h4>
            <ul className="space-y-5 text-sm font-medium">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#ffaa00] mt-1 text-base shrink-0" />
                <span>123 Tech Avenue, <br/>Colombo 07, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <FaPhoneAlt className="text-[#ffaa00] shrink-0 group-hover:animate-pulse" />
                <span className={`group-hover:${titleColor} transition`}>+94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <FaEnvelope className="text-[#ffaa00] shrink-0 group-hover:animate-bounce" />
                <span className={`group-hover:${titleColor} transition`}>support@bitmeal.com</span>
              </li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div className="lg:col-span-3">
            <h4 className={`${titleColor} font-bold text-sm uppercase tracking-widest mb-6 border-b-2 border-[#ffaa00] inline-block pb-1`}>Stay Updated</h4>
            <p className="text-xs opacity-80 mb-4 font-medium">Subscribe for exclusive promos & updates.</p>
            <form className="relative group">
                <input 
                    type="email" 
                    placeholder="Email address" 
                    className={`w-full px-5 py-4 rounded-xl border focus:border-[#ffaa00] focus:outline-none transition-all text-xs font-bold tracking-wide uppercase shadow-inner ${inputBg}`}
                />
                <button className="absolute right-2 top-2 bottom-2 bg-[#ffaa00] text-black px-3 rounded-lg hover:bg-orange-600 hover:text-white transition-colors shadow-lg flex items-center justify-center">
                    <FaPaperPlane className="text-xs" />
                </button>
            </form>
          </div>

        </div>
        
        {/* Copyright */}
        <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left ${theme === 'dark' ? 'border-white/5' : 'border-gray-200'}`}>
          <p className="text-xs font-bold tracking-wide uppercase opacity-70">
            © {new Date().getFullYear()} BitMeal Technologies. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-70">
            <Link to="#" className={`hover:${titleColor} transition hover:underline decoration-[#ffaa00]`}>Terms</Link>
            <Link to="#" className={`hover:${titleColor} transition hover:underline decoration-[#ffaa00]`}>Privacy</Link>
            <Link to="#" className={`hover:${titleColor} transition hover:underline decoration-[#ffaa00]`}>Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;