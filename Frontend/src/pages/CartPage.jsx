import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, incrementQuantity, decrementQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [orderMessage, setOrderMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setLoading(true);
    setOrderMessage('');
    try {
      const token = sessionStorage.getItem(Object.keys(sessionStorage).find(key => key.startsWith('token_')));
      if (!token) {
        setOrderMessage('Error: You must be logged in to checkout.');
        setLoading(false);
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      // Ensure all items belong to the same restaurant for a single order
      if (cartItems.length === 0) {
        setOrderMessage('Error: Your cart is empty.');
        setLoading(false);
        return;
      }
      const restaurantId = cartItems[0].restaurantId; // Assuming all items are from one restaurant

      const deliveryAddress = prompt("Please confirm your delivery address:");
      if (!deliveryAddress) {
        setOrderMessage('Delivery address is required to place the order.');
        setLoading(false);
        return;
      }

      const orderItems = cartItems.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.size === 'full' ? (item.normalPrice + item.extraPriceForFull) : item.normalPrice,
        quantity: item.quantity,
        size: item.size,
      }));

      const totalAmount = getCartTotal();

      const orderData = {
        restaurantId: restaurantId,
        items: orderItems,
        totalAmount: totalAmount,
        deliveryAddress: deliveryAddress,
      };

      const response = await axios.post('http://localhost:3000/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setOrderMessage(`Order placed successfully! Order ID: ${response.data._id}`);
      clearCart(); // Clear cart after successful order
      // Optionally navigate to order history or a confirmation page
      setTimeout(() => navigate('/my-orders'), 2000);

    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to place order.';
      setOrderMessage(`Error: ${msg}`);
      console.error('Checkout error:', err.response ? err.response.data : err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 pt-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Cart</h1>

      {orderMessage && (
        <div className={`p-3 mb-4 rounded-md text-center ${orderMessage.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {orderMessage}
        </div>
      )}

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">Your cart is empty. Start adding some delicious food!</p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={`${item.menuItemId}-${item.size}`} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center space-x-4">
                  {item.imageUrl && (
                    <img
                      src={`http://localhost:3003/uploads/${item.imageUrl}`}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md shadow-sm"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.category} - {item.size === 'full' ? 'Full Size' : 'Normal Size'}
                    </p>
                    <p className="text-md font-bold text-gray-900">Rs. {((item.size === 'full' ? (item.normalPrice + item.extraPriceForFull) : item.normalPrice) || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => decrementQuantity(item.menuItemId, item.size)}
                      className="bg-gray-200 text-gray-700 w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-300 transition"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="font-semibold text-md text-gray-800 w-7 text-center">{item.quantity}</span>
                    <button
                      onClick={() => incrementQuantity(item.menuItemId, item.size)}
                      className="bg-gray-200 text-gray-700 w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-300 transition"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.menuItemId, item.size)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t pt-4 mt-4">
            <h2 className="text-2xl font-bold text-gray-900">Total:</h2>
            <span className="text-2xl font-bold text-gray-900">Rs. {getCartTotal().toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full mt-6 bg-[#ffaa00] text-white p-3 rounded-lg hover:bg-[#e59400] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-md hover:shadow-lg"
          >
            {loading ? 'Processing Order...' : 'Proceed to Checkout'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
