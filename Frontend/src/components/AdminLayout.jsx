import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUtensils, FaSignOutAlt, FaClipboardList, 
  FaBars, FaTimes, FaUserCircle, FaMoon, FaSun
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Use Theme Hook
  const isDark = theme === 'dark';

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Theme Classes
  const bgMain = isDark ? 'bg-[#0f0f0f]' : 'bg-gray-100';
  const bgSidebar = isDark ? 'bg-[#1a1a1a] border-r border-white/10' : 'bg-white border-r border-gray-200';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  
  const navItemClass = (path) => `
    w-full flex items-center px-4 py-3 rounded-xl transition-all font-bold mb-1
    ${isActive(path) 
      ? 'bg-[#ffaa00] text-white shadow-lg shadow-orange-500/30' 
      : `${textSub} hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#ffaa00]`}
  `;

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-500 ${bgMain}`}>
      
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-[#ffaa00] text-white shadow-lg"
      >
        <FaBars />
      </button>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static top-0 left-0 h-full w-72 z-[999] shadow-2xl lg:shadow-none transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${bgSidebar}
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* Header & Profile */}
          <div className={`p-8 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className={`text-xl font-black ${textMain}`}>Menu</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-red-500"><FaTimes size={20} /></button>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#ffaa00]/10 flex items-center justify-center text-[#ffaa00] text-2xl">
                    <FaUserCircle />
                </div>
                <div>
                    <h3 className={`font-bold leading-tight ${textMain}`}>Restaurant Admin</h3>
                    <p className={`text-xs ${textSub}`}>Manage your business</p>
                </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 overflow-y-auto">
            <p className={`text-xs font-bold uppercase tracking-widest mb-4 px-2 ${textSub}`}>Dashboard</p>
            
            <button onClick={() => { navigate('/admin'); setIsSidebarOpen(false); }} className={navItemClass('/admin')}>
              <FaUtensils className="mr-3" /> My Restaurants
            </button>
            
            <button onClick={() => { navigate('/admin/create-restaurant'); setIsSidebarOpen(false); }} className={navItemClass('/admin/create-restaurant')}>
              <FaUtensils className="mr-3" /> Add Restaurant
            </button>
            
            <button onClick={() => { navigate('/admin/orders'); setIsSidebarOpen(false); }} className={navItemClass('/admin/orders')}>
              <FaClipboardList className="mr-3" /> Orders
            </button>
            
            {/* Removed Delivery Personnel Link */}
          </nav>

          {/* Footer (Theme & Logout) */}
          <div className={`p-6 border-t space-y-3 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
            
            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${isDark ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
                <span className="text-sm">Theme</span>
                {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-400" />}
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-10 pt-20 lg:pt-10 w-full max-w-[100vw] overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;