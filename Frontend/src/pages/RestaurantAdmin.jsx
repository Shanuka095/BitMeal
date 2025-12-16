import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaEye, FaPlus, FaStoreAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';
import PageLoader from '../components/PageLoader';

const RestaurantAdmin = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showAlert, showConfirm } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError('');
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;

      if (!token) {
        setError('No authentication token found.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3003/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data || response.data;
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleDeleteRestaurant = (id, name) => {
    showConfirm(
      `Delete "${name}"? This cannot be undone.`,
      async () => {
        const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
        const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
        try {
          await axios.delete(`http://localhost:3003/api/restaurants/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRestaurants(restaurants.filter(r => r._id !== id));
          showAlert(`Deleted "${name}" successfully.`);
        } catch (err) {
          showAlert(err.response?.data?.error || 'Failed to delete restaurant');
        }
      },
      () => {}
    );
  };

  // Theme Classes
  const cardBg = isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';

  if (loading) return <PageLoader />;

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
            <h1 className={`text-3xl font-black ${textMain}`}>My Restaurants</h1>
            <p className={`text-sm ${textSub}`}>Manage your outlets and menus.</p>
        </div>
        <button 
            onClick={() => navigate('/admin/create-restaurant')}
            className="flex items-center gap-2 bg-[#ffaa00] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95"
        >
            <FaPlus /> Add New Restaurant
        </button>
      </div>

      {error && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-center font-bold mb-8">
            {error}
        </div>
      )}

      {/* Grid Content */}
      {restaurants.length === 0 && !error ? (
        <div className={`p-16 rounded-[2.5rem] text-center border-2 border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl ${isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-50 text-gray-300'}`}>
                <FaStoreAlt />
            </div>
            <h3 className={`text-xl font-bold ${textMain} mb-2`}>No Restaurants Yet</h3>
            <p className={`text-sm ${textSub} mb-6`}>Get started by creating your first restaurant.</p>
            <button onClick={() => navigate('/admin/create-restaurant')} className="text-[#ffaa00] font-bold hover:underline">Create Now</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className={`group relative rounded-[2rem] overflow-hidden border shadow-sm hover:shadow-2xl transition-all duration-300 ${cardBg}`}>
              
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                {restaurant.imageUrl ? (
                  <img
                    src={`http://localhost:3003/uploads/${restaurant.imageUrl}`}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <FaStoreAlt className="text-4xl text-gray-300" />
                  </div>
                )}
                
                {/* Status Badge (if exists in model) */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-black shadow-sm">
                    {restaurant.status || 'Active'}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className={`text-xl font-black mb-2 line-clamp-1 ${textMain}`}>{restaurant.name}</h3>
                <div className="flex items-start gap-2 mb-6 min-h-[40px]">
                    <FaMapMarkerAlt className="text-[#ffaa00] mt-1 flex-shrink-0" />
                    <p className={`text-sm ${textSub} line-clamp-2`}>{restaurant.address}</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/admin/restaurant/${restaurant._id}`)}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                    >
                        <FaEye className="inline mr-2" /> Manage
                    </button>
                    <button
                        onClick={() => handleDeleteRestaurant(restaurant._id, restaurant.name)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                        <FaTrash />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RestaurantAdmin;