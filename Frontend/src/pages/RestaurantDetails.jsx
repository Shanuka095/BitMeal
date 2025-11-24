import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useCart } from '../context/CartContext';
import { FaPlus, FaStar, FaMapMarkerAlt, FaUtensils, FaArrowLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import PageLoader from '../components/PageLoader';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [groupedMenu, setGroupedMenu] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);

  const { cartItems } = useCart();

  // --- FIX: Robust ID Generator ---
  // Removes spaces/special chars to ensure valid HTML IDs (e.g. "Fried Rice" -> "cat-fried-rice")
  const generateId = (name) => {
    return `cat-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  };

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
            
            if (Object.keys(newGroupedMenu).length > 0) {
                setActiveCategory(Object.keys(newGroupedMenu)[0]);
            }
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

  // --- FIX: Scroll Handler ---
  const scrollToCategory = (category) => {
    setActiveCategory(category);
    const elementId = generateId(category);
    const element = document.getElementById(elementId);
    
    if (element) {
      // 'scroll-mt-[180px]' in the render method handles the offset automatically
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <div className="p-20 text-center text-red-600 font-bold">{error}</div>;
  if (!restaurant) return <div className="p-20 text-center text-gray-600">Restaurant not found</div>;

  const categories = Object.keys(groupedMenu);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20">
      
      {/* 1. Hero Section */}
      <div className="relative h-[350px] md:h-[400px] w-full overflow-hidden group">
        {/* Back Button */}
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
                {/* Main Logo */}
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] border-4 border-white/10 shadow-2xl overflow-hidden bg-white flex-shrink-0 -mb-4 backdrop-blur-sm">
                    {restaurant.imageUrl ? (
                        <img src={`http://localhost:3003/uploads/${restaurant.imageUrl}`} className="w-full h-full object-cover" alt="Logo"/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><FaUtensils size={30}/></div>
                    )}
                </div>
                
                {/* Info */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-col lg:flex-row gap-10">
        
        {/* 2. Sticky Categories Sidebar */}
        <div className="w-full lg:w-1/4 lg:block">
            <div className="sticky top-24 bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 p-2 overflow-x-auto lg:overflow-visible whitespace-nowrap lg:whitespace-normal flex lg:block gap-2 z-30">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => scrollToCategory(category)}
                        className={`px-5 py-3.5 lg:w-full lg:text-left rounded-2xl text-sm font-bold transition-all duration-300 flex-shrink-0 lg:flex-shrink lg:flex justify-between items-center ${
                            activeCategory === category 
                            ? 'bg-gray-900 text-white shadow-lg transform scale-100' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        {category}
                        {activeCategory === category && <FaChevronRight className="hidden lg:block text-xs text-gray-500" />}
                    </button>
                ))}
            </div>
        </div>

        {/* 3. Menu Grid */}
        <div className="w-full lg:w-3/4">
            {categories.length > 0 ? (
                <div className="space-y-16">
                    {categories.map(category => (
                        // --- SCROLL TARGET ---
                        // The 'scroll-mt-[180px]' class is CRITICAL. It pushes the scroll stop point down 
                        // so the title isn't hidden behind the sticky header.
                        <div 
                            key={category} 
                            id={generateId(category)} 
                            className="scroll-mt-[180px]"
                        >
                            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center tracking-tight border-b border-gray-200 pb-4">
                                {category}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                bg-white p-4 rounded-[2rem] shadow-sm border transition-all duration-300 cursor-pointer group flex gap-5 items-center
                                                ${isInCart ? 'border-[#ffaa00] ring-2 ring-[#ffaa00]/10' : 'border-gray-100 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1'}
                                            `}
                                        >
                                            {/* Image */}
                                            <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 relative shadow-inner">
                                                {item.imageUrl ? (
                                                    <img src={`http://localhost:3003/uploads/${item.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><FaUtensils size={30}/></div>
                                                )}
                                                {isInCart && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                                                        <span className="text-white font-bold text-lg">{cartItemNormal?.quantity || cartItemFull?.quantity}x</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-grow min-w-0">
                                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#ffaa00] transition-colors truncate">{item.name}</h4>
                                                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1 mb-3">{item.category}</p>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className="text-gray-900 font-black text-lg">
                                                        Rs. {item.normalPrice}
                                                    </div>
                                                    
                                                    {userRole === 'customer' && (
                                                        <button
                                                            className={`
                                                                w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm
                                                                ${isInCart ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#ffaa00] group-hover:text-white'}
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
                    <p className="text-gray-500 text-lg">No menu items available.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;