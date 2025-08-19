import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import MapComponent from '../components/MapComponent';

const CartPage = () => {
  const { cartItems, incrementQuantity, decrementQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [orderMessage, setOrderMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useModal();
  const [deliveryLocation, setDeliveryLocation] = useState(null); // Map pin location: { type: 'Point', coordinates: [lng, lat] }
  const [deliveryAddressInput, setDeliveryAddressInput] = useState(''); // Manual address input from textarea
  const [showMap, setShowMap] = useState(false); // State to control map visibility

  // DEBUG: Log deliveryLocation whenever it changes
  useEffect(() => {
    console.log('CartPage: deliveryLocation state updated:', deliveryLocation);
  }, [deliveryLocation]);


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

    // Validate map location before proceeding
    if (!deliveryLocation || !deliveryLocation.coordinates || deliveryLocation.coordinates.length !== 2) {
      showAlert('Please select your delivery location on the map by clicking on it.');
      setLoading(false);
      return;
    }

    // Now, show a simple confirmation modal (no text input needed here)
    showConfirm(
      `Confirm your order to the location: "${deliveryAddressInput.trim() || 'No detailed address provided'}"?`, // Use trimmed address or a default message
      async () => { // onConfirm callback
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
          deliveryAddress: deliveryAddressInput.trim(), // Send the trimmed address (can be empty string)
          deliveryLocation: { // Use the location from the map state
            type: 'Point',
            coordinates: [deliveryLocation.coordinates[0], deliveryLocation.coordinates[1]],
          },
        };

        // DEBUG: Log the orderData right before sending
        console.log('CartPage: Order data being sent:', orderData);


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
      () => { // onCancel callback
        setLoading(false); // Re-enable button if prompt is cancelled
        showAlert('Order placement cancelled.');
      }
    );
  };

  return (
    <div className="p-6 pt-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Cart</h1>
      
      {cartItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Details</h2>
          
          {/* Manual Address Input (now optional for button enable, but still sent) */}
          <div className="mb-4">
            <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Delivery Address (Optional):
            </label>
            <textarea
              id="deliveryAddress"
              rows="3"
              value={deliveryAddressInput}
              onChange={(e) => setDeliveryAddressInput(e.target.value)}
              placeholder="e.g., House No, Street Name, City, Apt/Unit"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
              // removed 'required' attribute from here
            ></textarea>
          </div>

          {/* Map Toggle Button */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center text-sm font-semibold mb-4"
          >
            <FaMapMarkerAlt className="mr-2" /> {showMap ? 'Hide Map' : 'Select/Edit Location on Map'}
          </button>

          {/* Conditional Map Rendering */}
          {showMap && (
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Click on the map to set your precise delivery location.</p>
              <MapComponent onLocationSelect={setDeliveryLocation} initialPosition={deliveryLocation ? { lat: deliveryLocation.coordinates[1], lng: deliveryLocation.coordinates[0] } : null} />
              {deliveryLocation && (
                <p className="mt-2 text-green-700 font-semibold text-sm">
                  Location selected: Longitude: {deliveryLocation.coordinates[0].toFixed(4)}, Latitude: {deliveryLocation.coordinates[1].toFixed(4)}
                </p>
              )}
            </div>
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
            disabled={loading || !deliveryLocation} // Disable if no location or address
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
