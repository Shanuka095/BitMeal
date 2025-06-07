// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#1F2937]/95 text-[#F8FAFC] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-extrabold text-[#e4b401] tracking-tight mb-4">BitMeal</h3>
            <p className="text-[#D1D5DB] text-sm leading-relaxed">
              Your go-to platform for discovering and ordering from top restaurants in your area.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#F8FAFC] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-[#D1D5DB] hover:text-[#e4b401] transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-[#D1D5DB] hover:text-[#e4b401] transition-colors duration-200 text-sm">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-[#D1D5DB] hover:text-[#e4b401] transition-colors duration-200 text-sm">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#F8FAFC] mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-[#D1D5DB] hover:text-[#e4b401] transition-colors duration-200">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-[#D1D5DB] hover:text-[#e4b401] transition-colors duration-200">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-[#D1D5DB] hover:text-[#e4b401] transition-colors duration-200">
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[#e4b401]/20 pt-2 text-center">
          <p className="text-[#D1D5DB] text-sm">
            © {new Date().getFullYear()} BitMeal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;