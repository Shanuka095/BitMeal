// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes, FaShoppingCart, FaClipboardList } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import jwtDecode from 'jwt-decode';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userRole, setUserRole] = useState(null); // To display role-specific links
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItemsInCart } = useCart();

  useEffect(() => {
    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (e) {
        console.error("Failed to decode token in Navbar:", e);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [location.pathname]); // Re-evaluate role on route change

  const handleLogout = () => {
    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    if (sessionKey) {
      sessionStorage.removeItem(sessionKey);
    }
    sessionStorage.removeItem('bitmeal_cart');
    setUserRole(null); // Clear role on logout
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/dashboard', roles: ['customer', 'restaurant_admin', 'delivery_personnel'] },
    { name: 'Menu', path: '/restaurants', roles: ['customer'] },
    { name: 'My Orders', path: '/my-orders', roles: ['customer'] },
    { name: 'Services', path: '#', roles: ['customer', 'restaurant_admin', 'delivery_personnel'] },
    { name: 'About Us', path: '#', roles: ['customer', 'restaurant_admin', 'delivery_personnel'] },
    { name: 'Contact Us', path: '#', roles: ['customer', 'restaurant_admin', 'delivery_personnel'] },
  ];

  const profileLinks = [
    { name: 'Profile', path: '/profile', roles: ['customer', 'restaurant_admin', 'delivery_personnel'] },
    { name: 'My Orders', path: '/my-orders', roles: ['customer'] },
    { name: 'Admin Dashboard', path: '/admin', roles: ['restaurant_admin'] },
    { name: 'Driver Dashboard', path: '/delivery-personnel', roles: ['delivery_personnel'] },
  ];

  return (
    <nav className="bg-secondary-dark-grey text-text-light shadow-xl fixed w-full z-50 transition-all duration-300 ease-in-out py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left Corner - Logo */}
        <div className="flex-shrink-0">
          <Link to="/dashboard" className="flex items-center text-3xl font-extrabold text-primary-orange tracking-wide transform transition-transform duration-300 hover:scale-105 hover:drop-shadow-md">
            <span role="img" aria-label="logo" className="mr-2 text-4xl">🍽️</span> BitMeal
          </Link>
        </div>

        {/* Center - Navigation Links (Desktop) */}
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex space-x-8">
            {navLinks.filter(link => link.roles.includes(userRole)).map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative group text-lg font-medium transition-colors duration-300
                  ${location.pathname.startsWith(link.path) && link.path !== '#' ? 'text-primary-orange' : 'hover:text-primary-orange'}`}
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Corner - Icons */}
        <div className="flex items-center space-x-5">
          {userRole === 'customer' && ( // Only show cart for customers
            <div className="relative">
              <Link to="/cart" className="text-text-light hover:text-primary-orange transition-colors duration-300 transform hover:scale-110 active:scale-95">
                <FaShoppingCart className="h-7 w-7" />
                {getTotalItemsInCart() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-once">
                    {getTotalItemsInCart()}
                  </span>
                )}
              </Link>
            </div>
          )}
          
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-text-light hover:text-primary-orange focus:outline-none transition-colors duration-300 transform hover:scale-110 active:scale-95"
            >
              <FaUserCircle className="h-9 w-9" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 border border-primary-orange/30 animate-fade-in-down origin-top-right">
                {profileLinks.filter(link => link.roles.includes(userRole)).map(link => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block px-5 py-2 text-secondary-dark-grey hover:bg-primary-orange/10 hover:text-primary-orange transition-colors duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-5 py-2 text-secondary-dark-grey hover:bg-primary-orange/10 hover:text-primary-orange transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden ml-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-text-light hover:text-primary-orange focus:outline-none transition-colors duration-300"
          >
            {isMenuOpen ? <FaTimes className="h-7 w-7" /> : <FaBars className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Responsive) */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary-dark-grey px-4 pb-4 animate-slide-in-left border-t border-primary-orange/20">
          {navLinks.filter(link => link.roles.includes(userRole)).map(link => (
            <Link
              key={link.name}
              to={link.path}
              className="block py-2 text-text-light hover:text-primary-orange font-medium transition-colors duration-200 border-b border-gray-700 last:border-b-0"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {profileLinks.filter(link => link.roles.includes(userRole)).map(link => (
            <Link
              key={link.name}
              to={link.path}
              className="block py-2 text-text-light hover:text-primary-orange font-medium transition-colors duration-200 border-b border-gray-700 last:border-b-0"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-text-light hover:text-primary-orange font-medium transition-colors duration-200 mt-2"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;