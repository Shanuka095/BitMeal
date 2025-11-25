import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, FaThumbsUp, FaThumbsDown, FaArrowLeft, FaUtensils, FaMotorcycle, FaCheckCircle 
} from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import PageLoader from '../components/PageLoader';

const RateOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useModal();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [driverRating, setDriverRating] = useState(0);
  const [restaurantLikeStatus, setRestaurantLikeStatus] = useState(null);
  const [driverLikeStatus, setDriverLikeStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [hoverResStar, setHoverResStar] = useState(0);
  const [hoverDrvStar, setHoverDrvStar] = useState(0);

  // --- FIX: Force Scroll to Top on Load ---
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!order) {
      const fetchOrder = async () => {
        try {
          const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
          const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
          if (!token) { navigate('/login'); return; }

          const response = await axios.get('http://localhost:3000/api/orders/my-orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const foundOrder = response.data.find(o => o._id === orderId);
          
          if (foundOrder) {
             if (!foundOrder.restaurantDetails) {
                 try {
                    const resRes = await axios.get(`http://localhost:3000/api/restaurants/public/${foundOrder.restaurantId}`);
                    foundOrder.restaurantDetails = resRes.data;
                 } catch (e) {}
             }
             if (foundOrder.deliveryPersonId && !foundOrder.driverDetails) {
                 try {
                    const driverRes = await axios.get(`http://localhost:3000/api/delivery/${foundOrder.deliveryPersonId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    foundOrder.driverDetails = driverRes.data;
                 } catch (e) {}
             }
             setOrder(foundOrder);
          } else {
            navigate('/my-orders');
          }
        } catch (err) {
          console.error(err);
          navigate('/my-orders');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderId, navigate]);

  const handleSubmit = async () => {
    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
    
    const payload = {
        restaurantRating: order.restaurantRated ? null : restaurantRating,
        driverRating: order.driverRated ? null : driverRating,
        restaurantLikeStatus: order.restaurantRated ? null : restaurantLikeStatus,
        driverLikeStatus: order.driverRated ? null : driverLikeStatus,
    };

    if ((!order.restaurantRated && restaurantRating === 0) || 
        (order.deliveryPersonId && !order.driverRated && driverRating === 0)) {
        showAlert('Please provide a star rating before submitting.');
        return;
    }

    setSubmitting(true);
    try {
        await axios.post(`http://localhost:3000/api/orders/${orderId}/submit-rating`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        showAlert('Thank you for your feedback!');
        navigate('/my-orders');
    } catch (err) {
        showAlert(err.response?.data?.error || 'Failed to submit rating');
        setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      
      {/* 1. Left Side: Visual Context (Image & Summary) */}
      <div className="relative w-full md:w-5/12 h-[300px] md:h-auto bg-gray-900 overflow-hidden flex flex-col justify-between p-8 md:p-12 text-white">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Food Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>

        {/* Back Button */}
        <button 
          onClick={() => navigate('/my-orders')} 
          className="relative z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Text Content */}
        <div className="relative z-10 mt-auto animate-fade-in-up">
            <span className="inline-block px-3 py-1 bg-[#ffaa00] text-black text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                Order #{order._id.substring(0, 8)}
            </span>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                How was <br/> your experience?
            </h1>
            <p className="text-gray-300 text-lg font-medium max-w-sm">
                Your feedback helps us improve our service and food quality.
            </p>
        </div>
      </div>

      {/* 2. Right Side: Rating Form */}
      <div className="w-full md:w-7/12 bg-white flex flex-col h-full relative">
        <div className="flex-1 overflow-y-auto px-6 py-10 md:px-20 md:py-16">
            
            {/* Restaurant Rating Section */}
            {!order.restaurantRated ? (
                <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ffaa00] flex items-center justify-center text-xl mr-4 shadow-sm">
                            <FaUtensils />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Restaurant</h3>
                            <h2 className="text-2xl font-bold text-gray-900">{order.restaurantDetails?.name || 'Restaurant'}</h2>
                        </div>
                    </div>

                    {/* Star Input */}
                    <div className="flex items-center space-x-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverResStar(star)}
                                onMouseLeave={() => setHoverResStar(0)}
                                onClick={() => setRestaurantRating(star)}
                                className="focus:outline-none transition-transform transform hover:scale-110 active:scale-95"
                            >
                                <FaStar
                                    size={42}
                                    className={`transition-colors duration-200 ${
                                        star <= (hoverResStar || restaurantRating) 
                                        ? 'text-yellow-400 drop-shadow-md' 
                                        : 'text-gray-200'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                    <p className="text-sm font-medium text-[#ffaa00] h-5">
                        {restaurantRating > 0 && (restaurantRating === 5 ? "Excellent!" : restaurantRating === 4 ? "Very Good" : restaurantRating === 3 ? "Good" : "Could be better")}
                    </p>
                </div>
            ) : (
                <div className="mb-12 p-6 bg-green-50 border border-green-100 rounded-2xl flex items-center text-green-700 font-bold">
                    <FaCheckCircle className="mr-3 text-xl" /> You have already rated the restaurant.
                </div>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-gray-100 mb-12"></div>

            {/* Driver Rating Section */}
            {order.deliveryPersonId && !order.driverRated ? (
                <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl mr-4 shadow-sm">
                            <FaMotorcycle />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Delivery</h3>
                            <h2 className="text-2xl font-bold text-gray-900">{order.driverDetails?.name || 'Driver'}</h2>
                        </div>
                    </div>

                    {/* Star Input */}
                    <div className="flex items-center space-x-2 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverDrvStar(star)}
                                onMouseLeave={() => setHoverDrvStar(0)}
                                onClick={() => setDriverRating(star)}
                                className="focus:outline-none transition-transform transform hover:scale-110 active:scale-95"
                            >
                                <FaStar
                                    size={42}
                                    className={`transition-colors duration-200 ${
                                        star <= (hoverDrvStar || driverRating) 
                                        ? 'text-yellow-400 drop-shadow-md' 
                                        : 'text-gray-200'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Thumbs Up/Down */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setDriverLikeStatus('liked')}
                            className={`
                                flex-1 py-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300
                                ${driverLikeStatus === 'liked' 
                                    ? 'border-green-500 bg-green-50 text-green-600 shadow-lg shadow-green-500/20' 
                                    : 'border-gray-100 bg-white text-gray-500 hover:border-green-200 hover:bg-green-50 hover:text-green-600'}
                            `}
                        >
                            <FaThumbsUp className="text-lg" /> Good Service
                        </button>

                        <button
                            onClick={() => setDriverLikeStatus('disliked')}
                            className={`
                                flex-1 py-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300
                                ${driverLikeStatus === 'disliked' 
                                    ? 'border-red-500 bg-red-50 text-red-600 shadow-lg shadow-red-500/20' 
                                    : 'border-gray-100 bg-white text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600'}
                            `}
                        >
                            <FaThumbsDown className="text-lg" /> Issues
                        </button>
                    </div>
                </div>
            ) : null}
        </div>

        {/* Sticky Footer Action */}
        <div className="p-6 md:p-10 border-t border-gray-100 bg-white/95 backdrop-blur-xl sticky bottom-0 z-20">
            <button
                onClick={handleSubmit}
                disabled={submitting || (!order.restaurantRated && restaurantRating === 0)}
                className={`
                    w-full py-5 rounded-2xl font-black text-lg uppercase tracking-wider shadow-xl transition-all transform duration-300
                    ${submitting || (!order.restaurantRated && restaurantRating === 0)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-900 text-white hover:bg-[#ffaa00] hover:shadow-[#ffaa00]/30 hover:-translate-y-1 active:scale-[0.98]'}
                `}
            >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default RateOrder;