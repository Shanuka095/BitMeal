// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-secondary-dark-grey text-text-light py-12 mt-auto shadow-inner-top relative">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-dark-grey via-gray-800 to-secondary-dark-grey opacity-70"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Grid for 4 columns, removed border-b to simplify */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="flex flex-col items-start text-left animate-fade-in-down">
            <h3 className="text-4xl font-extrabold text-primary-orange tracking-tight mb-4 drop-shadow-md">BitMeal</h3>
            <p className="text-gray-300 text-base leading-relaxed max-w-xs opacity-90">
              Your ultimate destination for delicious food, delivered fresh and fast to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start text-left animate-fade-in-down delay-100">
            <h4 className="text-xl font-semibold text-white mb-4 border-b-2 border-primary-orange/50 pb-2">Quick Links</h4>
            <ul className="space-y-2 text-base">
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 relative group">
                  Home
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 relative group">
                  Menu
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 relative group">
                  Profile
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 relative group">
                  My Orders
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-start text-left animate-fade-in-down delay-200">
            <h4 className="text-xl font-semibold text-white mb-4 border-b-2 border-primary-orange/50 pb-2">Contact Us</h4>
            <ul className="space-y-2 text-base">
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-primary-orange" />
                <a href="mailto:info@bitmeal.com" className="text-gray-300 hover:text-primary-orange transition-colors duration-300">info@bitmeal.com</a>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-2 text-primary-orange" />
                <a href="tel:+94771234567" className="text-gray-300 hover:text-primary-orange transition-colors duration-300">+94 77 123 4567</a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-start text-left animate-fade-in-down delay-300">
            <h4 className="text-xl font-semibold text-white mb-4 border-b-2 border-primary-orange/50 pb-2">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 transform hover:scale-125 animate-scale-in">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 transform hover:scale-125 animate-scale-in delay-100">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 transform hover:scale-125 animate-scale-in delay-200">
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm opacity-80 animate-fade-in-down delay-400">
            © {new Date().getFullYear()} BitMeal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;