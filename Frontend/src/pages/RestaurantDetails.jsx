import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useCart } from '../context/CartContext';
import { FaPlus, FaStar, FaMapMarkerAlt, FaUtensils, FaArrowLeft } from 'react-icons/fa';
import PageLoader from '../components/PageLoader';
import { useTheme } from '../context/ThemeContext'; // Import Theme

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [groupedMenu, setGroupedMenu] = useState({});
  
  const { cartItems } = useCart();
  const { theme } = useTheme(); // Use Theme
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setTimeout(async () => {
            const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
            const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;

            if (token) {
                try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);
                } catch (e) { setUserRole(null); }
            }

            const response = await axios.get(`http://localhost:3000/api/restaurants/public/${id}`);
            setRestaurant(response.data);

            const menu = response.data.menu || [];
            const newGroupedMenu = menu.reduce((acc, item) => {
                const category = item.category || 'Other';
                if (!acc[category]) acc[category] = [];
                acc[category].push(item);
                return acc;
            }, {});
            setGroupedMenu(newGroupedMenu);
            
            setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch restaurant details');
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleItemClick = (item) => {
    navigate(`/restaurant/${id}/menu/${item._id}`, { state: { item, restaurant } });
  };

  if (loading) return <PageLoader />;
  if (error) return <div className={`p-20 text-center font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</div>;
  if (!restaurant) return <div className={`p-20 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Restaurant not found</div>;

  const categories = Object.keys(groupedMenu);

  // Theme Styles
  const pageBg = isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]';
  const cardBg = isDark ? 'bg-[#1a1a1a] border-white/5 hover:border-white/10' : 'bg-white border-gray-100 hover:border-gray-200';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-500 ${pageBg}`}>
      
      {/* Hero Section */}
      <div className="relative h-[350px] md:h-[400px] w-full overflow-hidden group">
        <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
        >
            <FaArrowLeft />
        </button>

        {restaurant.imageUrl ? (
            <img 
                src={`http://localhost:3003/uploads/${restaurant.imageUrl}`} 
                className="w-full h-full object-cover filter brightness-75 scale-105 group-hover:scale-100 transition-transform duration-[2s]"
                alt="Background"
            />
        ) : (
            <div className="w-full h-full bg-gray-800"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 pb-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6">
                <div className={`w-28 h-28 md:w-36 md:h-36 rounded-[2rem] border-4 border-white/10 shadow-2xl overflow-hidden flex-shrink-0 -mb-4 backdrop-blur-sm ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
                    {restaurant.imageUrl ? (
                        <img src={`http://localhost:3003/uploads/${restaurant.imageUrl}`} className="w-full h-full object-cover" alt="Logo"/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><FaUtensils size={30}/></div>
                    )}
                </div>
                
                <div className="text-white mb-1 flex-1">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">{restaurant.name}</h1>
                    <p className="flex items-center text-gray-300 text-sm md:text-base font-medium mb-4 opacity-90">
                        <FaMapMarkerAlt className="mr-2 text-[#ffaa00]" /> {restaurant.address}
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                            <FaStar className="text-yellow-400 mr-1.5 text-sm" />
                            <span className="font-bold text-sm">{restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "New"}</span>
                            <span className="text-xs text-gray-400 ml-1">({restaurant.totalRatings})</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-green-500/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-lg shadow-green-500/20">
                            Open Now
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Menu Grid (Full Width now) */}
        <div className="w-full">
            {categories.length > 0 ? (
                <div className="space-y-16">
                    {categories.map(category => (
                        <div key={category}>
                            <h3 className={`text-2xl font-black mb-6 flex items-center tracking-tight border-b pb-4 ${textMain} ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                {category}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(groupedMenu[category] || []).map((item) => {
                                    if (!item) return null;
                                    
                                    const cartItemNormal = cartItems.find(cartIt => cartIt.menuItemId === item._id && cartIt.size === 'normal');
                                    const cartItemFull = cartItems.find(cartIt => cartIt.menuItemId === item._id && cartIt.size === 'full');
                                    const isInCart = cartItemNormal || cartItemFull;

                                    return (
                                        <div
                                            key={item._id}
                                            onClick={() => handleItemClick(item)}
                                            className={`
                                                p-4 rounded-[2rem] shadow-sm border transition-all duration-300 cursor-pointer group flex gap-5 items-center
                                                ${cardBg} ${isInCart ? 'border-[#ffaa00] ring-1 ring-[#ffaa00]/20' : 'hover:shadow-xl hover:-translate-y-1'}
                                            `}
                                        >
                                            {/* Image */}
                                            <div className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-inner ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                {item.imageUrl ? (
                                                    <img src={`http://localhost:3003/uploads/${item.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><FaUtensils size={24}/></div>
                                                )}
                                                {isInCart && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                                                        <span className="text-white font-bold text-lg">{cartItemNormal?.quantity || cartItemFull?.quantity}x</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-grow min-w-0">
                                                <h4 className={`text-lg font-bold mb-1 group-hover:text-[#ffaa00] transition-colors truncate ${textMain}`}>{item.name}</h4>
                                                <p className={`text-xs font-semibold uppercase tracking-wider mt-1 mb-3 ${textSub}`}>{item.category}</p>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className={`font-black text-lg ${textMain}`}>
                                                        Rs. {item.normalPrice}
                                                    </div>
                                                    
                                                    {userRole === 'customer' && (
                                                        <button
                                                            className={`
                                                                w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm
                                                                ${isInCart ? 'bg-[#ffaa00] text-white' : (isDark ? 'bg-white/10 text-gray-300 group-hover:bg-[#ffaa00] group-hover:text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#ffaa00] group-hover:text-white')}
                                                            `}
                                                        >
                                                            <FaPlus size={10} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className={`text-lg ${textSub}`}>No menu items available.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;