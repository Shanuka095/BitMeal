// src/components/Navbar.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-[#e3e3e3] shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Left Corner - Logo */}
        <div className="flex-shrink-0">
          <Link to="/dashboard" className="flex items-center text-2xl font-extrabold text-[#ffaa00] tracking-tight">
            <span role="img" aria-label="logo">🍽️</span> BitMeal
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="text-[#4f4f4f] hover:text-[#ffaa00] font-medium transition-colors duration-200">
              Home
            </Link>
            <Link to="/restaurants" className="text-[#4f4f4f] hover:text-[#ffaa00] font-medium transition-colors duration-200">
              Menu
            </Link>
            <Link to="#" className="text-[#4f4f4f] hover:text-[#ffaa00] font-medium transition-colors duration-200">
              Services
            </Link>
            <Link to="#" className="text-[#4f4f4f] hover:text-[#ffaa00] font-medium transition-colors duration-200">
              About Us
            </Link>
            <Link to="#" className="text-[#4f4f4f] hover:text-[#ffaa00] font-medium transition-colors duration-200">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Right Corner - Profile and Cart Icons */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Link to="#" className="text-[#4f4f4f] hover:text-[#ffaa00] transition-colors duration-200">
              <FaShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-[#ffaa00] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">1</span>
            </Link>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-[#4f4f4f] hover:text-[#ffaa00] focus:outline-none transition-colors duration-200"
            >
              <FaUserCircle className="h-8 w-8" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 rounded-lg shadow-xl py-2 border border-[#ffaa00]/20 animate-[fadeIn_0.2s_ease-out]">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-[#4f4f4f] hover:bg-[#ffaa00]/10 hover:text-[#ffaa00] transition-colors duration-200"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-[#4f4f4f] hover:bg-[#ffaa00]/10 hover:text-[#ffaa00] transition-colors duration-200"
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
            className="text-[#4f4f4f] hover:text-[#ffaa00] focus:outline-none transition-colors duration-200"
          >
            {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#e3e3e3] px-4 pb-4 animate-[slideIn_0.3s_ease-out]">
          <Link
            to="/dashboard"
            className="block py-2 text-[#4f4f4f] hover:text-[#ffaa00] font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/restaurants"
            className="block py-2 text-[#4f4f4f] hover:text-[#ffaa00] font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Menu
          </Link>
          <Link
            to="#"
            className="block py-2 text-[#4f4f4f] hover:text-[#ffaa00] font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            to="#"
            className="block py-2 text-[#4f4f4f] hover:text-[#ffaa00] font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="#"
            className="block py-2 text-[#4f4f4f] hover:text-[#ffaa00] font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </Link>
          <Link
            to="/profile"
            className="block py-2 text-[#4f4f4f] hover:text-[#ffaa00] font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[#4f4f4f] hover:text-[#ffaa00] font-medium transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;