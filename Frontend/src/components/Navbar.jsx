import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaSun, FaMoon, FaSignInAlt, FaUserPlus, FaChevronRight } from 'react-icons/fa';
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

  // --- THEME STYLES ---
  const navBgClass = isDark 
    ? 'bg-[#0a0a0a]/80 border-white/10' 
    : 'bg-white/70 border-gray-200/50';

  const textClass = isDark 
    ? 'text-gray-300 hover:text-[#ffaa00]' 
    : 'text-gray-800 hover:text-[#ffaa00]';

  const linkHoverClass = isDark
    ? 'hover:bg-white/10'
    : 'hover:bg-orange-50';

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
      <nav className={`fixed top-0 left-0 w-full z-[1000] flex items-center justify-between px-6 py-3 backdrop-blur-lg border-b shadow-sm transition-all duration-500 ${navBgClass}`}>
        
        {/* 1. Logo */}
        <div className="flex-shrink-0 z-50">
          <Link to={userRole ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <img 
              src={currentLogo} 
              alt="BitMeal" 
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>
        </div>

        {/* 2. Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {navLinks.map((link, idx) => {
             const isActive = location.pathname === link.path;
             return (
               <Link 
                  key={idx}
                  to={link.path}
                  className={`
                    relative px-4 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 group
                    ${isActive 
                        ? 'text-[#ffaa00] bg-orange-50/10' 
                        : `${textClass} ${linkHoverClass}`}
                  `}
               >
                  {link.name}
                  <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#ffaa00] rounded-full transition-all duration-300 group-hover:w-1/2 ${isActive ? 'w-1/2' : ''}`}></span>
               </Link>
             );
          })}
        </div>

        {/* 3. Right Side Icons */}
        <div className="flex items-center space-x-4 z-50">
          
          {/* PROFESSIONAL THEME TOGGLE */}
          <button 
            onClick={toggleTheme} 
            className={`
                relative w-14 h-8 rounded-full p-1 flex items-center transition-all duration-500 shadow-inner
                ${isDark ? 'bg-gray-800 border border-white/10' : 'bg-gray-100 border border-gray-200'}
            `}
          >
            {/* The Moving Circle */}
            <div className={`
                w-6 h-6 rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center
                ${isDark ? 'translate-x-6 bg-[#1a1a1a] text-yellow-400' : 'translate-x-0 bg-white text-orange-500'}
            `}>
                {isDark ? <FaMoon size={12} /> : <FaSun size={12} />}
            </div>
          </button>

          {/* Cart Icon */}
          {userRole === 'customer' && (
            <Link 
                to="/cart" 
                className={`relative p-2.5 rounded-full transition-all duration-300 group ${textClass} hover:bg-orange-50/10`}
            >
              <FaShoppingCart size={20} className="group-hover:text-[#ffaa00] transition-colors" />
              {getTotalItemsInCart() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm border-2 border-white animate-bounce">
                  {getTotalItemsInCart()}
                </span>
              )}
            </Link>
          )}

          {/* Profile Dropdown */}
          {userRole ? (
            <div className="relative hidden lg:block" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className={`flex items-center gap-2 p-1 pr-3 rounded-full border transition-all duration-300 ${isProfileOpen ? 'border-[#ffaa00] bg-orange-50/10' : 'border-transparent hover:bg-gray-100/10'}`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-gray-500 border border-white/20">
                   <FaUserCircle size={24} />
                </div>
                <FaChevronRight className={`text-xs transition-transform duration-300 ${isProfileOpen ? 'rotate-90 text-[#ffaa00]' : `text-gray-400 group-hover:text-[#ffaa00]`}`} />
              </button>

              {isProfileOpen && (
                <div className={`absolute right-0 mt-3 w-56 rounded-xl shadow-2xl py-2 border z-50 animate-fade-in-down ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white/95 backdrop-blur-md border-gray-100'}`}>
                  {userRole === 'customer' && (
                    <Link 
                      to="/my-orders" 
                      className={`block px-5 py-3 text-sm font-medium transition-colors ${isDark ? 'text-gray-300 hover:bg-white/5 hover:text-[#ffaa00]' : 'text-gray-700 hover:bg-orange-50 hover:text-[#ffaa00]'}`}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Orders
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className={`block px-5 py-3 text-sm font-medium transition-colors ${isDark ? 'text-gray-300 hover:bg-white/5 hover:text-[#ffaa00]' : 'text-gray-700 hover:bg-orange-50 hover:text-[#ffaa00]'}`}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className={`border-t my-1 ${isDark ? 'border-white/10' : 'border-gray-100'}`}></div>
                  <button 
                    onClick={handleLogout} 
                    className={`block w-full text-left px-5 py-3 text-sm font-bold transition-colors ${isDark ? 'text-red-400 hover:bg-white/5' : 'text-red-600 hover:bg-red-50'}`}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
               <Link to="/login" className={`text-sm font-bold ${textClass}`}>Sign In</Link>
               <Link to="/register" className="bg-[#ffaa00] text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-0.5">Join Now</Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button 
            className={`lg:hidden p-2 transition-colors ${textClass}`}
            onClick={() => setIsMenuOpen(true)}
          >
            <FaBars size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div 
        className={`
          fixed top-0 right-0 h-full w-[80%] max-w-[300px] z-[1002] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:hidden flex flex-col border-l
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}
        `}
      >
        <div className={`p-6 flex items-center justify-between border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <img src={currentLogo} alt="Logo" className="h-9 object-contain" />
          <button onClick={() => setIsMenuOpen(false)} className={`w-9 h-9 rounded-full shadow-sm border flex items-center justify-center transition-all ${isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white' : 'bg-white border-gray-100 text-gray-500 hover:text-red-500'}`}>
            <FaTimes size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Menu</p>
            <div className="space-y-1">
              {navLinks.map((link, idx) => (
                <Link 
                  key={idx}
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${isDark ? 'text-gray-300 hover:bg-white/5 hover:text-[#ffaa00]' : 'text-gray-600 hover:bg-orange-50 hover:text-[#ffaa00]'}`}
                >
                  {link.name}
                  <FaChevronRight className={`text-xs opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 ${isDark ? 'text-[#ffaa00]' : 'text-orange-400'}`} />
                </Link>
              ))}
            </div>
          </div>
          
          <div className={`border-t pt-6 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
             {userRole ? (
                 <button 
                    onClick={handleLogout} 
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold transition-all ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                 >
                    <FaSignOutAlt /> Sign Out
                 </button>
             ) : (
                 <div className="space-y-3">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className={`flex items-center justify-center w-full px-5 py-3.5 rounded-xl border-2 font-bold ${isDark ? 'border-white/10 text-gray-300 hover:text-[#ffaa00]' : 'border-gray-100 text-gray-700 hover:text-[#ffaa00]'}`}>
                        <FaSignInAlt className="mr-2" /> Sign In
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center w-full px-5 py-4 rounded-xl bg-[#ffaa00] text-white font-bold shadow-lg hover:bg-orange-600">
                        <FaUserPlus className="mr-2" /> Join Now
                    </Link>
                 </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;