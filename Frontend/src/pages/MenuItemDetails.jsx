import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, FaMinus, FaPlus, FaShoppingCart, FaUtensils, 
  FaHeart, FaShareAlt, FaFire, FaLeaf, FaClock, FaInfoCircle 
} from 'react-icons/fa';
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

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      
      {/* 1. Left Side: Immersive Hero Image */}
      <div className="relative w-full md:w-1/2 h-[45vh] md:h-screen bg-gray-900 group overflow-hidden">
        {/* Header Controls */}
        <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-start">
            <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
            >
            <FaArrowLeft />
            </button>
            <div className="flex space-x-3">
                <button className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#ffaa00] transition-all duration-300 shadow-lg">
                    <FaShareAlt />
                </button>
                <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`w-12 h-12 rounded-full bg-black/20 backdrop-blur-lg border border-white/10 flex items-center justify-center transition-all duration-300 shadow-lg ${isFavorite ? 'text-red-500 bg-white' : 'text-white hover:bg-white hover:text-red-500'}`}
                >
                    <FaHeart />
                </button>
            </div>
        </div>

        {item.imageUrl ? (
          <img 
            src={`http://localhost:3003/uploads/${item.imageUrl}`} 
            alt={item.name} 
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[3s]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-100">
            <FaUtensils size={80} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 md:bg-gradient-to-r md:from-transparent md:to-black/70"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
            <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-1.5 bg-[#ffaa00] text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                    {item.category}
                </span>
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center border border-white/10">
                    <FaClock className="mr-2" /> 15-20 min
                </span>
                <span className="px-4 py-1.5 bg-green-500/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center border border-white/10">
                    <FaLeaf className="mr-2" /> Fresh
                </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-none mb-4 drop-shadow-2xl">{item.name}</h1>
            <p className="text-gray-300 font-medium text-lg opacity-90 max-w-md">
                Crafted with care by <span className="text-white font-bold underline decoration-[#ffaa00] underline-offset-4">{restaurant?.name}</span>
            </p>
        </div>
      </div>

      {/* 2. Right Side: Detailed Content */}
      <div className="w-full md:w-1/2 flex flex-col h-[55vh] md:h-screen bg-white relative rounded-t-[3rem] md:rounded-none -mt-12 md:mt-0 z-20 shadow-[0_-20px_60px_rgba(0,0,0,0.3)] md:shadow-none">
        
        <div className="flex-1 overflow-y-auto px-6 py-10 md:px-16 md:py-12 pb-32 custom-scrollbar">
            
            {/* Description Section */}
            <div className="mb-10">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-4">About this Dish</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                    Enjoy the authentic taste of our {item.name}. Prepared with fresh ingredients and signature spices, this dish is a customer favorite for a reason. Perfect for lunch or dinner.
                </p>
            </div>

            {/* Ingredients / Tags (Mock Data for UI) */}
            <div className="mb-10">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-4">Key Ingredients</h3>
                <div className="flex flex-wrap gap-3">
                    {['Fresh Vegetables', 'Signature Sauce', 'Organic Spices', 'Chef Special'].map((tag, i) => (
                        <span key={i} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Size Selection */}
            <div className="mb-10">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-5">Choose Size</h3>
                <div className="space-y-3">
                    <label className={`group flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedSize === 'normal' ? 'border-[#ffaa00] bg-orange-50/40' : 'border-gray-100 hover:border-gray-200'}`}>
                        <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${selectedSize === 'normal' ? 'border-[#ffaa00]' : 'border-gray-300'}`}>
                                {selectedSize === 'normal' && <div className="w-3 h-3 rounded-full bg-[#ffaa00]"></div>}
                            </div>
                            <div>
                                <span className="block font-bold text-lg text-gray-900">Normal</span>
                                <span className="text-xs text-gray-500 font-medium">Standard serving (1 person)</span>
                            </div>
                        </div>
                        <span className="font-bold text-gray-900">Rs. {(item.normalPrice || 0).toFixed(0)}</span>
                        <input type="radio" name="size" className="hidden" checked={selectedSize === 'normal'} onChange={() => setSelectedSize('normal')} />
                    </label>

                    {(item.extraPriceForFull || 0) > 0 && (
                        <label className={`group flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedSize === 'full' ? 'border-[#ffaa00] bg-orange-50/40' : 'border-gray-100 hover:border-gray-200'}`}>
                            <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${selectedSize === 'full' ? 'border-[#ffaa00]' : 'border-gray-300'}`}>
                                    {selectedSize === 'full' && <div className="w-3 h-3 rounded-full bg-[#ffaa00]"></div>}
                                </div>
                                <div>
                                    <span className="block font-bold text-lg text-gray-900">Full Portion</span>
                                    <span className="text-xs text-gray-500 font-medium">Large serving (2 people)</span>
                                </div>
                            </div>
                            <span className="font-bold text-gray-900">+ Rs. {item.extraPriceForFull}</span>
                            <input type="radio" name="size" className="hidden" checked={selectedSize === 'full'} onChange={() => setSelectedSize('full')} />
                        </label>
                    )}
                </div>
            </div>

            {/* Note to Kitchen */}
            <div className="mb-10">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-4">Special Request</h3>
                <textarea 
                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#ffaa00] focus:bg-white focus:ring-0 outline-none transition-all text-gray-700 text-sm resize-none font-medium placeholder-gray-400"
                    rows="3"
                    placeholder="e.g. No onions, extra spicy, cut in half..."
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                ></textarea>
            </div>

            {/* Quantity */}
            <div className="mb-12">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-6">Quantity</h3>
                <div className="flex items-center space-x-8">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-14 h-14 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold transition-colors text-gray-600 hover:text-black">-</button>
                    <span className="text-4xl font-black text-gray-900">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-14 h-14 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold transition-colors text-gray-600 hover:text-black">+</button>
                </div>
            </div>

            {/* More Items */}
            {relatedItems.length > 0 && (
                <div className="pt-10 border-t border-gray-100">
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                        <FaFire className="mr-2 text-orange-500" /> Pairs Well With
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
                                className="min-w-[180px] bg-white p-3 rounded-3xl border border-gray-100 hover:border-orange-300 cursor-pointer transition-all hover:shadow-lg group"
                            >
                                <div className="w-full h-28 rounded-2xl bg-gray-200 overflow-hidden mb-3 relative">
                                    {related.imageUrl ? (
                                        <img src={`http://localhost:3003/uploads/${related.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={related.name}/>
                                    ) : <div className="flex items-center justify-center h-full"><FaUtensils className="text-gray-400"/></div>}
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-[#ffaa00] transition-colors px-1">{related.name}</h4>
                                <p className="text-xs text-gray-500 font-bold mt-1 px-1">Rs. {related.normalPrice}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Sticky Footer Action */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-5 md:p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-30">
            <button
                onClick={handleAddToCart}
                className="w-full bg-gray-900 text-white h-16 rounded-2xl font-bold text-lg md:text-xl shadow-xl hover:bg-[#ffaa00] hover:shadow-orange-500/30 transition-all transform active:scale-[0.98] flex items-center justify-between px-8"
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