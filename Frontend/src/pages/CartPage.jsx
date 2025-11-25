import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaMapMarkerAlt, FaArrowRight, FaCreditCard, FaShoppingBag, FaTicketAlt, FaBolt } from 'react-icons/fa';
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
  const [instructions, setInstructions] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);
  
  // Advanced Cart Features
  const [tip, setTip] = useState(0);
  const [isPriority, setIsPriority] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
     setTimeout(() => setIsMapReady(true), 500);
  }, []);

  // -- FEE CALCULATIONS --
  const subtotal = getCartTotal();
  const deliveryFee = isPriority ? 150 : 0;
  const serviceFee = subtotal * 0.05; 
  const finalTotal = subtotal + deliveryFee + serviceFee + tip;

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
      `Confirm order total Rs. ${finalTotal.toFixed(2)}?`,
      async () => {
        setLoading(true);
        const orderItems = cartItems.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          price: (item.size === 'full' ? (item.normalPrice + (item.extraPriceForFull || 0)) : item.normalPrice) || 0,
          quantity: item.quantity,
          size: item.size,
        }));

        const fullAddress = `${deliveryAddressInput.trim()} ${instructions ? `(Note: ${instructions})` : ''}`;

        const orderData = {
          restaurantId: firstRestaurantId,
          items: orderItems,
          totalAmount: finalTotal,
          // SENDING BREAKDOWN TO BACKEND TO MATCH CALCULATIONS
          deliveryFee: deliveryFee,
          serviceFee: serviceFee,
          tip: tip,
          deliveryAddress: fullAddress,
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

  // --- PROFESSIONAL EMPTY STATE ---
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
                    className="mt-10 bg-gray-900 text-white px-10 py-4 rounded-full font-bold hover:bg-[#ffaa00] hover:text-white transition-all shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-1 outline-none focus:outline-none focus:ring-0"
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
        <div className="flex items-end gap-4 mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Secure <span className="text-[#ffaa00]">Checkout</span>
            </h1>
            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-2">{cartItems.length} Items</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Order Items */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8 animate-fade-in-up">
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div key={`${item.menuItemId}-${item.size}`} className="flex gap-4 md:gap-6 items-center pb-6 border-b border-gray-50 last:border-0 last:pb-0 group">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100 relative">
                                    {item.imageUrl ? (
                                        <img src={`http://localhost:3003/uploads/${item.imageUrl}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xs">IMG</div>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{item.category} • <span className="text-gray-600">{item.size}</span></p>
                                        <p className="text-[#ffaa00] font-black text-lg">Rs. {((item.size === 'full' ? (item.normalPrice + (item.extraPriceForFull || 0)) : item.normalPrice) || 0).toFixed(2)}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-gray-50 rounded-xl p-1.5 border border-gray-100 shadow-inner">
                                            <button onClick={() => decrementQuantity(item.menuItemId, item.size)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white rounded-lg transition shadow-sm font-bold">-</button>
                                            <span className="w-8 text-center font-bold text-sm text-gray-800">{item.quantity}</span>
                                            <button onClick={() => incrementQuantity(item.menuItemId, item.size)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white rounded-lg transition shadow-sm font-bold">+</button>
                                        </div>
                                        
                                        {/* VISIBLE RED DELETE BUTTON */}
                                        <button 
                                            onClick={() => removeFromCart(item.menuItemId, item.size)} 
                                            className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-500/30"
                                        >
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
                        Delivery Details
                    </h2>

                    <div className="space-y-6">
                        <div className="h-64 w-full rounded-3xl overflow-hidden border-4 border-gray-50 relative shadow-inner">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3 ml-1">Address</label>
                                <input
                                    type="text"
                                    value={deliveryAddressInput}
                                    onChange={(e) => setDeliveryAddressInput(e.target.value)}
                                    placeholder="Apt / Street / House No."
                                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-[#ffaa00] focus:ring-0 outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3 ml-1">Instructions</label>
                                <input
                                    type="text"
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="e.g. Gate code 1234"
                                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-[#ffaa00] focus:ring-0 outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-xl mr-4 ${isPriority ? 'bg-orange-100 text-[#ffaa00]' : 'bg-gray-200 text-gray-500'}`}>
                                    <FaBolt />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">Priority Delivery</p>
                                    <p className="text-xs text-gray-500">Direct to you, no stops.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsPriority(!isPriority)}
                                className={`w-14 h-8 rounded-full flex items-center transition-colors duration-300 px-1 ${isPriority ? 'bg-[#ffaa00]' : 'bg-gray-300'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isPriority ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Sticky Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8 sticky top-28 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-xl font-extrabold text-gray-900 mb-8">Payment Summary</h2>
                    
                    <div className="relative mb-8">
                         <input 
                             type="text" 
                             placeholder="Promo Code" 
                             value={promoCode}
                             onChange={(e) => setPromoCode(e.target.value)}
                             className="w-full bg-gray-50 p-4 pl-12 rounded-2xl border-2 border-transparent focus:bg-white focus:border-[#ffaa00] focus:ring-0 outline-none transition-all font-bold text-sm uppercase tracking-wider"
                         />
                         <FaTicketAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                         <button className="absolute right-2 top-2 bottom-2 bg-gray-200 text-gray-600 px-4 rounded-xl text-xs font-bold hover:bg-[#ffaa00] hover:text-white transition-colors">Apply</button>
                    </div>

                    <div className="mb-8">
                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Driver Tip</label>
                        <div className="flex justify-between gap-2">
                            {[0, 100, 200, 500].map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setTip(amount)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${tip === amount ? 'border-[#ffaa00] bg-orange-50 text-[#ffaa00]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                                >
                                    {amount === 0 ? 'None' : `Rs.${amount}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 mb-8 border-b border-gray-100 pb-8">
                        <div className="flex justify-between text-gray-500 text-sm font-medium">
                            <span>Subtotal</span>
                            <span className="text-gray-900 font-bold">Rs. {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-sm font-medium">
                            <span>Service Fee</span>
                            <span className="text-gray-900 font-bold">Rs. {serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-sm font-medium">
                            <span>Delivery Fee</span>
                            <span className={`font-bold ${isPriority ? 'text-gray-900' : 'text-green-600'}`}>
                                {isPriority ? `Rs. ${deliveryFee.toFixed(2)}` : 'Free'}
                            </span>
                        </div>
                        {tip > 0 && (
                            <div className="flex justify-between text-gray-500 text-sm font-medium">
                                <span>Driver Tip</span>
                                <span className="text-[#ffaa00] font-bold">Rs. {tip.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-end mb-8">
                        <span className="text-gray-400 font-bold text-sm">Total</span>
                        <span className="text-3xl font-black text-gray-900">Rs. {finalTotal.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading || !deliveryLocation}
                        className={`
                            w-full py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all transform active:scale-95 flex items-center justify-center outline-none focus:outline-none
                            ${loading || !deliveryLocation 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-900 text-white hover:bg-[#ffaa00] hover:shadow-orange-500/30'}
                        `}
                    >
                        {loading ? (
                            <span className="flex items-center"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div> Processing...</span>
                        ) : (
                            <span className="flex items-center">Confirm Order <FaArrowRight className="ml-3 text-sm"/></span>
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