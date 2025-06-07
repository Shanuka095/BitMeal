// src/components/Navbar.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-[#1F2937]/95 shadow-lg fixed w-full z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-2xl font-extrabold text-[#e4b401] tracking-tight">
              BitMeal
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-[#F8FAFC] hover:text-[#e4b401] font-medium transition-colors duration-200">
              Home
            </Link>
            <Link to="/restaurants" className="text-[#F8FAFC] hover:text-[#e4b401] font-medium transition-colors duration-200">
              Restaurants
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center text-[#F8FAFC] hover:text-[#e4b401] focus:outline-none transition-colors duration-200"
              >
                <FaUserCircle className="h-8 w-8" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 rounded-lg shadow-xl py-2 border border-[#e4b401]/20 animate-[fadeIn_0.2s_ease-out]">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-[#1F2937] hover:bg-[#e4b401]/10 hover:text-[#e4b401] transition-colors duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsLogoutOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[#1F2937] hover:bg-[#e4b401]/10 hover:text-[#e4b401] transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#F8FAFC] hover:text-[#e4b401] focus:outline-none transition-colors duration-200"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-[#1F2937]/95 px-4 pb-4 animate-[slideIn_0.3s_ease-out]">
            <Link
              to="/dashboard"
              className="block py-2 text-[#F8FAFC] hover:text-[#e4b401] font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/restaurants"
              className="block py-2 text-[#F8FAFC] hover:text-[#e4b401] font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Restaurants
            </Link>
            <Link
              to="/profile"
              className="block py-2 text-[#F8FAFC] hover:text-[#e4b401] font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                setIsLogoutOpen(true);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-[#F8FAFC] hover:text-[#e4b401] font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      {isLogoutOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-lg p-6 shadow-xl border border-[#e4b401]/20 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Are you sure you want to log out?</h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsLogoutOpen(false)}
                className="px-4 py-2 text-[#1F2937] bg-[#F9FAFB] rounded-lg hover:bg-[#E5E7EB] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsLogoutOpen(false);
                }}
                className="px-4 py-2 text-[#1F2937] bg-[#e4b401] rounded-lg hover:bg-[#c99e01] transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;