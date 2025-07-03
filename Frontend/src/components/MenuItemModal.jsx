import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext'; // Import useCart hook

// Accept restaurantId as a prop
const MenuItemModal = ({ item, onClose, restaurantId }) => {
  const { addToCart, cartItems, incrementQuantity, decrementQuantity, removeFromCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('normal');
  const [quantity, setQuantity] = useState(1);

  // Find if this item (with current size) is already in the cart
  const cartItem = cartItems.find(
    cartIt => cartIt.menuItemId === item._id && cartIt.size === selectedSize
  );

  useEffect(() => {
    setSelectedSize('normal');
    setQuantity(1);
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
    // FIX: Pass restaurantId as the fourth argument to addToCart
    addToCart(item, quantity, selectedSize, restaurantId);
    onClose();
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
    if (cartItem) {
      incrementQuantity(item._id, selectedSize);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      if (cartItem) {
        decrementQuantity(item._id, selectedSize);
      }
    } else {
      removeFromCart(item._id, selectedSize);
      setQuantity(0);
      onClose();
    }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(item._id, selectedSize);
    setQuantity(0);
    onClose();
  };


  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">{item.name}</h2>

        {item.imageUrl && (
          <img
            src={`http://localhost:3003/uploads/${item.imageUrl}`}
            alt={item.name}
            className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
          />
        )}

        <div className="space-y-3 mb-6">
          <p className="text-gray-700"><strong>Category:</strong> {item.category}</p>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="size"
                value="normal"
                checked={selectedSize === 'normal'}
                onChange={() => setSelectedSize('normal')}
                className="form-radio h-5 w-5 text-[#ffaa00] focus:ring-[#ffaa00]"
              />
              <span className="ml-2 text-gray-800 font-medium">Normal (Rs. {(item.normalPrice || 0).toFixed(2)})</span>
            </label>
            {(item.extraPriceForFull || 0) > 0 && (
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="size"
                  value="full"
                  checked={selectedSize === 'full'}
                  onChange={() => setSelectedSize('full')}
                  className="form-radio h-5 w-5 text-[#ffaa00] focus:ring-[#ffaa00]"
                />
                <span className="ml-2 text-gray-800 font-medium">Full (+Rs. {(item.extraPriceForFull || 0).toFixed(2)})</span>
              </label>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">Current Price: Rs. {getPrice().toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
            <button
              onClick={handleDecrement}
              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-300 transition"
            >
              -
            </button>
            <span className="font-semibold text-lg text-gray-800 w-8 text-center">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-300 transition"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-[#ffaa00] text-white px-6 py-3 rounded-lg hover:bg-[#e59400] transition font-semibold text-lg shadow-md"
          >
            {cartItem ? 'Update Cart' : 'Add to Cart'}
          </button>
        </div>
        {cartItem && (
          <button
            onClick={handleRemoveFromCart}
            className="w-full mt-4 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-semibold text-lg shadow-md"
          >
            Remove from Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItemModal;
