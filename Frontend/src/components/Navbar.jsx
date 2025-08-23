// src/components/Navbar.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes, FaShoppingCart, FaClipboardList } from 'react-icons/fa';
import { useCart } from '../context/CartContext'; // Import useCart hook

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { getTotalItemsInCart } = useCart(); // Use cart hook to get item count

  const handleLogout = () => {
    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    if (sessionKey) {
      sessionStorage.removeItem(sessionKey);
    }
    // Clear cart on logout
    sessionStorage.removeItem('bitmeal_cart');
    navigate('/login');
  };

  return (
    <nav className="bg-secondary-dark-grey shadow-lg fixed w-full z-50 transition-all duration-300 ease-in-out"> {/* Updated background color */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Left Corner - Logo */}
        <div className="flex-shrink-0">
          <Link to="/dashboard" className="flex items-center text-2xl font-extrabold text-primary-orange tracking-tight transform transition-transform duration-300 hover:scale-105"> {/* Using primary-orange */}
            <span role="img" aria-label="logo" className="mr-2">🍽️</span> BitMeal
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="text-gray-200 hover:text-primary-orange font-medium transition-colors duration-300 relative group">
              Home
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link to="/restaurants" className="text-gray-200 hover:text-primary-orange font-medium transition-colors duration-300 relative group">
              Menu
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link to="/my-orders" className="text-gray-200 hover:text-primary-orange font-medium transition-colors duration-300 relative group">
              My Orders
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link to="#" className="text-gray-200 hover:text-primary-orange font-medium transition-colors duration-300 relative group">
              Services
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link to="#" className="text-gray-200 hover:text-primary-orange font-medium transition-colors duration-300 relative group">
              About Us
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link to="#" className="text-gray-200 hover:text-primary-orange font-medium transition-colors duration-300 relative group">
              Contact Us
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </div>
        </div>

        {/* Right Corner - Profile and Cart Icons */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Link to="/cart" className="text-gray-200 hover:text-primary-orange transition-colors duration-300 transform hover:scale-110">
              <FaShoppingCart className="h-6 w-6" />
              {getTotalItemsInCart() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-bounce-once">
                  {getTotalItemsInCart()}
                </span>
              )}
            </Link>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-gray-200 hover:text-primary-orange focus:outline-none transition-colors duration-300 transform hover:scale-110"
            >
              <FaUserCircle className="h-8 w-8" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 rounded-lg shadow-xl py-2 border border-primary-orange/20 animate-[fadeIn_0.2s_ease-out]">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-secondary-dark-grey hover:bg-primary-orange/10 hover:text-primary-orange transition-colors duration-200"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/my-orders"
                  className="block px-4 py-2 text-secondary-dark-grey hover:bg-primary-orange/10 hover:text-primary-orange transition-colors duration-200"
                  onClick={() => setIsProfileOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-secondary-dark-grey hover:bg-primary-orange/10 hover:text-primary-orange transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-200 hover:text-primary-orange focus:outline-none transition-colors duration-300"
          >
            {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary-dark-grey px-4 pb-4 animate-[slideIn_0.3s_ease-out]">
          <Link
            to="/dashboard"
            className="block py-2 text-gray-200 hover:text-primary-orange font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/restaurants"
            className="block py-2 text-gray-200 hover:text-primary-orange font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Menu
          </Link>
          <Link
            to="/my-orders"
            className="block py-2 text-gray-200 hover:text-primary-orange font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            My Orders
          </Link>
          <Link
            to="#"
            className="block py-2 text-gray-200 hover:text-primary-orange font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            to="#"
            className="block py-2 text-gray-200 hover:text-primary-orange font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="#"
            className="block py-2 text-gray-200 hover:text-primary-orange font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </Link>
          <Link
            to="/profile"
            className="block py-2 text-gray-200 hover:text-primary-orange font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-gray-200 hover:text-primary-orange font-medium transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;