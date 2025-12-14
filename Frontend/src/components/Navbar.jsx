import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaSun, FaMoon, FaSignInAlt, FaUserPlus, FaChevronRight, FaBell } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import jwtDecode from 'jwt-decode';

// Import Logos
import logoLight from '../assets/BitMeal6.png';
import logoDark from '../assets/BitMeal7.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { getTotalItemsInCart } = useCart();
  const { theme, toggleTheme } = useTheme(); 
  const [scrolled, setScrolled] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const currentLogo = theme === 'dark' ? logoDark : logoLight;
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (e) { setUserRole(null); }
    } else {
      setUserRole(null);
    }
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
    setIsMenuOpen(false);
  };

  // --- PREMIUM THEME STYLES ---
  const navBgClass = isDark 
    ? 'bg-[#0a0a0a]/90 border-white/5 shadow-lg shadow-black/60 backdrop-blur-xl' 
    : 'bg-white/90 border-gray-100 shadow-sm backdrop-blur-xl';

  const textClass = isDark 
    ? 'text-gray-300 hover:text-white' 
    : 'text-gray-600 hover:text-black';

  // Advanced Icon Hover: Glows in Dark, Soft Shadow in Light
  const iconBtnClass = isDark
    ? 'text-gray-400 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]'
    : 'text-gray-600 hover:text-[#ffaa00] hover:bg-orange-50 hover:shadow-lg hover:shadow-orange-100';

  const navLinks = [
    { name: 'Home', path: userRole ? '/dashboard' : '/' },
    { name: 'Menu', path: '/restaurants' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  if (userRole === 'customer') {
    navLinks.splice(2, 0, { name: 'My Orders', path: '/my-orders' });
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[1000] flex items-center justify-between px-4 md:px-8 py-3 transition-all duration-500 ${navBgClass}`}>
        
        {/* 1. Logo */}
        <div className="flex-shrink-0 z-50">
          <Link to={userRole ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <img 
              src={currentLogo} 
              alt="BitMeal" 
              className="h-8 md:h-9 w-auto transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1 drop-shadow-sm" 
            />
          </Link>
        </div>

        {/* 2. Desktop Navigation (Centered) */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link, idx) => {
             const isActive = location.pathname === link.path;
             return (
               <Link 
                  key={idx}
                  to={link.path}
                  className={`
                    relative px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 group overflow-hidden
                    ${isActive 
                        ? 'text-[#ffaa00] bg-[#ffaa00]/10 shadow-[0_0_10px_rgba(255,170,0,0.2)]' 
                        : `${textClass}`}
                  `}
               >
                  <span className="relative z-10">{link.name}</span>
                  {/* Hover Underline Animation */}
                  <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-[#ffaa00] rounded-full transition-all duration-300 ease-out ${isActive ? 'w-4' : 'w-0 group-hover:w-1/2'}`}></span>
                  {/* Subtle Background Flash */}
                  <span className={`absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-full`}></span>
               </Link>
             );
          })}
        </div>

        {/* 3. Right Side Icons */}
        <div className="flex items-center space-x-2 md:space-x-4 z-50">
          
          {/* Notification Icon (Now Visible on Mobile) */}
          <button 
            className={`relative p-2.5 rounded-full transition-all duration-300 group ${iconBtnClass}`}
            title="Notifications (Coming Soon)"
          >
            <FaBell size={18} className="group-hover:rotate-[15deg] transition-transform duration-300 origin-top" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-[#0a0a0a] dark:ring-[#0a0a0a] ring-offset-0"></span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className={`
                relative w-14 h-8 rounded-full p-1 flex items-center transition-all duration-500 shadow-inner group
                ${isDark ? 'bg-gray-800 border border-white/10 hover:border-white/30' : 'bg-gray-100 border border-gray-300 hover:border-gray-400'}
            `}
          >
            <div className={`
                w-6 h-6 rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center text-[10px] z-10
                ${isDark ? 'translate-x-6 bg-[#1a1a1a] text-yellow-400' : 'translate-x-0 bg-white text-orange-500'}
            `}>
                {isDark ? <FaMoon /> : <FaSun />}
            </div>
          </button>

          {/* Cart Icon (Bounce Effect) */}
          {userRole === 'customer' && (
            <Link 
                to="/cart" 
                className={`relative p-2.5 rounded-full transition-all duration-300 group ${iconBtnClass}`}
            >
              <FaShoppingCart size={19} className="group-hover:-translate-y-0.5 group-hover:scale-110 transition-transform duration-300" />
              
              {/* Floating Pulse Badge */}
              {getTotalItemsInCart() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffaa00] opacity-75"></span>
                  <span className={`relative inline-flex rounded-full h-4 w-4 bg-[#ffaa00] text-white text-[9px] font-black items-center justify-center border-2 ${isDark ? 'border-[#0a0a0a]' : 'border-white'}`}>
                    {getTotalItemsInCart()}
                  </span>
                </span>
              )}
            </Link>
          )}

          {/* Profile Dropdown */}
          {userRole ? (
            <div className="relative hidden lg:block" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className={`
                    flex items-center gap-3 p-1 pl-3 pr-1 rounded-full border transition-all duration-300 group
                    ${isProfileOpen 
                        ? 'border-[#ffaa00] bg-[#ffaa00]/10 shadow-[0_0_15px_rgba(255,170,0,0.2)]' 
                        : `border-transparent hover:bg-gray-100/50 dark:hover:bg-white/5 ${isDark ? 'hover:border-white/20' : 'hover:border-gray-200'}`}
                `}
              >
                <span className={`text-xs font-bold hidden xl:block ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-black'}`}>My Account</span>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all duration-300 ${isProfileOpen ? 'border-[#ffaa00] scale-105' : 'border-transparent group-hover:border-[#ffaa00]/50'} ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                   <FaUserCircle size={36} className="mt-1" />
                </div>
              </button>

              {isProfileOpen && (
                <div className={`absolute right-0 mt-4 w-64 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] py-2 border z-50 animate-scale-in origin-top-right backdrop-blur-md ${isDark ? 'bg-[#151515]/95 border-white/10' : 'bg-white/95 border-white/20'}`}>
                  <div className={`px-6 py-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                      <p className={`text-[10px] font-extrabold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Signed In</p>
                  </div>
                  <div className="p-2">
                    {userRole === 'customer' && (
                        <Link 
                        to="/my-orders" 
                        className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-700 hover:bg-orange-50 hover:text-[#ffaa00]'}`}
                        onClick={() => setIsProfileOpen(false)}
                        >
                        My Orders
                        </Link>
                    )}
                    <Link 
                        to="/profile" 
                        className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-700 hover:bg-orange-50 hover:text-[#ffaa00]'}`}
                        onClick={() => setIsProfileOpen(false)}
                    >
                        Profile Settings
                    </Link>
                  </div>
                  <div className={`border-t mx-2 my-1 ${isDark ? 'border-white/10' : 'border-gray-100'}`}></div>
                  <div className="p-2">
                    <button 
                        onClick={handleLogout} 
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 group ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}
                    >
                        <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
               <Link to="/login" className={`text-sm font-bold transition-colors hover:underline decoration-2 underline-offset-4 decoration-[#ffaa00] ${textClass}`}>Sign In</Link>
               <Link to="/register" className="bg-[#ffaa00] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_4px_14px_0_rgba(255,170,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,170,0,0.23)] hover:bg-[#ff9900] transition-all transform hover:-translate-y-0.5 active:scale-95">
                 Join Now
               </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button 
            className={`lg:hidden p-2.5 rounded-xl transition-all active:scale-90 ${iconBtnClass}`}
            onClick={() => setIsMenuOpen(true)}
          >
            <FaBars size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Sidebar Menu */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-[85%] max-w-[320px] z-[1002] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:hidden flex flex-col
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          ${isDark ? 'bg-[#151515]' : 'bg-white'}
        `}
      >
        {/* Mobile Header */}
        <div className={`p-6 flex items-center justify-between border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <img src={currentLogo} alt="Logo" className="h-8 object-contain" />
          <button onClick={() => setIsMenuOpen(false)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <FaTimes size={16} />
          </button>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* USER PROFILE SECTION */}
          {userRole ? (
             <Link 
                to="/profile" 
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98] ${isDark ? 'bg-[#1a1a1a] border-white/5 active:bg-white/5 shadow-inner' : 'bg-gray-50 border-gray-100 active:bg-gray-100'}`}
             >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400'}`}>
                    <FaUserCircle />
                </div>
                <div className="flex-1">
                    <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>My Profile</p>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Manage account settings</p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-white/5 text-gray-500' : 'bg-white text-gray-400 shadow-sm'}`}>
                    <FaChevronRight className="text-xs" />
                </div>
             </Link>
          ) : (
             <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className={`flex items-center justify-center py-3.5 rounded-xl border-2 font-bold text-sm transition-all ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-100 text-gray-700 hover:bg-gray-50'}`}>
                    Sign In
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center py-3.5 rounded-xl bg-[#ffaa00] text-white font-bold text-sm shadow-lg hover:shadow-orange-500/30 active:scale-95 transition-all">
                    Join Now
                </Link>
             </div>
          )}

          {/* Navigation Links */}
          <div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 ml-1">Menu</p>
            <div className="space-y-2">
              {navLinks.map((link, idx) => (
                <Link 
                  key={idx}
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all group ${isDark ? 'text-gray-300 hover:bg-white/5 active:bg-white/10' : 'text-gray-600 hover:bg-gray-50 active:bg-gray-100'}`}
                >
                  <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  <FaChevronRight className={`text-xs opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 ${isDark ? 'text-[#ffaa00]' : 'text-orange-400'}`} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Footer (Logout) */}
        {userRole && (
            <div className={`p-6 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                <button 
                onClick={handleLogout} 
                className={`w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-bold transition-all active:scale-95 ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                >
                <FaSignOutAlt /> Sign Out
                </button>
            </div>
        )}
      </div>
    </>
  );
};

export default Navbar;