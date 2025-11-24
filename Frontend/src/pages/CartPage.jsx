import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaMapMarkerAlt, FaArrowRight, FaCreditCard, FaShoppingBag, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import MapComponent from '../components/MapComponent';
import PageLoader from '../components/PageLoader';

const CartPage = () => {
  const { cartItems, incrementQuantity, decrementQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useModal();
  
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [deliveryAddressInput, setDeliveryAddressInput] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
     setTimeout(() => setIsMapReady(true), 500);
  }, []);

  const handleCheckout = async () => {
    if (loading) return;
    
    const token = sessionStorage.getItem(Object.keys(sessionStorage).find(key => key.startsWith('token_')));
    if (!token) {
      showAlert('Please log in to complete your order.');
      return;
    }

    if (cartItems.length === 0) {
      showAlert('Your cart is empty.');
      return;
    }

    const firstRestaurantId = cartItems[0].restaurantId;
    if (!cartItems.every(item => item.restaurantId === firstRestaurantId)) {
      showAlert("Multi-restaurant orders are not supported. Please clear cart.");
      return;
    }

    if (!deliveryLocation || !deliveryLocation.coordinates) {
      showAlert('Please pin your delivery location on the map.');
      return;
    }

    showConfirm(
      `Place order to: ${deliveryAddressInput.trim() || 'Pinned Location'}?`,
      async () => {
        setLoading(true);
        const orderItems = cartItems.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          price: (item.size === 'full' ? (item.normalPrice + (item.extraPriceForFull || 0)) : item.normalPrice) || 0,
          quantity: item.quantity,
          size: item.size,
        }));

        const orderData = {
          restaurantId: firstRestaurantId,
          items: orderItems,
          totalAmount: getCartTotal(),
          deliveryAddress: deliveryAddressInput.trim(),
          deliveryLocation: {
            type: 'Point',
            coordinates: [deliveryLocation.coordinates[0], deliveryLocation.coordinates[1]],
          },
        };

        try {
          const response = await axios.post('http://localhost:3000/api/orders', orderData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          });

          showAlert(`Order #${response.data._id.substring(0,8)} placed successfully!`);
          clearCart();
          navigate('/my-orders');
        } catch (err) {
          showAlert(`Error: ${err.response?.data?.error || 'Failed to place order.'}`);
        } finally {
          setLoading(false);
        }
      },
      () => {}
    );
  };

  if (!isMapReady) return <PageLoader />;

  // --- 1. PROFESSIONAL EMPTY STATE (Matches Dashboard/Orders) ---
  if (cartItems.length === 0) {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center px-4">
            <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-gray-100 animate-fade-in-up max-w-lg w-full p-10">
                <div className="bg-orange-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 text-[#ffaa00] text-5xl shadow-inner animate-bounce">
                    <FaShoppingBag />
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-3">Your Cart is Empty</h3>
                <p className="text-gray-500 text-lg">Looks like you haven't added any food yet.</p>
                <button 
                    onClick={() => navigate('/restaurants')}
                    className="mt-10 bg-gray-900 text-white px-10 py-4 rounded-full font-bold hover:bg-[#e59400] transition-all shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-1 outline-none focus:outline-none focus:ring-0"
                >
                    Browse Restaurants
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-10 tracking-tight">
            Secure <span className="text-[#ffaa00]">Checkout</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: Items & Delivery */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Order Summary Card */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8 animate-fade-in-up">
                    <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center">
                        <span className="bg-orange-50 text-[#ffaa00] p-3 rounded-xl mr-4"><FaShoppingBag /></span>
                        Order Summary
                    </h2>
                    
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div key={`${item.menuItemId}-${item.size}`} className="flex gap-4 md:gap-6 items-start pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                {/* Item Image */}
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                                    {item.imageUrl ? (
                                        <img src={`http://localhost:3003/uploads/${item.imageUrl}`} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xs">IMG</div>
                                    )}
                                </div>

                                {/* Item Details */}
                                <div className="flex-1 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{item.category} • {item.size}</p>
                                        <p className="text-[#ffaa00] font-black text-lg">Rs. {((item.size === 'full' ? (item.normalPrice + (item.extraPriceForFull || 0)) : item.normalPrice) || 0).toFixed(2)}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                            <button onClick={() => decrementQuantity(item.menuItemId, item.size)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition"><FaMinus size={10}/></button>
                                            <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                                            <button onClick={() => incrementQuantity(item.menuItemId, item.size)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition"><FaPlus size={10}/></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.menuItemId, item.size)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition">
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery Details Card */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center">
                        <span className="bg-blue-50 text-blue-500 p-3 rounded-xl mr-4"><FaMapMarkerAlt /></span>
                        Delivery Location
                    </h2>

                    <div className="space-y-6">
                        {/* Map Container */}
                        <div className="h-64 w-full rounded-2xl overflow-hidden border-4 border-gray-50 relative shadow-inner">
                            <MapComponent 
                                onLocationSelect={setDeliveryLocation} 
                                initialPosition={deliveryLocation ? { lat: deliveryLocation.coordinates[1], lng: deliveryLocation.coordinates[0] } : null} 
                            />
                            {!deliveryLocation && (
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-[400] pointer-events-none">
                                    <div className="bg-white px-6 py-3 rounded-full shadow-2xl text-sm font-bold text-gray-800 flex items-center animate-bounce">
                                        <FaMapMarkerAlt className="text-red-500 mr-2" /> Tap map to pin location
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Address Input */}
                        <div>
                            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3 ml-1">Complete Address</label>
                            <textarea
                                rows="2"
                                value={deliveryAddressInput}
                                onChange={(e) => setDeliveryAddressInput(e.target.value)}
                                placeholder="e.g. House No, Street, Floor, Landmark..."
                                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-[#ffaa00] focus:ring-0 outline-none transition-all font-medium text-gray-700 resize-none placeholder-gray-400"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Summary Sticky */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8 sticky top-28 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-xl font-extrabold text-gray-900 mb-8">Payment Summary</h2>
                    
                    <div className="space-y-4 mb-8 border-b border-gray-100 pb-8">
                        <div className="flex justify-between text-gray-500 font-medium text-sm">
                            <span>Subtotal</span>
                            <span className="text-gray-900 font-bold">Rs. {getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 font-medium text-sm">
                            <span>Delivery Fee</span>
                            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">Free</span>
                        </div>
                        <div className="flex justify-between text-2xl font-black text-gray-900 pt-4">
                            <span>Total</span>
                            <span>Rs. {getCartTotal().toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading || !deliveryLocation}
                        className={`
                            w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all transform active:scale-95 flex items-center justify-center outline-none focus:outline-none
                            ${loading || !deliveryLocation 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-900 text-white hover:bg-[#ffaa00] hover:shadow-orange-500/30'}
                        `}
                    >
                        {loading ? (
                            <span className="flex items-center"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div> Processing...</span>
                        ) : (
                            <span className="flex items-center">Confirm Order <FaArrowRight className="ml-2 text-sm"/></span>
                        )}
                    </button>
                    
                    {!deliveryLocation && (
                         <p className="text-center text-red-500 text-xs font-bold mt-4 animate-pulse flex items-center justify-center">
                             <FaMapMarkerAlt className="mr-1.5" /> Please pin a location on the map
                         </p>
                    )}

                    <div className="mt-8 flex justify-center items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        <FaCreditCard /> 100% Secure Checkout
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;