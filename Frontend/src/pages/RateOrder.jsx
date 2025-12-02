import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaThumbsUp, FaThumbsDown, FaArrowLeft, FaUtensils, FaMotorcycle, FaCheckCircle } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import PageLoader from '../components/PageLoader';
import { useTheme } from '../context/ThemeContext'; // Theme Hook

const RateOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [driverRating, setDriverRating] = useState(0);
  const [restaurantLikeStatus, setRestaurantLikeStatus] = useState(null);
  const [driverLikeStatus, setDriverLikeStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [hoverResStar, setHoverResStar] = useState(0);
  const [hoverDrvStar, setHoverDrvStar] = useState(0);

  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (!order) {
      const fetchOrder = async () => {
        try {
          const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
          const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
          if (!token) { navigate('/login'); return; }
          const response = await axios.get('http://localhost:3000/api/orders/my-orders', { headers: { Authorization: `Bearer ${token}` } });
          const foundOrder = response.data.find(o => o._id === orderId);
          if (foundOrder) {
             // (Fetch details logic omitted for brevity, assumes similar structure to previous versions)
             setOrder(foundOrder);
          } else { navigate('/my-orders'); }
        } catch (err) { navigate('/my-orders'); } finally { setLoading(false); }
      };
      fetchOrder();
    }
  }, [order, orderId, navigate]);

  const handleSubmit = async () => {
    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
    const payload = { restaurantRating: order.restaurantRated ? null : restaurantRating, driverRating: order.driverRated ? null : driverRating, restaurantLikeStatus: order.restaurantRated ? null : restaurantLikeStatus, driverLikeStatus: order.driverRated ? null : driverLikeStatus };
    if ((!order.restaurantRated && restaurantRating === 0) || (order.deliveryPersonId && !order.driverRated && driverRating === 0)) { showAlert('Please provide a star rating.'); return; }
    setSubmitting(true);
    try {
        await axios.post(`http://localhost:3000/api/orders/${orderId}/submit-rating`, payload, { headers: { Authorization: `Bearer ${token}` } });
        showAlert('Thank you for your feedback!');
        navigate('/my-orders');
    } catch (err) { showAlert(err.response?.data?.error || 'Failed to submit rating'); setSubmitting(false); }
  };

  if (loading) return <PageLoader />;
  if (!order) return null;

  // Theme Classes
  const pageBg = isDark ? 'bg-[#0f0f0f]' : 'bg-white';
  const cardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderClass = isDark ? 'border-white/10' : 'border-gray-100';

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-500 ${pageBg}`}>
      
      {/* Left Side: Hero */}
      <div className="relative w-full md:w-5/12 h-[300px] md:h-auto bg-gray-900 overflow-hidden flex flex-col justify-between p-8 md:p-12 text-white">
        <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="BG" className="absolute inset-0 w-full h-full object-cover opacity-40 animate-scale-in duration-[30s]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
        <button onClick={() => navigate('/my-orders')} className="relative z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 group"><FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /></button>
        <div className="relative z-10 mt-auto animate-fade-in-up">
            <span className="inline-block px-3 py-1 bg-[#ffaa00] text-black text-xs font-bold uppercase tracking-widest rounded-full mb-4">Order #{order._id.substring(0, 8)}</span>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">How was <br/> your experience?</h1>
            <p className="text-gray-300 text-lg font-medium max-w-sm">Your feedback helps us improve.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className={`w-full md:w-7/12 flex flex-col h-full relative transition-colors duration-500 ${cardBg}`}>
        <div className="flex-1 overflow-y-auto px-6 py-10 md:px-20 md:py-16">
            
            {/* Restaurant Rating */}
            {!order.restaurantRated ? (
                <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mr-4 shadow-sm ${isDark ? 'bg-orange-500/10 text-[#ffaa00]' : 'bg-orange-50 text-[#ffaa00]'}`}>
                            <FaUtensils />
                        </div>
                        <div>
                            <h3 className={`text-sm font-bold uppercase tracking-widest ${textSub}`}>Restaurant</h3>
                            <h2 className={`text-2xl font-bold ${textMain}`}>{order.restaurantDetails?.name || 'Restaurant'}</h2>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onMouseEnter={() => setHoverResStar(star)} onMouseLeave={() => setHoverResStar(0)} onClick={() => setRestaurantRating(star)} className="focus:outline-none transition-transform transform hover:scale-110 active:scale-95">
                                <FaStar size={42} className={`transition-colors duration-200 ${star <= (hoverResStar || restaurantRating) ? 'text-yellow-400 drop-shadow-md' : (isDark ? 'text-gray-700' : 'text-gray-200')}`} />
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={`mb-12 p-6 rounded-2xl flex items-center font-bold border ${isDark ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-50 border-green-100 text-green-700'}`}>
                    <FaCheckCircle className="mr-3 text-xl" /> You have already rated the restaurant.
                </div>
            )}

            <div className={`w-full h-px mb-12 ${borderClass}`}></div>

            {/* Driver Rating */}
            {order.deliveryPersonId && !order.driverRated ? (
                <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                     <div className="flex items-center mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mr-4 shadow-sm ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-500'}`}><FaMotorcycle /></div>
                        <div><h3 className={`text-sm font-bold uppercase tracking-widest ${textSub}`}>Delivery</h3><h2 className={`text-2xl font-bold ${textMain}`}>{order.driverDetails?.name || 'Driver'}</h2></div>
                    </div>
                    <div className="flex items-center space-x-2 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onMouseEnter={() => setHoverDrvStar(star)} onMouseLeave={() => setHoverDrvStar(0)} onClick={() => setDriverRating(star)} className="focus:outline-none transition-transform transform hover:scale-110 active:scale-95">
                                <FaStar size={42} className={`transition-colors duration-200 ${star <= (hoverDrvStar || driverRating) ? 'text-yellow-400 drop-shadow-md' : (isDark ? 'text-gray-700' : 'text-gray-200')}`} />
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-4">
                         <button onClick={() => setDriverLikeStatus('liked')} className={`flex-1 py-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${driverLikeStatus === 'liked' ? (isDark ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-green-500 bg-green-50 text-green-600') : (isDark ? 'border-white/10 bg-white/5 text-gray-400 hover:border-green-500/50 hover:text-green-400' : 'border-gray-100 bg-white text-gray-500 hover:border-green-200 hover:text-green-600')}`}><FaThumbsUp className="text-lg" /> Good</button>
                         <button onClick={() => setDriverLikeStatus('disliked')} className={`flex-1 py-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${driverLikeStatus === 'disliked' ? (isDark ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-red-500 bg-red-50 text-red-600') : (isDark ? 'border-white/10 bg-white/5 text-gray-400 hover:border-red-500/50 hover:text-red-400' : 'border-gray-100 bg-white text-gray-500 hover:border-red-200 hover:text-red-600')}`}><FaThumbsDown className="text-lg" /> Issues</button>
                    </div>
                </div>
            ) : null}
        </div>

        <div className={`p-6 md:p-10 border-t sticky bottom-0 z-20 transition-colors duration-500 ${isDark ? 'bg-[#1a1a1a]/95 border-white/5' : 'bg-white/95 border-gray-100'}`}>
            <button onClick={handleSubmit} disabled={submitting || (!order.restaurantRated && restaurantRating === 0)} className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-wider shadow-xl transition-all transform duration-300 ${submitting ? 'bg-gray-700 text-gray-500' : 'bg-[#ffaa00] text-white hover:bg-orange-600 hover:shadow-orange-500/30 hover:-translate-y-1'}`}>
                {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default RateOrder;