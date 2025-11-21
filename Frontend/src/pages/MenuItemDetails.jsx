import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaMinus, FaPlus, FaShoppingCart, FaUtensils, FaHeart, FaShareAlt, FaFire, FaLeaf, FaClock } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import PageLoader from '../components/PageLoader';

const MenuItemDetails = () => {
  const { id, menuId } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, cartItems } = useCart();
  const { showAlert } = useModal();

  const [item, setItem] = useState(location.state?.item || null);
  const [restaurant, setRestaurant] = useState(location.state?.restaurant || null);
  const [loading, setLoading] = useState(!location.state?.item);
  
  const [selectedSize, setSelectedSize] = useState('normal');
  const [quantity, setQuantity] = useState(1);
  const [relatedItems, setRelatedItems] = useState([]);
  const [specialRequest, setSpecialRequest] = useState(''); // New Feature: Special Request
  const [isFavorite, setIsFavorite] = useState(false); // New Feature: Favorite Toggle

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
                    .slice(0, 3);
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
    // In a real app, we would pass 'specialRequest' to the cart here
    addToCart(item, quantity, selectedSize, restaurant._id);
    showAlert(`${item.name} added to cart!`);
    navigate(-1);
  };

  if (loading) return <PageLoader />;
  if (!item) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* 1. Left Side: Hero Image */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen bg-gray-900 group">
        {/* Header Controls */}
        <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-start">
            <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
            >
            <FaArrowLeft />
            </button>
            <div className="flex space-x-3">
                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#ffaa00] transition-all duration-300">
                    <FaShareAlt />
                </button>
                <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 ${isFavorite ? 'text-red-500 bg-white' : 'text-white hover:bg-white hover:text-red-500'}`}
                >
                    <FaHeart />
                </button>
            </div>
        </div>

        {item.imageUrl ? (
          <img 
            src={`http://localhost:3003/uploads/${item.imageUrl}`} 
            alt={item.name} 
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2s]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <FaUtensils size={80} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 md:bg-gradient-to-r md:from-transparent md:to-black/60"></div>
        
        <div className="absolute bottom-8 left-8 md:bottom-16 md:left-12 text-white max-w-lg">
            <div className="flex space-x-2 mb-3">
                <span className="px-3 py-1 bg-[#ffaa00] text-black text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                    {item.category}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center">
                    <FaClock className="mr-1" /> 15-20 min
                </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 drop-shadow-xl">{item.name}</h1>
            <p className="text-gray-300 font-medium text-lg leading-relaxed opacity-90">
                A delicious {item.category.toLowerCase()} prepared fresh from {restaurant?.name}. Perfect for any craving.
            </p>
        </div>
      </div>

      {/* 2. Right Side: Scrollable Content */}
      <div className="w-full md:w-1/2 flex flex-col h-[60vh] md:h-screen bg-white relative rounded-t-[2.5rem] md:rounded-none -mt-10 md:mt-0 z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.2)] md:shadow-none">
        
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-12 pb-32 custom-scrollbar">
            
            {/* Section: Size Selection */}
            <div className="mb-10">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.15em] mb-6">Select Portion</h3>
                <div className="space-y-4">
                    <label className={`group flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedSize === 'normal' ? 'border-[#ffaa00] bg-orange-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                        <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${selectedSize === 'normal' ? 'border-[#ffaa00]' : 'border-gray-300'}`}>
                                {selectedSize === 'normal' && <div className="w-3 h-3 rounded-full bg-[#ffaa00]"></div>}
                            </div>
                            <div>
                                <span className="block font-bold text-lg text-gray-900">Normal Portion</span>
                                <span className="text-xs text-gray-500 font-medium">Standard serving size</span>
                            </div>
                        </div>
                        <span className="font-bold text-gray-900">Rs. {(item.normalPrice || 0).toFixed(0)}</span>
                        <input type="radio" name="size" className="hidden" checked={selectedSize === 'normal'} onChange={() => setSelectedSize('normal')} />
                    </label>

                    {(item.extraPriceForFull || 0) > 0 && (
                        <label className={`group flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedSize === 'full' ? 'border-[#ffaa00] bg-orange-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                            <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${selectedSize === 'full' ? 'border-[#ffaa00]' : 'border-gray-300'}`}>
                                    {selectedSize === 'full' && <div className="w-3 h-3 rounded-full bg-[#ffaa00]"></div>}
                                </div>
                                <div>
                                    <span className="block font-bold text-lg text-gray-900">Full Portion</span>
                                    <span className="text-xs text-gray-500 font-medium">Extra large serving</span>
                                </div>
                            </div>
                            <span className="font-bold text-gray-900">+ Rs. {item.extraPriceForFull}</span>
                            <input type="radio" name="size" className="hidden" checked={selectedSize === 'full'} onChange={() => setSelectedSize('full')} />
                        </label>
                    )}
                </div>
            </div>

            {/* Section: Special Request */}
            <div className="mb-10">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.15em] mb-4">Note to Kitchen</h3>
                <textarea 
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#ffaa00] focus:bg-white focus:ring-4 focus:ring-[#ffaa00]/10 outline-none transition-all text-gray-700 text-sm resize-none font-medium"
                    rows="3"
                    placeholder="e.g. No onions, extra spicy..."
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                ></textarea>
            </div>

            {/* Section: Quantity */}
            <div className="mb-12">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.15em] mb-6">Quantity</h3>
                <div className="flex items-center space-x-8">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-14 h-14 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold transition-colors text-gray-600 hover:text-black">-</button>
                    <span className="text-4xl font-black text-gray-900">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-14 h-14 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold transition-colors text-gray-600 hover:text-black">+</button>
                </div>
            </div>

            {/* Section: More from this Category */}
            {relatedItems.length > 0 && (
                <div className="pt-8 border-t border-gray-100">
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.15em] mb-6 flex items-center">
                        <FaFire className="mr-2 text-orange-500" /> Popular in {item.category}
                    </h3>
                    <div className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar">
                        {relatedItems.map(related => (
                            <div 
                                key={related._id} 
                                onClick={() => {
                                    setItem(related);
                                    setQuantity(1);
                                    setSelectedSize('normal');
                                    setSpecialRequest('');
                                    window.scrollTo(0,0); 
                                }}
                                className="min-w-[160px] bg-white p-3 rounded-2xl border border-gray-100 hover:border-orange-200 cursor-pointer transition-all hover:shadow-lg group"
                            >
                                <div className="w-full h-24 rounded-xl bg-gray-200 overflow-hidden mb-3 relative">
                                    {related.imageUrl ? (
                                        <img src={`http://localhost:3003/uploads/${related.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={related.name}/>
                                    ) : <div className="flex items-center justify-center h-full"><FaUtensils className="text-gray-400"/></div>}
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-[#ffaa00] transition-colors">{related.name}</h4>
                                <p className="text-xs text-gray-500 font-medium mt-1">Rs. {related.normalPrice}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Sticky Footer Action */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
            <button
                onClick={handleAddToCart}
                className="w-full bg-gray-900 text-white h-16 rounded-2xl font-bold text-xl shadow-xl hover:bg-[#ffaa00] hover:shadow-orange-500/30 transition-all transform active:scale-[0.98] flex items-center justify-between px-8"
            >
                <span className="flex items-center"><FaShoppingCart className="mr-3" /> {cartItem ? 'Update Order' : 'Add to Order'}</span>
                <span>Rs. {(getPrice() * quantity).toFixed(2)}</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default MenuItemDetails;