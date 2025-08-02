import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

// NEW: Import the map component
import MapComponent from '../components/MapComponent';

const CartPage = () => {
  const { cartItems, incrementQuantity, decrementQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [orderMessage, setOrderMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert, showPrompt } = useModal();

  // NEW state for delivery location
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setOrderMessage('');

    const token = sessionStorage.getItem(Object.keys(sessionStorage).find(key => key.startsWith('token_')));
    if (!token) {
      showAlert('Error: You must be logged in to checkout.');
      setLoading(false);
      return;
    }

    if (cartItems.length === 0) {
      showAlert('Error: Your cart is empty.');
      setLoading(false);
      return;
    }

    const firstRestaurantId = cartItems[0].restaurantId;
    const allSameRestaurant = cartItems.every(item => item.restaurantId === firstRestaurantId);

    if (!firstRestaurantId || !allSameRestaurant) {
      showAlert("Error: All items in the cart must be from the same restaurant. Please clear your cart and try again.");
      setLoading(false);
      return;
    }

    // NEW: Check if a delivery location has been selected
    if (!deliveryLocation) {
      showAlert('Please select your delivery location on the map.');
      setLoading(false);
      return;
    }

    showPrompt(
      "Confirm Delivery Address",
      "Please enter your detailed delivery address:",
      "Your full address",
      async (deliveryAddress) => {
        if (!deliveryAddress || deliveryAddress.trim() === '') {
          showAlert('Delivery address is required to place the order.');
          setLoading(false);
          return;
        }

        const orderItems = cartItems.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          price: (item.size === 'full' ? (item.normalPrice + (item.extraPriceForFull || 0)) : item.normalPrice) || 0,
          quantity: item.quantity,
          size: item.size,
        }));

        const totalAmount = getCartTotal();

        const orderData = {
          restaurantId: firstRestaurantId,
          items: orderItems,
          totalAmount: totalAmount,
          deliveryAddress: deliveryAddress,
          deliveryLocation: deliveryLocation, // NEW: Add location to order data
        };

        try {
          const response = await axios.post('http://localhost:3000/api/orders', orderData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          showAlert(`Order placed successfully! Order ID: ${response.data._id}`);
          clearCart();
          setTimeout(() => navigate('/my-orders'), 2000);
        } catch (err) {
          const msg = err.response?.data?.error || 'Failed to place order.';
          showAlert(`Error: ${msg}`);
          console.error('Checkout error:', err.response ? err.response.data : err);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        showAlert('Order placement cancelled.');
      }
    );
  };

  return (
    <div className="p-6 pt-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Cart</h1>
      
      {/* NEW: Map for location selection */}
      {cartItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Delivery Location</h2>
          <p className="text-gray-600 mb-4">Click on the map to set your precise delivery location.</p>
          <MapComponent onLocationSelect={setDeliveryLocation} />
          {deliveryLocation && (
            <p className="mt-4 text-green-700 font-semibold text-sm">
              Location selected: Longitude: {deliveryLocation.coordinates[0].toFixed(4)}, Latitude: {deliveryLocation.coordinates[1].toFixed(4)}
            </p>
          )}
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
                    <p className="text-md font-bold text-gray-900">Rs. {((item.size === 'full' ? (item.normalPrice + (item.extraPriceForFull || 0)) : item.normalPrice) || 0).toFixed(2)}</p>
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
            disabled={loading || !deliveryLocation}
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
