// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-secondary-dark-grey text-white py-12 mt-auto shadow-inner-top"> {/* Updated background color */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-primary-orange/30 pb-8 mb-8">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-4xl font-extrabold text-primary-orange tracking-tight mb-4 animate-fade-in-up">BitMeal</h3>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs animate-fade-in-up delay-100">
              Your go-to platform for discovering and ordering from top restaurants in your area.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-xl font-semibold text-white mb-4 animate-fade-in-up delay-200">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 text-base relative group">
                  Home
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 text-base relative group">
                  Menu
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 text-base relative group">
                  Profile
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 text-base relative group">
                  My Orders
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div className="text-center md:text-left">
            <h4 className="text-xl font-semibold text-white mb-4 animate-fade-in-up delay-300">Connect With Us</h4>
            <div className="flex justify-center md:justify-start space-x-5">
              <a href="#" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 transform hover:scale-125 animate-pop-in">
                <FaFacebook className="h-7 w-7" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 transform hover:scale-125 animate-pop-in delay-100">
                <FaTwitter className="h-7 w-7" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 transform hover:scale-125 animate-pop-in delay-200">
                <FaInstagram className="h-7 w-7" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-sm animate-fade-in-up delay-400">
            © {new Date().getFullYear()} BitMeal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;