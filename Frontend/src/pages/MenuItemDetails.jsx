import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, FaMinus, FaPlus, FaShoppingCart, FaUtensils, 
  FaHeart, FaShareAlt, FaFire, FaLeaf, FaClock 
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import PageLoader from '../components/PageLoader';
import { useTheme } from '../context/ThemeContext';

const MenuItemDetails = () => {
  const { id, menuId } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, cartItems } = useCart();
  const { showAlert } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [item, setItem] = useState(location.state?.item || null);
  const [restaurant, setRestaurant] = useState(location.state?.restaurant || null);
  const [loading, setLoading] = useState(!location.state?.item);
  
  const [selectedSize, setSelectedSize] = useState('normal');
  const [quantity, setQuantity] = useState(1);
  const [relatedItems, setRelatedItems] = useState([]);
  const [specialRequest, setSpecialRequest] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const cartItem = cartItems.find(
    cartIt => cartIt.menuItemId === menuId && cartIt.size === selectedSize
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        let currentRestaurant = restaurant;
        if (!currentRestaurant) {
          const response = await axios.get(`http://localhost:3000/api/restaurants/public/${id}`);
          currentRestaurant = response.data;
          setRestaurant(currentRestaurant);
        }

        if (currentRestaurant) {
            const foundItem = currentRestaurant.menu.find(m => m._id === menuId);
            if (foundItem) {
                setItem(foundItem);
                const related = currentRestaurant.menu
                    .filter(m => m.category === foundItem.category && m._id !== foundItem._id)
                    .slice(0, 4);
                setRelatedItems(related);
            } else {
                navigate(`/restaurant/${id}`);
            }
        }
      } catch (err) {
        console.error(err);
        navigate(`/restaurant/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, menuId, restaurant, navigate]);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem, selectedSize]);

  const getPrice = () => {
    if (!item) return 0;
    const normalPrice = item.normalPrice || 0;
    const extraPriceForFull = item.extraPriceForFull || 0;
    return selectedSize === 'full' ? normalPrice + extraPriceForFull : normalPrice;
  };

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedSize, restaurant._id);
    showAlert(`${item.name} added to cart!`);
    navigate(-1);
  };

  if (loading) return <PageLoader />;
  if (!item) return null;

  // Dynamic Classes
  const pageBg = isDark ? 'bg-[#0f0f0f]' : 'bg-white';
  const panelBg = isDark ? 'bg-[#111]' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderClass = isDark ? 'border-white/10' : 'border-gray-100';
  const optionBg = isDark ? 'bg-white/5 hover:border-white/20' : 'bg-white hover:border-gray-200';
  const optionSelected = isDark ? 'border-[#ffaa00] bg-orange-500/10' : 'border-[#ffaa00] bg-orange-50/40';

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-500 ${pageBg}`}>
      
      {/* Left Side: Hero Image */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen bg-gray-900 group overflow-hidden">
        <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-start">
            <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shadow-lg">
                <FaArrowLeft />
            </button>
            <div className="flex space-x-3">
                <button className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#ffaa00] transition-all duration-300 shadow-lg">
                    <FaShareAlt />
                </button>
                <button onClick={() => setIsFavorite(!isFavorite)} className={`w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg border border-white/10 flex items-center justify-center transition-all duration-300 shadow-lg ${isFavorite ? 'text-red-500 bg-white' : 'text-white hover:bg-white hover:text-red-500'}`}>
                    <FaHeart />
                </button>
            </div>
        </div>

        {item.imageUrl ? (
          <img src={`http://localhost:3003/uploads/${item.imageUrl}`} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[3s]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-100"><FaUtensils size={80} /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 md:bg-gradient-to-r md:from-transparent md:to-black/70"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
            <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-1.5 bg-[#ffaa00] text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">{item.category}</span>
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center border border-white/10"><FaClock className="mr-2" /> 15-20 min</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-none mb-4 drop-shadow-2xl">{item.name}</h1>
            <p className="text-gray-300 font-medium text-lg opacity-90 max-w-md">Crafted by <span className="text-white font-bold underline decoration-[#ffaa00] underline-offset-4">{restaurant?.name}</span></p>
        </div>
      </div>

      {/* Right Side: Content */}
      <div className={`w-full md:w-1/2 flex flex-col h-[60vh] md:h-screen relative rounded-t-[3rem] md:rounded-none -mt-12 md:mt-0 z-20 shadow-[0_-20px_60px_rgba(0,0,0,0.3)] md:shadow-none ${panelBg}`}>
        
        <div className="flex-1 overflow-y-auto px-6 py-10 md:px-16 md:py-12 pb-32 custom-scrollbar">
            <div className="mb-10">
                <h3 className={`text-xs font-extrabold uppercase tracking-[0.2em] mb-4 ${textSub}`}>About this Dish</h3>
                <p className={`leading-relaxed text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Enjoy the authentic taste of our {item.name}. Prepared with fresh ingredients and signature spices, this dish is a customer favorite for a reason.
                </p>
            </div>

            {/* Size Selection */}
            <div className="mb-10">
                <h3 className={`text-xs font-extrabold uppercase tracking-[0.2em] mb-5 ${textSub}`}>Choose Size</h3>
                <div className="space-y-3">
                    <label className={`group flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedSize === 'normal' ? optionSelected : optionBg} ${borderClass}`}>
                        <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${selectedSize === 'normal' ? 'border-[#ffaa00]' : 'border-gray-300'}`}>
                                {selectedSize === 'normal' && <div className="w-3 h-3 rounded-full bg-[#ffaa00]"></div>}
                            </div>
                            <div><span className={`block font-bold text-lg ${textMain}`}>Normal</span><span className={`text-xs ${textSub}`}>Standard serving</span></div>
                        </div>
                        <span className={`font-bold ${textMain}`}>Rs. {(item.normalPrice || 0).toFixed(0)}</span>
                        <input type="radio" name="size" className="hidden" checked={selectedSize === 'normal'} onChange={() => setSelectedSize('normal')} />
                    </label>

                    {(item.extraPriceForFull || 0) > 0 && (
                        <label className={`group flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedSize === 'full' ? optionSelected : optionBg} ${borderClass}`}>
                            <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${selectedSize === 'full' ? 'border-[#ffaa00]' : 'border-gray-300'}`}>
                                    {selectedSize === 'full' && <div className="w-3 h-3 rounded-full bg-[#ffaa00]"></div>}
                                </div>
                                <div><span className={`block font-bold text-lg ${textMain}`}>Full Portion</span><span className={`text-xs ${textSub}`}>Extra large serving</span></div>
                            </div>
                            <span className={`font-bold ${textMain}`}>+ Rs. {item.extraPriceForFull}</span>
                            <input type="radio" name="size" className="hidden" checked={selectedSize === 'full'} onChange={() => setSelectedSize('full')} />
                        </label>
                    )}
                </div>
            </div>

            {/* Special Request */}
            <div className="mb-10">
                <h3 className={`text-xs font-extrabold uppercase tracking-[0.2em] mb-4 ${textSub}`}>Special Request</h3>
                <textarea 
                    className={`w-full p-4 rounded-2xl border-2 focus:border-[#ffaa00] focus:ring-0 outline-none transition-all text-sm resize-none font-medium ${isDark ? 'bg-white/5 border-transparent text-white placeholder-gray-500 focus:bg-black' : 'bg-gray-50 border-transparent text-gray-700 placeholder-gray-400 focus:bg-white'}`}
                    rows="3" placeholder="e.g. No onions, extra spicy..." value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)}
                ></textarea>
            </div>

            {/* Quantity */}
            <div className="mb-12">
                <h3 className={`text-xs font-extrabold uppercase tracking-[0.2em] mb-6 ${textSub}`}>Quantity</h3>
                <div className="flex items-center space-x-8">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>-</button>
                    <span className={`text-4xl font-black ${textMain}`}>{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>+</button>
                </div>
            </div>

            {/* Related Items */}
            {relatedItems.length > 0 && (
                <div className={`pt-8 border-t ${borderClass}`}>
                    <h3 className={`text-xs font-extrabold uppercase tracking-[0.15em] mb-6 flex items-center ${textSub}`}><FaFire className="mr-2 text-orange-500" /> Popular in {item.category}</h3>
                    <div className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar">
                        {relatedItems.map(related => (
                            <div key={related._id} onClick={() => { setItem(related); setQuantity(1); setSelectedSize('normal'); setSpecialRequest(''); window.scrollTo(0,0); }} className={`min-w-[180px] p-3 rounded-3xl border cursor-pointer transition-all hover:shadow-lg group ${isDark ? 'bg-white/5 border-white/5 hover:border-orange-500/30' : 'bg-white border-gray-100 hover:border-orange-300'}`}>
                                <div className={`w-full h-28 rounded-2xl overflow-hidden mb-3 relative ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}>
                                    {related.imageUrl ? <img src={`http://localhost:3003/uploads/${related.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={related.name}/> : <div className="flex items-center justify-center h-full"><FaUtensils className="text-gray-400"/></div>}
                                </div>
                                <h4 className={`font-bold text-sm line-clamp-1 group-hover:text-[#ffaa00] transition-colors px-1 ${textMain}`}>{related.name}</h4>
                                <p className={`text-xs font-bold mt-1 px-1 ${textSub}`}>Rs. {related.normalPrice}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Sticky Footer Action */}
        <div className={`absolute bottom-0 left-0 right-0 backdrop-blur-md border-t p-5 md:p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-30 ${isDark ? 'bg-[#111]/90 border-white/5' : 'bg-white/90 border-gray-100'}`}>
            <button onClick={handleAddToCart} className="w-full bg-[#ffaa00] text-white h-16 rounded-2xl font-bold text-lg md:text-xl shadow-xl hover:bg-orange-600 hover:shadow-orange-500/30 transition-all transform active:scale-[0.98] flex items-center justify-between px-8">
                <span className="flex items-center"><FaShoppingCart className="mr-3" /> {cartItem ? 'Update Order' : 'Add to Order'}</span>
                <span>Rs. {(getPrice() * quantity).toFixed(2)}</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default MenuItemDetails;