import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaUtensils, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Find the current session token key and remove it
    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    if (sessionKey) {
      sessionStorage.removeItem(sessionKey);
    }
    // No need to remove from localStorage anymore
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <aside className="fixed w-64 h-screen bg-gradient-to-br from-yellow-600 to-orange-500 text-white p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li><button onClick={() => navigate('/admin')} className={`w-full text-left p-3 rounded-lg transition ${location.pathname === '/admin' ? 'bg-yellow-500 font-semibold' : 'hover:bg-yellow-400'}`}><FaUtensils className="inline mr-2" /> Overview</button></li>
            <li><button onClick={() => navigate('/admin/create-restaurant')} className={`w-full text-left p-3 rounded-lg transition ${location.pathname === '/admin/create-restaurant' ? 'bg-yellow-500 font-semibold' : 'hover:bg-yellow-400'}`}><FaUtensils className="inline mr-2" /> Add Restaurant</button></li>
            <li><button onClick={() => navigate('/admin/orders')} className={`w-full text-left p-3 rounded-lg transition ${location.pathname === '/admin/orders' ? 'bg-yellow-500 font-semibold' : 'hover:bg-yellow-400'}`}><FaClipboardList className="inline mr-2" /> Manage Orders</button></li>
            <li><button onClick={handleLogout} className="w-full text-left p-3 rounded-lg hover:bg-yellow-400 mt-6"><FaSignOutAlt className="inline mr-2" /> Logout</button></li>
          </ul>
        </nav>
      </aside>
      <main className="ml-64 p-8 pt-6">
        <Outlet /> {/* Renders the child route component */}
      </main>
    </div>
  );
};

export default AdminLayout;
