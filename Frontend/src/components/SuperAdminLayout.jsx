import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaUtensils, FaClipboardList } from 'react-icons/fa';

const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      <aside className="w-72 bg-[#1a1a1a] text-white flex flex-col fixed h-full shadow-2xl z-50">
        <div className="p-8 border-b border-gray-800">
          <h2 className="text-2xl font-black text-white tracking-tight">Super Admin</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Control Panel</p>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <button
            onClick={() => navigate('/super-admin')}
            className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all font-bold ${isActive('/super-admin') ? 'bg-[#ffaa00] text-black shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <FaUtensils className="mr-3" /> Dashboard
          </button>
          
          <button
            onClick={() => navigate('/super-admin/pending-restaurants')}
            className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all font-bold ${isActive('/super-admin/pending-restaurants') ? 'bg-[#ffaa00] text-black shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <FaClipboardList className="mr-3" /> Pending Requests
          </button>
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-6 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;