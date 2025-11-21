import React, { useState, useEffect } from 'react';
import { FaTimes, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const MenuItemModal = ({ item, onClose, restaurantId }) => {
  const { addToCart, cartItems, incrementQuantity, decrementQuantity, removeFromCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('normal');
  const [quantity, setQuantity] = useState(1);

  const cartItem = cartItems.find(
    cartIt => cartIt.menuItemId === item._id && cartIt.size === selectedSize
  );

  useEffect(() => {
    setSelectedSize('normal');
    setQuantity(1);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    return () => { document.body.style.overflow = 'unset'; };
  }, [item]);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem, selectedSize]);

  const getPrice = () => {
    const normalPrice = item.normalPrice || 0;
    const extraPriceForFull = item.extraPriceForFull || 0;
    return selectedSize === 'full' ? normalPrice + extraPriceForFull : normalPrice;
  };

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedSize, restaurantId);
    onClose();
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
    if (cartItem) incrementQuantity(item._id, selectedSize);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      if (cartItem) decrementQuantity(item._id, selectedSize);
    } else {
      removeFromCart(item._id, selectedSize);
      setQuantity(0);
      onClose();
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Container - Constrained Height with Flex Column */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden transform transition-all scale-100 animate-fade-in-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-white/90 p-2 rounded-full text-gray-600 hover:text-red-500 shadow-sm backdrop-blur-md transition-colors"
        >
          <FaTimes size={18} />
        </button>

        {/* 1. Header Image (Fixed at top) */}
        <div className="relative h-48 sm:h-56 flex-shrink-0">
          {item.imageUrl ? (
            <img
              src={`http://localhost:3003/uploads/${item.imageUrl}`}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              <span className="text-sm font-medium">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-4 left-6 pr-4">
             <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md leading-tight">{item.name}</h2>
             <p className="text-gray-200 text-xs sm:text-sm font-medium mt-1">{item.category}</p>
          </div>
        </div>

        {/* 2. Scrollable Body (Options) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Portion Size</label>
            
            <div className="space-y-3">
              {/* Normal Size */}
              <label 
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedSize === 'normal' 
                    ? 'border-[#ffaa00] bg-orange-50/50' 
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${selectedSize === 'normal' ? 'border-[#ffaa00]' : 'border-gray-300'}`}>
                    {selectedSize === 'normal' && <div className="w-2.5 h-2.5 rounded-full bg-[#ffaa00]"></div>}
                  </div>
                  <span className={`font-bold ${selectedSize === 'normal' ? 'text-gray-900' : 'text-gray-600'}`}>Normal</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">Rs. {(item.normalPrice || 0).toFixed(0)}</span>
                <input type="radio" name="size" className="hidden" checked={selectedSize === 'normal'} onChange={() => setSelectedSize('normal')} />
              </label>

              {/* Full Size */}
              {(item.extraPriceForFull || 0) > 0 && (
                <label 
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedSize === 'full' 
                      ? 'border-[#ffaa00] bg-orange-50/50' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${selectedSize === 'full' ? 'border-[#ffaa00]' : 'border-gray-300'}`}>
                      {selectedSize === 'full' && <div className="w-2.5 h-2.5 rounded-full bg-[#ffaa00]"></div>}
                    </div>
                    <span className={`font-bold ${selectedSize === 'full' ? 'text-gray-900' : 'text-gray-600'}`}>Full</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">+ Rs. {item.extraPriceForFull}</span>
                  <input type="radio" name="size" className="hidden" checked={selectedSize === 'full'} onChange={() => setSelectedSize('full')} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* 3. Sticky Footer (Price & Add Button) */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
             <span className="text-gray-500 font-medium text-sm">Total Amount</span>
             <span className="text-2xl font-black text-gray-900">Rs. {(getPrice() * quantity).toFixed(2)}</span>
          </div>

          <div className="flex gap-3">
            {/* Quantity */}
            <div className="flex items-center bg-gray-100 rounded-xl px-1">
              <button onClick={handleDecrement} className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-red-600 transition text-lg font-bold">-</button>
              <span className="w-8 text-center font-bold text-lg text-gray-800">{quantity}</span>
              <button onClick={handleIncrement} className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-green-600 transition text-lg font-bold">+</button>
            </div>

            {/* Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#ffaa00] text-white h-12 rounded-xl font-bold text-base shadow-lg hover:bg-[#e59400] transition-all transform active:scale-95 flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2 text-sm" />
              {cartItem ? 'Update Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MenuItemModal;