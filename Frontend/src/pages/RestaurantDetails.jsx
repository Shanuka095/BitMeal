import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useCart } from '../context/CartContext';
import { FaPlus, FaStar, FaMapMarkerAlt, FaUtensils, FaArrowLeft } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
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
  const categoryRefs = useRef({});

  const { cartItems } = useCart();

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
        }, 1500);
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

  const scrollToCategory = (category) => {
    setActiveCategory(category);
    const elementId = `cat-${category.replace(/\s+/g, '-')}`;
    const element = document.getElementById(elementId);
    
    if (element) {
      const headerOffset = 180; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <div className="p-20 text-center text-red-600 font-bold">{error}</div>;
  if (!restaurant) return <div className="p-20 text-center text-gray-600">Restaurant not found</div>;

  const categories = Object.keys(groupedMenu);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20">
      
      {/* Hero Section */}
      <div className="relative h-[350px] md:h-[400px] w-full overflow-hidden">
        {/* --- NEW: Back Button --- */}
        <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-50 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shadow-lg group"
        >
            <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform" />
        </button>

        {restaurant.imageUrl ? (
            <img 
                src={`http://localhost:3003/uploads/${restaurant.imageUrl}`} 
                className="w-full h-full object-cover filter blur-[2px] scale-105"
                alt="Background"
            />
        ) : (
            <div className="w-full h-full bg-gray-800"></div>
        )}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 text-center md:text-left">
                <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white flex-shrink-0 -mb-2 md:mb-0">
                    {restaurant.imageUrl ? (
                        <img src={`http://localhost:3003/uploads/${restaurant.imageUrl}`} className="w-full h-full object-cover" alt="Logo"/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><FaUtensils size={30}/></div>
                    )}
                </div>
                
                <div className="text-white mb-2 flex-1">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-1 md:mb-2">{restaurant.name}</h1>
                    <p className="flex items-center justify-center md:justify-start text-gray-200 text-xs md:text-base font-medium mb-3 md:mb-4">
                        <FaMapMarkerAlt className="mr-1.5 text-[#ffaa00]" /> {restaurant.address}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <div className="flex items-center bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                            <FaStar className="text-yellow-400 mr-1.5 text-sm" />
                            <span className="font-bold text-sm">{restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "New"}</span>
                            <span className="text-xs text-gray-300 ml-1">({restaurant.totalRatings})</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-green-500 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider">
                            Open Now
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sticky Sidebar (Categories) */}
        <div className="w-full lg:w-1/4 lg:block">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 overflow-x-auto lg:overflow-visible whitespace-nowrap lg:whitespace-normal flex lg:block gap-2 z-30">
                <h3 className="hidden lg:block text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Categories</h3>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => scrollToCategory(category)}
                        className={`px-4 py-2.5 lg:w-full lg:text-left rounded-xl text-sm font-bold transition-all duration-300 flex-shrink-0 lg:flex-shrink lg:flex justify-between items-center ${
                            activeCategory === category 
                            ? 'bg-[#ffaa00] text-white shadow-md shadow-orange-500/30' 
                            : 'text-gray-600 bg-gray-50 lg:bg-transparent hover:bg-gray-100 hover:text-[#ffaa00]'
                        }`}
                    >
                        {category}
                        {activeCategory === category && <span className="hidden lg:block bg-white/30 w-2 h-2 rounded-full"></span>}
                    </button>
                ))}
            </div>
        </div>

        {/* Menu Grid */}
        <div className="w-full lg:w-3/4">
            {categories.length > 0 ? (
                <div className="space-y-12">
                    {categories.map(category => (
                        <div 
                            key={category} 
                            id={`cat-${category.replace(/\s+/g, '-')}`} 
                            className="scroll-mt-40"
                        >
                            <h3 className="text-xl md:text-2xl font-extrabold text-gray-800 mb-6 border-b border-gray-200 pb-2 flex items-center">
                                <span className="bg-[#ffaa00] w-1.5 h-6 md:h-8 mr-3 rounded-full"></span>
                                {category}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                                                bg-white p-3 md:p-4 rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer group flex gap-3 md:gap-4
                                                ${isInCart ? 'border-[#ffaa00] ring-1 ring-[#ffaa00]/20 bg-orange-50/30' : 'border-gray-100 hover:shadow-xl hover:border-gray-200'}
                                            `}
                                        >
                                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                                                {item.imageUrl ? (
                                                    <img src={`http://localhost:3003/uploads/${item.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><FaUtensils/></div>
                                                )}
                                                {isInCart && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                                                        <span className="text-white font-bold text-lg">{cartItemNormal?.quantity || cartItemFull?.quantity}x</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow flex flex-col justify-between py-1">
                                                <div>
                                                    <h4 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-[#ffaa00] transition-colors line-clamp-2 leading-tight">{item.name}</h4>
                                                    <p className="text-gray-400 text-[10px] md:text-xs mt-1 font-medium uppercase tracking-wide">{item.category}</p>
                                                </div>
                                                
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="text-gray-900 font-black text-base md:text-lg">
                                                        Rs. {item.normalPrice}
                                                    </div>
                                                    
                                                    {userRole === 'customer' && (
                                                        <button
                                                            className={`
                                                                w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm
                                                                ${isInCart ? 'bg-white text-[#ffaa00] border border-[#ffaa00]' : 'bg-gray-100 text-gray-400 group-hover:bg-[#ffaa00] group-hover:text-white'}
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